/*
 * Lab 2 — src/index.js handler for the create-ticket action.
 *
 * MERGE this snippet into `src/index.js` as follows:
 *   1. Add `import api, { route } from '@forge/api';` at the TOP of
 *      src/index.js if (and only if) that exact import is not already
 *      there. Do not duplicate it.
 *   2. Append the `createTicket` export at the BOTTOM of src/index.js,
 *      alongside the existing `placeholder` export. Do not delete or
 *      modify `placeholder`.
 *   3. Do NOT copy this comment block itself into src/index.js — it's
 *      documentation for the snippet, not part of the handler.
 *
 * This handler is wired up by the `create-ticket-fn` function entry
 * you added in `manifest.yml`.
 */

import api, { route } from '@forge/api';

export const createTicket = async ({ payload, context }) => {
  // The agent (via the manifest `inputs` block) hands us these fields.
  const { projectKey, summary, description, issueType } = payload || {};

  // Defensive input checks — a bad input shape should fail fast and loud,
  // not create a mystery 400 on the Jira call.
  if (!projectKey || !summary || !description) {
    return {
      ok: false,
      error: 'projectKey, summary, and description are all required.',
    };
  }

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

  const created = await response.json();

  // Reconstruct a browsable URL for the agent to render as a link.
  // `context` carries the site's base URL for us — no hardcoding.
  const siteUrl =
    context?.siteUrl ||
    (context?.cloudId
      ? `https://api.atlassian.com/ex/jira/${context.cloudId}`
      : null);

  const browseUrl = siteUrl ? `${siteUrl}/browse/${created.key}` : null;

  return {
    ok: true,
    key: created.key,
    id: created.id,
    url: browseUrl,
  };
};
