// Forge Guru — Lab 2 end-state entry point.
//
// This file is the overlay target for the Forge Guru solution. After both
// Lab 1 and Lab 2 are applied, the agent exports three things from here:
//
//   1. `placeholder`   — the baseline no-op handler Forge requires on every
//                        app. Still here because the manifest still declares
//                        it under `modules.function` for safety.
//   2. `baseUrlFromSelf` — a small helper used by `createTicket` to derive
//                          the user's tenant base URL from a Jira response.
//   3. `createTicket`  — the Lab 2 action handler. Creates a Jira work item
//                        via `asUser()` and returns `{ ok, key, id, url }`
//                        so the agent can post a browsable link back in chat.
//
// None of this file contains personal identifiers — it's safe to overlay
// onto your own `src/index.js` wholesale.

import api, { route } from '@forge/api';

export const placeholder = async (payload, context) => {
  // Intentionally unused. See the file header.
  console.log('Forge Guru placeholder function invoked', {
    payload,
    principalType: context?.principal?.accountType,
  });
  return { ok: true, note: 'Forge Guru placeholder — see src/index.js.' };
};

// Derive the tenant's Jira base URL from an issue's `self` URL
// (e.g. "https://acme.atlassian.net/rest/api/3/issue/10042"
//    →  "https://acme.atlassian.net").
//
// This is the canonical pattern used across the Forge Inspired collection
// (see sprint-ready-agent / implementation-plan-agent / team-pulse-board).
// Rovo action handlers do NOT get a user-facing `siteUrl` on the context
// object, and the `cloudId` is an internal UUID — so the right way to
// produce a browsable link is to parse the hostname out of a Jira
// response's `self` field.
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
  // The single most important log in this whole app: if you ask Forge
  // Guru to file a ticket and this line never shows up in `forge logs`,
  // the agent never called the action — the problem is prompt-side, not
  // handler-side. If this line DOES show up, keep reading the logs.
  console.log('[create-ticket] handler invoked', {
    projectKey: payload?.projectKey,
    summary: payload?.summary,
    descriptionLength: payload?.description?.length ?? 0,
    issueType: payload?.issueType,
  });

  const { projectKey, summary, description, issueType } = payload || {};

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

  const body = {
    fields: {
      project: { key: projectKey.toUpperCase() },
      summary,
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
