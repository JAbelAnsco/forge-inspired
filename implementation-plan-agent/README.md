# Implementation Plan Agent — Forge Workshop

[![Atlassian license](https://img.shields.io/badge/license-Apache%202.0-blue.svg?style=flat-square)](../LICENSE) [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](../CONTRIBUTING.md)

> Part of the [**Forge Inspired**](../README.md) collection.

**A hands-on workshop for building a Rovo agent on Atlassian Forge.** Participants start from the vanilla `rovo-agent-rovo` template and evolve it into an agent that reads a Jira issue's context, drafts an implementation plan grounded in the organization's knowledge, and posts the plan back as a single comment on the issue.

![Implementation Plan Agent in action](./img/implementationPlanAgent.gif)

## Two apps in one folder

| Folder | What it is | When to use it |
|--------|------------|----------------|
| [`baseline/`](./baseline) | Untouched output of `forge create -t rovo-agent-rovo`. Just logs a message to Forge logs. | Your **starting point** — this is what everyone sees in step 1 of the workshop. Deploy it, poke it, then build on it. |
| [`solution/`](./solution) | The finished workshop app: a Rovo agent with two `action`s (`inspect-issue` + `post-implementation-plan`). | Your **reference** — deploy this if you want to see the finished result, or peek at it if you get stuck. |

Both are independent Forge apps with their own `manifest.yml`, `package.json`, and app id — they are deployed and installed separately.

## What you'll build

By the end of the workshop you'll have a Rovo agent that you can call from Rovo Chat or from the **Agents** panel on any Jira issue. Ask it to plan an issue and it will:

1. Read the issue via the `inspect-issue` action (summary, description, type, status, priority, assignee, reporter, labels — no custom fields).
2. Draft an implementation plan with four sections: **Context**, **Proposed approach**, **Implementation steps**, **Risks & open questions**. Rovo's built-in access to your organization's knowledge grounds the plan in real team practice.
3. Post the plan back to the same Jira issue as a **single comment**, using the `post-implementation-plan` action.
4. Reply in chat with a deep link to the new comment.

## Prerequisites — get your machine ready

You need three things before you can run either app:

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
- You should see a "Logged in" message. Confirm with:
  ```bash
  forge whoami
  ```

### 3. A Jira Cloud site

- Any Jira Cloud site you're an admin on will work. If you don't have one, create one by running:
   ```bash
  forge site provision
  ```

### 4. (Optional) Skip local setup with the Forge Codespace

Prefer not to install Node and the Forge CLI on your laptop? Use the community **[Forge Codespace](https://github.com/ccurti-dx/forge-codespace/tree/main)** — a preconfigured GitHub Codespace with Node and the Forge CLI already set up. Once you're in the Codespace, `git clone` this repo and `cd` into `implementation-plan-agent/baseline` (or `solution`) to deploy.

## The workshop flow

Pick a track:

### Track A — Build from the baseline (recommended for the workshop)


Clone the repo (first time only):

```bash
git clone https://github.com/atlassian-labs/forge-inspired.git
```

Change into the baseline app directory:

```bash
cd forge-inspired/implementation-plan-agent/baseline
```

Install dependencies:

```bash
npm install
```

Register the app under your Atlassian account (first time only — this writes your app id into `manifest.yml`):

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


Open Rovo Chat on your site, pick the **baseline** agent, and ask it to log a message. You should see the message appear in `forge logs`. Now you have a living, breathing (but very simple) Rovo agent on your Jira site. 🎉

## Make it do something useful

This is where it gets fun. You're going to turn that "hello world" logger into a real Jira teammate — an agent that:

- **Reads a Jira ticket** so it understands the context the user is asking about.
- **Analyzes the ticket** and drafts a thoughtful implementation plan — the kind of plan a senior engineer would write before touching any code.
- **Writes the plan back** to the ticket as a Jira comment so the whole team can see it.

That's the *what*. The *how* — the manifest changes, the scopes, the action handlers, the Jira REST calls — is where your coding agent earns its keep. **You don't need to write the code yourself.** Describe the behavior you want in plain English and let the agent do the heavy lifting.

### Prompt your coding agent like a human teammate

There's no single "right" prompt here. Think about what you'd ask a new developer on your team to build. A few shapes that work well:

- *"I want this Rovo agent to read a Jira issue, draft an implementation plan with sections for context, approach, steps, and risks, and post it back as a comment. Update the manifest and write the action handlers."*
- *"Add two actions to this agent — one that fetches a Jira issue's details, and one that posts a comment. Then rewrite the agent prompt so it uses them together to generate implementation plans."*
- *"Help me evolve this baseline into something that can plan Jira tickets end-to-end. Start by walking me through what needs to change, then make the changes one at a time."*

Notice how none of these say "add the `read:jira-work` scope" or "use `asUser().requestJira(...)`" — your coding agent should figure that out from the goal. If it misses a scope or a wiring detail, the Forge CLI will tell you (`forge lint` is your friend) and you can prompt the agent to fix it.

### When you're done

Redeploy and reinstall:

```bash
forge deploy
```

```bash
forge install --upgrade
```

(The `--upgrade` matters whenever you've changed scopes — otherwise your site still has the old permission set.)

Then test it: go to any Jira issue, open Rovo Chat or the **Agents** panel, pick your agent, and say something like *"Plan this ticket for me."* If you get stuck comparing your work-in-progress to the finished reference, [`solution/`](./solution) has the fully built version.

### Track B — Just run the finished solution

Follow the exact same command sequence as Track A above, but swap `baseline` for `solution` in the `cd` step:

```bash
cd forge-inspired/implementation-plan-agent/solution
```

Everything else (`npm install`, `forge register`, `forge deploy`, `forge install`) is identical.

Then on any Jira issue:

1. Open the ticket's **Agents** panel (or open Rovo Chat).
2. Choose **Implementation Plan Agent**.
3. Say something like `Plan PROJ-123 for me`.
4. Watch the agent read the issue, draft the plan, and post it back as a comment. The chat reply links straight to the new comment.

## Troubleshooting

- **The agent doesn't show up in Rovo.** Confirm your site has Rovo enabled and that `forge install` succeeded on the site you're testing. Try `forge install list` to check.
- **Scope errors after adding scopes.** You need to `forge install --upgrade` (not just re-deploy) whenever you change `permissions.scopes` in `manifest.yml`.
- **Nothing happens when you invoke the action.** Tail the logs: `forge logs --since 15m`. The action handler will log any error it hits.
- **`forge lint` complains about the manifest.** Manifests are strict YAML. Check indentation and make sure every `function` key referenced from an `action` exists under `modules.function`.

## Under the hood

- **Modules:** [`rovo:agent`](https://developer.atlassian.com/platform/forge/manifest-reference/modules/rovo-agent/) + [`action`](https://developer.atlassian.com/platform/forge/manifest-reference/modules/action/) × 2 + [`function`](https://developer.atlassian.com/platform/forge/manifest-reference/modules/function/).
- **Scopes:** `read:jira-work`, `read:jira-user`, `write:jira-work`. Only `post-implementation-plan` ever exercises the write scope.
- **The interesting files (in `solution/`):**
  - `manifest.yml` — agent prompt + action definitions + scopes.
  - `src/actions/inspect-issue.js` — the read path.
  - `src/actions/post-implementation-plan.js` — the sole write path (one POST to `/rest/api/3/issue/{key}/comment`).
  - `src/jira.js` — tiny shared helpers (`baseUrlFromSelf`, `adfToText`, `textToAdf`).

## License

Apache 2.0 · [LICENSE](../LICENSE) · Contributions welcome — see [CONTRIBUTING.md](../CONTRIBUTING.md).
