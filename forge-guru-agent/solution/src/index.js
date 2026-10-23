// Forge Guru — reference solution handler
//
// Design (post-debug): the agent generates ideas dynamically from chat
// context and files any one as a Jira ticket. Four inputs come in from
// the agent: projectKey, summary, description, issueType. The handler
// just validates them, converts the Markdown description to ADF, and
// POSTs to Jira.
//
// Three lessons from the earlier debug marathon — DO NOT un-apply any
// of these without re-reading the comments:
//
//   1. Rovo chat-agent action inputs arrive FLAT on the first argument,
//      not nested under `payload`. Destructure directly off `args`.
//
//   2. The `self` field on Jira's create response comes through the
//      Forge proxy as https://api.atlassian.com/..., not the tenant
//      hostname. Build the browse URL from `args.context.jira.url`
//      (which IS the real tenant URL) instead.
//
//   3. Jira's /rest/api/3/issue endpoint only accepts ADF, not Markdown.
//      Sending Markdown as a single ADF text node stores literal
//      ** and - characters. Convert first.
//
// Each of these was a multi-hour bug. The code and comments below are
// the shape that works.

import api, { route } from '@forge/api';

// ─── Placeholder — Forge still requires at least one function reference
// outside the rovo:agent entry, so we keep this as a no-op.
// Named-function form (NOT arrow-expression-to-const) to match the handler
// shape every other working Forge app in this repo uses.
export async function placeholder() {
  return { ok: true };
}

// ─── tenantUrlFromContext — pull the real Jira tenant origin from the
// Rovo invocation context. See lesson 2 above.
const tenantUrlFromContext = (context) => {
  const url = context?.jira?.url;
  if (!url || typeof url !== 'string') return null;
  try {
    const parsed = new URL(url);
    return `${parsed.protocol}//${parsed.host}`;
  } catch {
    return null;
  }
};

// ─── markdownToAdf — minimal Markdown → ADF converter. See lesson 3 above.
// Deliberately dependency-free. Supports exactly:
//   - `**bold**` runs inside paragraphs
//   - `` `inline code` `` runs inside paragraphs
//   - Paragraph breaks on blank lines
//   - Bullet lists starting with `- `
//   - Numbered lists starting with `1. `, `2. `, etc.
// Not supported: headings, links, nested lists, tables, block quotes,
// horizontal rules, fenced code blocks.
const inlineRunsToAdf = (text) => {
  const nodes = [];
  const regex = /(\*\*[^*]+\*\*|`[^`]+`)/g;
  let lastIndex = 0;
  let match;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push({ type: 'text', text: text.slice(lastIndex, match.index) });
    }
    const token = match[0];
    if (token.startsWith('**')) {
      nodes.push({
        type: 'text',
        text: token.slice(2, -2),
        marks: [{ type: 'strong' }],
      });
    } else {
      nodes.push({
        type: 'text',
        text: token.slice(1, -1),
        marks: [{ type: 'code' }],
      });
    }
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < text.length) {
    nodes.push({ type: 'text', text: text.slice(lastIndex) });
  }
  if (nodes.length === 0) nodes.push({ type: 'text', text: '' });
  return nodes;
};

const markdownToAdf = (markdown) => {
  const lines = String(markdown ?? '').split('\n');
  const blocks = [];
  let currentList = null;
  let currentPara = null;

  const flushPara = () => {
    if (currentPara !== null && currentPara.length > 0) {
      blocks.push({
        type: 'paragraph',
        content: inlineRunsToAdf(currentPara.join(' ')),
      });
    }
    currentPara = null;
  };
  const flushList = () => {
    if (currentList) {
      blocks.push(currentList);
      currentList = null;
    }
  };

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();
    if (line === '') {
      flushPara();
      flushList();
      continue;
    }
    const bulletMatch = line.match(/^-\s+(.*)$/);
    const orderedMatch = line.match(/^\d+\.\s+(.*)$/);
    if (bulletMatch) {
      flushPara();
      if (!currentList || currentList.type !== 'bulletList') {
        flushList();
        currentList = { type: 'bulletList', content: [] };
      }
      currentList.content.push({
        type: 'listItem',
        content: [{ type: 'paragraph', content: inlineRunsToAdf(bulletMatch[1]) }],
      });
    } else if (orderedMatch) {
      flushPara();
      if (!currentList || currentList.type !== 'orderedList') {
        flushList();
        currentList = { type: 'orderedList', content: [] };
      }
      currentList.content.push({
        type: 'listItem',
        content: [{ type: 'paragraph', content: inlineRunsToAdf(orderedMatch[1]) }],
      });
    } else {
      flushList();
      // If the line is a field-label line like "**Problem:** ..." or
      // "**Who it's for:** ...", treat it as the start of a new
      // paragraph even if the previous line was also text. The agent
      // emits these one-per-line without blank-line separators, and
      // joining them into a single paragraph produces a wall of text
      // with no visible structure. Detecting the leading bold label
      // keeps field blocks on their own lines without breaking real
      // prose paragraphs that might legitimately span lines.
      const isFieldLabelLine = /^\*\*[^*]+:\*\*/.test(line);
      if (isFieldLabelLine) flushPara();
      if (currentPara === null) currentPara = [];
      currentPara.push(line);
    }
  }
  flushPara();
  flushList();

  return {
    type: 'doc',
    version: 1,
    content: blocks.length > 0
      ? blocks
      : [{ type: 'paragraph', content: [{ type: 'text', text: '' }] }],
  };
};

// ─── createTicket — the Rovo action handler.
//
// Inputs the agent MUST supply (declared in manifest.yml inputs: block):
//   - projectKey : string   e.g. "FORGE"
//   - summary    : string   one-line title
//   - description: string   full ticket body as Markdown
//   - issueType  : string   (optional) defaults to "Task"
//
// Named-function form, not arrow — see the file-header note about lesson 1.
// Inputs arrive FLAT on `args`, not under `args.payload`.
export async function createTicket(args) {
  console.log('[create-ticket] handler invoked', {
    argKeys: args ? Object.keys(args) : null,
    projectKey: args?.projectKey,
    summary: args?.summary,
    descriptionLength: args?.description?.length ?? 0,
    issueType: args?.issueType,
  });

  const { projectKey, summary, description, issueType, context } = args || {};

  // ─── Input validation ─────────────────────────────────────────────────
  if (!projectKey || !summary || !description) {
    console.warn('[create-ticket] missing required inputs — returning error', {
      hasProjectKey: !!projectKey,
      hasSummary: !!summary,
      hasDescription: !!description,
    });
    return {
      ok: false,
      error: 'projectKey, summary, and description are all required.',
    };
  }

  const normalizedKey = String(projectKey).toUpperCase();
  const effectiveIssueType = (issueType && String(issueType).trim()) || 'Task';

  console.log('[create-ticket] POST /rest/api/3/issue', {
    projectKey: normalizedKey,
    issueType: effectiveIssueType,
  });

  const body = {
    fields: {
      project: { key: normalizedKey },
      summary: String(summary),
      description: markdownToAdf(description),
      issuetype: { name: effectiveIssueType },
    },
  };

  const response = await api
    .asUser()
    .requestJira(route`/rest/api/3/issue`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error('[create-ticket] Jira POST failed', {
      status: response.status,
      body: errorBody,
    });
    return { ok: false, error: `Jira returned ${response.status}: ${errorBody}` };
  }

  const created = await response.json();
  const baseUrl = tenantUrlFromContext(context);
  const browseUrl = baseUrl ? `${baseUrl}/browse/${created.key}` : null;

  console.log('[create-ticket] Jira issue created', {
    key: created.key,
    id: created.id,
    browseUrl,
  });

  return {
    ok: true,
    key: created.key,
    id: created.id,
    url: browseUrl,
  };
}
