// Forge Guru — reference solution handler
//
// Design note (2026-10-23): the earlier "agent fills in all four inputs"
// shape (projectKey, summary, description, issueType) produced empty
// payloads at runtime — the handler ran but every input arrived as
// `undefined`. After exhausting prompt and manifest fixes, we flipped
// the design: the handler owns the ticket content via a static library
// of 5 pre-written Forge app ideas. The agent only has to pick ONE of
// FIVE numbers (1–5) and extract ONE project key (e.g. "FORGE") from
// the chat. Two tiny inputs, both appearing explicitly in the user's
// message. If this still produces undefined payloads, the problem is
// definitively in Rovo's input-binding layer, not in anything we wrote.
//
// The library below is also what Forge Guru's agent prompt is instructed
// to pitch — keep the two in sync.

import api, { route } from '@forge/api';

// ─── Static library of pitch ideas ──────────────────────────────────────────
// Exactly five entries. Numbered 1..5 so the agent only ever has to pick a
// digit from the user's message. The handler is the single source of truth
// for the ticket body — the agent never has to carry Markdown through the
// input layer.
export const FORGE_APP_IDEAS = [
  {
    number: 1,
    summary: 'Confluence byline: Last 5 contributors',
    description: [
      '**Problem**',
      'Confluence pages don\'t show who recently edited them at a glance; readers have to open the full history.',
      '',
      '**Who it\'s for**',
      'Any team using Confluence as living documentation — docs owners, reviewers, newcomers trying to find a subject-matter expert.',
      '',
      '**Forge modules**',
      '- `confluence:contentByLineItem` (the byline strip above every page)',
      '- UI Kit for the rendered component',
      '',
      '**Scopes**',
      '- `read:page:confluence` to list the page\'s version history',
      '',
      '**Happy path**',
      '1. Reader opens a Confluence page.',
      '2. Byline renders `Last 5 contributors: @alice, @bob, @carol, @dave, @eve`.',
      '3. Clicking a contributor opens their Atlassian profile in a new tab.',
    ].join('\n'),
  },
  {
    number: 2,
    summary: 'Jira issue panel: Related tickets by shared label',
    description: [
      '**Problem**',
      'Engineers triaging a Jira issue often don\'t realise a very similar ticket already exists in another project — context is lost across project boundaries.',
      '',
      '**Who it\'s for**',
      'Support engineers, triage leads, anyone who feels déjà vu on a ticket.',
      '',
      '**Forge modules**',
      '- `jira:issuePanel` (right-side panel on the issue view)',
      '- UI Kit for the list',
      '',
      '**Scopes**',
      '- `read:jira-work` to search issues',
      '',
      '**Happy path**',
      '1. User opens PROJ-123 which has labels `payments`, `latency`.',
      '2. Panel runs `JQL: labels in (payments, latency) AND key != PROJ-123` and shows the 10 most recent matches.',
      '3. Clicking any match opens that ticket.',
    ].join('\n'),
  },
  {
    number: 3,
    summary: 'Rovo agent: Standup assistant',
    description: [
      '**Problem**',
      'Preparing a daily standup update means tabbing between Jira, Bitbucket, and Confluence to piece together "what did I do yesterday / what am I doing today?"',
      '',
      '**Who it\'s for**',
      'Any engineer attending a daily standup. Managers who want a quick view of a direct report\'s week.',
      '',
      '**Forge modules**',
      '- `rovo:agent` (chat-first)',
      '- Backend `rovo:action` for querying Jira + Bitbucket',
      '',
      '**Scopes**',
      '- `read:jira-work` and `read:jira-user`',
      '',
      '**Happy path**',
      '1. User opens Rovo Chat and types "give me my standup update".',
      '2. Agent lists yesterday\'s closed/updated Jira issues + today\'s "In Progress" ones.',
      '3. Agent ends with: "Anything else I should mention?" so the user can add context.',
    ].join('\n'),
  },
  {
    number: 4,
    summary: 'Confluence macro: Linked Jira status badge',
    description: [
      '**Problem**',
      'Confluence pages that reference Jira tickets (e.g. roadmap docs, RFCs) have to be manually updated when ticket status changes.',
      '',
      '**Who it\'s for**',
      'PMs and tech leads who keep roadmap/planning docs in Confluence.',
      '',
      '**Forge modules**',
      '- `confluence:macro` (inline macro)',
      '- UI Kit `Badge` component',
      '',
      '**Scopes**',
      '- `read:jira-work` to fetch the issue status',
      '',
      '**Happy path**',
      '1. Author inserts the macro and types `PROJ-123`.',
      '2. Macro renders a coloured badge with the ticket\'s current status (e.g. "In Progress" in blue).',
      '3. Badge auto-updates on every page view — no manual sync.',
    ].join('\n'),
  },
  {
    number: 5,
    summary: 'Jira dashboard gadget: Burndown spark',
    description: [
      '**Problem**',
      'Jira\'s built-in dashboard gadgets don\'t include a compact "sprint burndown at a glance" that fits in a dashboard tile.',
      '',
      '**Who it\'s for**',
      'Scrum masters and product managers who use Jira dashboards as their standing view.',
      '',
      '**Forge modules**',
      '- `jira:dashboardGadget`',
      '- UI Kit `LineChart` for the burndown line',
      '',
      '**Scopes**',
      '- `read:jira-work` + `read:sprint:jira-software`',
      '',
      '**Happy path**',
      '1. User adds the gadget to their dashboard and picks a sprint.',
      '2. Gadget renders a compact line chart: committed vs remaining story points by day.',
      '3. Hover shows the exact remaining number for that day.',
    ].join('\n'),
  },
];

// ─── Placeholder — Forge still requires at least one function reference
// outside the rovo:agent entry, so we keep this as a no-op.
// Named-function form (NOT arrow-expression-to-const) to match the handler
// shape every other working Forge app in this repo uses — see the comment
// on createTicket below.
export async function placeholder() {
  return { ok: true };
}

// ─── baseUrlFromSelf — same helper pattern as sprint-ready-agent/src/jira.js.
// We parse the hostname out of Jira's returned `self` URL (which looks like
// https://<site>.atlassian.net/rest/api/3/issue/10001) so we can hand back
// a browsable /browse/<key> link that lives on the user's own tenant.
const baseUrlFromSelf = (selfUrl) => {
  if (!selfUrl || typeof selfUrl !== 'string') return null;
  try {
    const url = new URL(selfUrl);
    return `${url.protocol}//${url.host}`;
  } catch {
    return null;
  }
};

// ─── createTicket — the minimal 2-input action handler.
//
// Inputs the agent MUST supply:
//   - ideaNumber: 1..5 — which idea from the FORGE_APP_IDEAS library to file
//   - projectKey: e.g. "FORGE" — the Jira project to file into
//
// Everything else (summary, description, issue type) is owned by the
// handler. The agent never has to carry rich content through the input
// binding layer. This is the simplest possible shape — if THIS payload is
// still empty at runtime, we have proof the problem is Rovo's binding
// layer, not our prompt or our action schema.
// ─── createTicket — named async function (NOT an arrow expression
// assigned to a const).
//
// Why this matters: every working Forge handler in this repo
// (implementation-plan-agent/src/actions/*.js, sprint-ready-agent/src/
// actions/*.js) uses `export async function handlerName({ payload })`,
// NOT `export const handlerName = async ({ payload }) => ...`. The
// earlier Forge Guru handler used the arrow form and received
// `undefined` for payload at runtime — the Forge/Rovo invoke path
// prefers (or requires) the named-function form for its argument
// binding to work. This file now uses the proven shape.
export async function createTicket(args) {
  // Log the whole first argument object AND its keys. If payload still
  // comes through as undefined after this change, the arg-shape log
  // will tell us what the runtime is actually handing us (payload under
  // a different key, flat inputs, etc.) and we can fix the destructure
  // in one more edit instead of guessing.
  console.log('[create-ticket] handler invoked', {
    argKeys: args ? Object.keys(args) : null,
    rawArgs: args,
    payloadPresent: !!args?.payload,
  });

  const { payload } = args || {};
  const { ideaNumber, projectKey } = payload || {};

  // ─── Input validation ─────────────────────────────────────────────────
  if (!ideaNumber || !projectKey) {
    console.warn('[create-ticket] missing required inputs — returning error', {
      hasIdeaNumber: ideaNumber !== undefined && ideaNumber !== null,
      hasProjectKey: !!projectKey,
    });
    return {
      ok: false,
      error: 'ideaNumber (1..5) and projectKey are both required.',
    };
  }

  // Rovo may pass ideaNumber as a string even though the schema says integer —
  // coerce defensively so lookups work either way.
  const idx = typeof ideaNumber === 'string' ? parseInt(ideaNumber, 10) : ideaNumber;

  const idea = FORGE_APP_IDEAS.find((entry) => entry.number === idx);
  if (!idea) {
    console.warn('[create-ticket] ideaNumber out of range', { ideaNumber, idx });
    return {
      ok: false,
      error: `ideaNumber must be 1..${FORGE_APP_IDEAS.length}. Got ${ideaNumber}.`,
    };
  }

  console.log('[create-ticket] POST /rest/api/3/issue', {
    projectKey: projectKey.toUpperCase(),
    ideaNumber: idx,
    summary: idea.summary,
  });

  // ─── Create the Jira issue ────────────────────────────────────────────
  const body = {
    fields: {
      project: { key: projectKey.toUpperCase() },
      summary: idea.summary,
      // Jira's /rest/api/3/issue requires ADF, not Markdown. For a workshop
      // reference, we send the whole description as a single plain-text
      // paragraph so Jira renders it correctly without any Markdown parsing.
      description: {
        type: 'doc',
        version: 1,
        content: [
          {
            type: 'paragraph',
            content: [{ type: 'text', text: idea.description }],
          },
        ],
      },
      issuetype: { name: 'Task' },
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
  const baseUrl = baseUrlFromSelf(created.self);
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
