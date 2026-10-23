// Lab 2 snippet. The `createTicket` action handler, plus two small helpers
// (tenantUrlFromContext, markdownToAdf) it depends on.
//
// Paste the ENTIRE file content below (everything from `import ...` to the
// closing brace of `createTicket`) into `src/index.js`:
//
//   - If `src/index.js` does NOT already contain `import api, { route }
//     from '@forge/api';` at the top, add it.
//   - Append the two helpers and the `export async function createTicket`
//     export to the BOTTOM of the file, after the existing `placeholder`
//     export.
//
// Do NOT remove or edit the existing `placeholder` function. Forge still
// requires a standalone function module declared in `manifest.yml` under
// `modules.function`.

import api, { route } from '@forge/api';

// ─── tenantUrlFromContext. Pull the real Jira tenant origin from the Rovo
// invocation context. We cannot build the browse URL from Jira's `self`
// response field because api.asUser().requestJira() goes through a Forge
// proxy and the returned `self` has a proxy hostname, not the tenant.
// Rovo always passes the real current-page URL in args.context.jira.url.
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

// ─── markdownToAdf. Minimal Markdown to ADF converter. Jira's
// /rest/api/3/issue endpoint only accepts ADF (Atlassian Document Format)
// for the description field, not Markdown. Sending Markdown as a single
// ADF text node stores the literal ** and - characters verbatim.
//
// Deliberately dependency-free. Supports exactly:
//   - `**bold**` runs inside paragraphs
//   - `` `inline code` `` runs inside paragraphs
//   - Paragraph breaks on blank lines (and on lines that start with a
//     bold field label like `**Problem:**`)
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
      // Field-label lines like `**Problem:** ...` start a new paragraph
      // even without a blank line before them. The agent emits these
      // one-per-line without separators, and joining them into a single
      // paragraph produces an unreadable wall of text.
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

// ─── createTicket. The Rovo action handler.
//
// Inputs the agent MUST supply (declared in manifest.yml inputs: block):
//   - projectKey : string   e.g. "FORGE"
//   - summary    : string   one-line title
//   - description: string   full ticket body as Markdown
//   - issueType  : string   (optional) defaults to "Task"
//
// Named-function form, not arrow, to match the pattern every other
// working Forge app in this repo uses. Inputs arrive FLAT on the first
// argument (args.projectKey, not args.payload.projectKey).
export async function createTicket(args) {
  console.log('[create-ticket] handler invoked', {
    argKeys: args ? Object.keys(args) : null,
    projectKey: args?.projectKey,
    summary: args?.summary,
    descriptionLength: args?.description?.length ?? 0,
    issueType: args?.issueType,
  });

  const { projectKey, summary, description, issueType, context } = args || {};

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
