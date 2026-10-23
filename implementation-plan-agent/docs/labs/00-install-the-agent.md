# Lab 0 · Install the agent

## What you're building

Nothing yet. In this lab you install the Implementation Plan Agent onto your Jira dev site using your coding assistant, then confirm it responds when invoked from the **Agents** panel on a Jira issue. Lab 1 and Lab 2 are where the real work happens.

## Ideas you need

- The Implementation Plan Agent is a Rovo agent with two Jira actions: `inspect-issue` (reads a ticket) and `post-implementation-plan` (writes a single comment back).
- Scopes it needs: `read:jira-work`, `read:jira-user`, `write:jira-work`. Both reads and the write run as the invoking user (`.asUser()`) — so the agent's effective permissions are bounded by yours.
- Your coding assistant will drive the four-command install sequence for you. You confirm the pieces by invoking the agent on a dummy ticket at the end.

## You should be here

- You finished **[Setup](../SETUP.md)**: Codespace open, `forge whoami` works, you have a Jira Cloud site URL handy.
- You have **not** cloned `forge-inspired` yet — your coding assistant will do that for you in Step 1.

## Step 1 — provision a fresh Jira Cloud site

If you skipped Setup Step 3, run this in your Codespace terminal now:

```bash
forge site provision
```

Follow the prompts. Pick a short, memorable name. You'll end up with a site URL like `https://your-name.atlassian.net`. **Copy that URL** — you'll paste it into the install prompt in the next step.

> **Why fresh?** The site is empty, has Rovo enabled by default, and has nothing pre-installed to collide with the agent.

## Step 2 — install via your coding assistant

Open your coding assistant inside the Codespace — Cursor, Claude Code, Codex, GitHub Copilot CLI, Gemini CLI, or whichever one you prefer.

**Before you paste the prompt below**, replace the `<YOUR_SITE_URL>` placeholder with the site URL you copied in Step 1. That way the assistant knows exactly which site to install to, and won't have to stop and ask you mid-sequence.

> **Why hand it off?** The Codespace already has Node, the Forge CLI, and the Forge AI Plugin preinstalled. The install flow is deterministic — clone, `npm install`, `forge register`, `forge deploy`, `forge install`. Letting your assistant run it means fewer typos, and it gives you a feel for what "my agent did the plumbing for me" looks like before you start editing agents yourself.

```text
Please install the Implementation Plan Agent for me from this Codespace.

I'm in the community Forge Codespace, which has Node, the Forge CLI and
the Forge AI Plugin preinstalled, and I've already run `forge login`.
The agent's source lives in a different GitHub repo that I need to
clone first.

The site to install onto is: <YOUR_SITE_URL>

Please do the following in order, running each command in the terminal
and stopping if any step fails:

1. Clone the repo: `git clone https://github.com/atlassian-labs/forge-inspired.git`
   (skip if the directory already exists).
2. `cd` into `forge-inspired/implementation-plan-agent`.
3. Run `npm install`.
4. Run `forge register` so a fresh app id is written into `manifest.yml`
   (skip if the manifest already contains a non-placeholder app id).
   If it asks me to pick a developer console space, pick the default.
5. Run `forge deploy` to the default (development) environment.
6. Run `forge install` and install the app to the site URL I gave you
   above. If it asks me to choose a product, choose Jira. The install
   will ask me to confirm Jira scopes — confirm them.

When you're done, tell me the app id, confirm which site it was
installed on, and tell me how to invoke the agent from a Jira issue's
Agents panel.
```

Your assistant will walk through those six commands. Confirm each one when it asks.

## Step 3 — prove it responds

1. Open your Jira Cloud site in a browser.
2. Open any Jira issue — any one will do. If your project is empty, create a throwaway ticket called *"Test"* first.
3. Click the **Agents** panel icon on the issue (or open Rovo Chat with the issue in context).
4. Choose **Implementation Plan Agent** from the agent picker.
5. Type: `Plan this ticket for me.`
6. Wait. The agent will read the ticket (`inspect-issue`), draft a plan, and post it back as one comment (`post-implementation-plan`). It will then reply with a short "refresh to see the comment" line.
7. Refresh the page. There should be exactly **one** new comment on the issue, with four sections: *Context*, *Proposed approach*, *Implementation steps*, *Risks & open questions*.

## Already written

Do not change these in Lab 0:

- `manifest.yml` — agent + 2 actions + 3 scopes.
- `src/actions/inspect-issue.js` — the read path.
- `src/actions/post-implementation-plan.js` — the write path (narrow by design: comments only, never field edits).
- `src/jira.js` — shared helpers.

## Proof checklist

- [ ] `forge install list` includes the Implementation Plan Agent on your Jira site.
- [ ] The Agents panel on an issue lists the agent.
- [ ] After invoking it, exactly **one** new comment appears on the ticket, with the four expected sections.
- [ ] The agent's chat reply is a single short line (not a Markdown summary of the plan).

## You own this now

You've just deployed a Rovo agent that reads tickets and writes a plan back. In the next lab you'll use it on purpose — with a real feature idea — and see what the stock plan looks like. That'll be your baseline for Lab 2's customization.

→ **[Lab 1 · Plan a ticket](01-plan-a-ticket.md)**
