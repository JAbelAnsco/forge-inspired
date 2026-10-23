/*
 * Lab 2 — src/index.js handler for the create-ticket action.
 *
 * MERGE this snippet into `src/index.js` as follows:
 *   1. Add `import api, { route } from '@forge/api';` at the TOP of
 *      src/index.js if (and only if) that exact import is not already
 *      there. Do not duplicate it.
 *   2. Append the `baseUrlFromSelf` helper AND the `createTicket`
 *      export at the BOTTOM of src/index.js, alongside the existing
 *      `placeholder` export. Do not delete or modify `placeholder`.
 *   3. Do NOT copy this comment block itself into src/index.js — it's
 *      documentation for the snippet, not part of the handler.
 *
 * This handler is wired up by the `create-ticket-fn` function entry
 * you added in `manifest.yml`.
 */

import api, { route } from '@forge/api';

// Derive the tenant's Jira base URL from an issue's `self` URL
// (e.g. "https://acme.atlassian.net/rest/api/3/issue/10042"
//    →  "https://acme.atlassian.net").
//
// This is the canonical pattern used across the Forge Inspired
// collection (see sprint-ready-agent / implementation-plan-agent /
// team-pulse-board). Rovo action handlers do NOT get a user-facing
// `siteUrl` on the context object, and the `cloudId` is an internal
// UUID — so the right way to produce a browsable link is to parse
// the hostname out of a Jira response's `self` field.
function baseUrlFromSelf(selfUrl) {
  if (!selfUrl) return '';
  try {
    const u = new URL(selfUrl);
    return `${u.protocol}//${u.host}`;
  } catch {
    return '';
  }
}

export const createTicket = async ({ payload }) => {
  // ─── Instrumentation ────────────────────────────────────────────────
  // The single most important log in this whole handler: if you ask
  // Forge Guru to file a ticket and this line never shows up in
  // `forge logs`, the agent never called the action — the problem is
  // prompt-side, not handler-side. If this line DOES show up but the
  // next ones don't, read on down to see which check tripped.
  console.log('[create-ticket] handler invoked', {
    projectKey: payload?.projectKey,
    summary: payload?.summary,
    descriptionLength: payload?.description?.length ?? 0,
    issueType: payload?.issueType,
  });

  // The agent (via the manifest `inputs` block) hands us these fields.
  const { projectKey, summary, description, issueType } = payload || {};

  // Defensive input checks — a bad input shape should fail fast and loud,
  // not create a mystery 400 on the Jira call.
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

  console.log('[create-ticket] POST /rest/api/3/issue', {
    projectKey: projectKey.toUpperCase(),
    issueType: issueType || 'Task',
  });

  // We call Jira as the invoking user (`.asUser()`), not as the app.
  // That means the user needs real create-issue permission on the project;
  // the ticket's reporter will be them, not the app. This is the right
  // default — it keeps the app's effective permissions bounded by the user's.
  const body = {
    fields: {
      project: { key: projectKey.toUpperCase() },
      summary,
      // Jira wants ADF for descriptions. We wrap the Markdown-ish text
      // as a single paragraph node — enough for a workshop, not pretty.
      description: {
        type: 'doc',
        version: 1,
        content: [
          {
            type: 'paragraph',
            content: [{ type: 'text', text: description }],
          },
        ],
      },
      issuetype: { name: issueType || 'Task' },
    },
  };

  const response = await api
    .asUser()
    .requestJira(route`/rest/api/3/issue`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(body),
    });

  // Jira returns 201 on success. Anything else is an error we should
  // surface back to the agent so it can explain what happened.
  if (!response.ok) {
    const text = await response.text();
    console.error('create-ticket: Jira POST failed', {
      status: response.status,
      body: text,
    });
    return {
      ok: false,
      status: response.status,
      error: text,
    };
  }

  // The Jira create-issue response gives us { id, key, self }.
  // `self` is a fully-qualified URL on the user's tenant, which is the
  // ONLY reliable source of the tenant hostname inside a Rovo action
  // handler. We derive the browsable URL from it directly — no second
  // API call needed.
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
};
