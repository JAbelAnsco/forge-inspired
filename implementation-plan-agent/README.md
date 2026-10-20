# Implementation Plan Agent

[![Atlassian license](https://img.shields.io/badge/license-Apache%202.0-blue.svg?style=flat-square)](../LICENSE) [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](../CONTRIBUTING.md)

> Part of the [**Forge Inspired**](../README.md) collection.

**A Rovo agent that turns a Jira issue into an actionable implementation plan.** Call it from Rovo Chat or from the **Agents** panel on any Jira issue, ask it to plan a ticket, and it will:

1. Read the issue via the `inspect-issue` action (summary, description, type, status, priority, assignee, reporter, labels).
2. Draft a plan with four sections: **Context**, **Proposed approach**, **Implementation steps**, **Risks & open questions** — grounded in your organization's knowledge via Rovo.
3. Post the plan back to the same issue as a **single comment** via the `post-implementation-plan` action.
4. Reply in chat with a short "refresh to see the comment" receipt.

![Implementation Plan Agent in action](./img/implementationPlanAgent.gif)

## Prerequisites — get your machine ready

You need three things before you can deploy this app:

### 1. Node.js and the Forge CLI

- Install **Node.js LTS** (v20 or newer). The Forge runtime is Node 24, but the CLI itself runs on any modern LTS.
- Install the Forge CLI globally:
  ```bash
  npm install -g @forge/cli
  ```
- Verify it's on your PATH:
  ```bash
  forge --version
  ```

### 2. An Atlassian account and API token

- Log in to Forge with an API token from https://id.atlassian.com/manage-profile/security/api-tokens:
  ```bash
  forge login
  ```
- Confirm you're logged in:
  ```bash
  forge whoami
  ```

### 3. A Jira Cloud site

- Any Jira Cloud site you're an admin on will work. If you don't have one, provision one with:
  ```bash
  forge site provision
  ```

### (Optional) Skip local setup with the Forge Codespace

Prefer not to install Node and the Forge CLI on your laptop? Use the community **[Forge Codespace](https://github.com/ccurti-dx/forge-codespace/tree/main)** — a preconfigured GitHub Codespace with Node and the Forge CLI already set up. Once you're in the Codespace, `git clone` this repo and `cd` into `implementation-plan-agent/` to deploy.

## Deploy it

Each command is in its own code block so you can copy, paste, and hit **Enter** one at a time.

Clone the repo (first time only):

```bash
git clone https://github.com/atlassian-labs/forge-inspired.git
```

Change into the app directory:

```bash
cd forge-inspired/implementation-plan-agent
```

Install dependencies:

```bash
npm install
```

Register the app under your Atlassian account (first time only — this writes your own app id into `manifest.yml`):

```bash
forge register
```

Deploy the app:

```bash
forge deploy
```

Install it on your Jira Cloud site (you'll be prompted to pick the site):

```bash
forge install
```

## Try it

On any Jira issue:

1. Open the issue's **Agents** panel (or open Rovo Chat).
2. Choose **Implementation Plan Agent**.
3. Say something like `Plan this ticket for me` or `Plan PROJ-123 for me`.
4. Watch the agent read the issue, draft the plan, and post it back as one comment. Refresh the page to see it.

## Under the hood

- **Modules:** [`rovo:agent`](https://developer.atlassian.com/platform/forge/manifest-reference/modules/rovo-agent/) + [`action`](https://developer.atlassian.com/platform/forge/manifest-reference/modules/action/) × 2 + [`function`](https://developer.atlassian.com/platform/forge/manifest-reference/modules/function/) × 2.
- **Scopes:** `read:jira-work`, `read:jira-user`, `write:jira-work`. Only `post-implementation-plan` ever exercises the write scope.
- Every Jira call uses `asUser()`, so the agent's effective permissions are bounded by the invoking user's Jira permissions.
- The write path is deliberately narrow: it only posts comments. It cannot edit the description, transition the issue, or change any field.

### The interesting files

- **[`manifest.yml`](./manifest.yml)** — the agent prompt, two `action`s, and the three Jira scopes it needs.
- **[`src/actions/inspect-issue.js`](./src/actions/inspect-issue.js)** — the read path. One `GET` to `/rest/api/3/issue/{key}` with an explicit field list, then a lean JSON return.
- **[`src/actions/post-implementation-plan.js`](./src/actions/post-implementation-plan.js)** — the sole write path. One `POST` to `/rest/api/3/issue/{key}/comment`. Adds a small "drafted by the Implementation Plan Agent" marker line so agent-authored comments are easy to spot in ticket history.
- **[`src/jira.js`](./src/jira.js)** — shared helpers for `baseUrlFromSelf`, flattening ADF descriptions, and wrapping the plan Markdown for the comment POST.
- **[`src/index.js`](./src/index.js)** — the Forge function entry points; just wires exports to handler modules.

## Extend it

Already deployed and want to push it further? A few natural next steps — try asking your AI coding agent (Rovo Dev, Cursor, Copilot, etc.) to add one of these:

- **Include custom fields in the read** — add the field IDs to the `fieldList` in `inspect-issue.js` and surface them in the return object.
- **Format the comment as richer ADF** — swap the Markdown-to-ADF wrapper for a converter that handles headings, lists, and code blocks natively.
- **Add a third action** — e.g. an `estimate-effort` action that returns a story-point estimate the agent can mention alongside the plan.
- **"Propose then confirm" flow** — take a leaf out of [`sprint-ready-agent`](../sprint-ready-agent) and require the user to type `apply` in chat before the comment is posted.

After any manifest change, redeploy (`forge deploy`) and, if you changed scopes, run `forge install --upgrade`.

## Troubleshooting

- **The agent doesn't show up in Rovo.** Confirm your site has Rovo enabled and that `forge install` succeeded on the site you're testing. Try `forge install list` to check.
- **Scope errors after adding scopes.** You need to `forge install --upgrade` (not just re-deploy) whenever you change `permissions.scopes` in `manifest.yml`.
- **Nothing happens when you invoke the action.** Tail the logs: `forge logs --since 15m`. The action handler will log any error it hits.
- **`forge lint` complains about the manifest.** Manifests are strict YAML. Check indentation and make sure every `function` key referenced from an `action` exists under `modules.function`.

## License

Apache 2.0 · [LICENSE](../LICENSE) · Contributions welcome — see [CONTRIBUTING.md](../CONTRIBUTING.md).
