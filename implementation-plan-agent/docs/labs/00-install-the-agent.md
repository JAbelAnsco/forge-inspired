# Lab 0 · Install the agent

## What you're building

Nothing yet. In this lab you install the Implementation Plan Agent onto your Jira dev site using your coding assistant, then confirm it responds when invoked from the **Agents** panel on a Jira issue. Lab 1 and Lab 2 are where the real work happens.

## Ideas you need

- The Implementation Plan Agent is a Rovo agent with two Jira actions: `inspect-issue` (reads a ticket) and `post-implementation-plan` (writes a single comment back).
- Scopes it needs: `read:jira-work`, `read:jira-user`, `write:jira-work`. Both reads and the write run as the invoking user (`.asUser()`) — so the agent's effective permissions are bounded by yours.
- Your coding assistant will drive the four-command install sequence for you. You confirm the pieces by invoking the agent on a dummy ticket at the end.

## You should be here

- You finished **[Setup](../SETUP.md)**: Codespace open, `forge whoami` works, you have a Jira Cloud site URL, and you've cloned the repo and `cd`'d into `forge-inspired/implementation-plan-agent/`.

## Step 1 — install via your coding assistant

Open the AI chat panel in your Codespace. Paste this prompt and run it:

```text
Please install the Implementation Plan Agent for me from the Codespace
I'm in.

I'm already sitting in `forge-inspired/implementation-plan-agent/`.
Please do the following in order, running each command in the terminal
and stopping if any step fails:

1. Run `npm install`.
2. Run `forge register` so a fresh app id is written into `manifest.yml`
   (skip if the manifest already has a non-placeholder app id).
3. Run `forge deploy` to the default (development) environment.
4. Run `forge install` and pick my Jira Cloud site when prompted. The
   install will ask me to confirm Jira scopes — confirm them.

When you're done, tell me the app id, which site it was installed on,
and how to invoke the agent from a Jira issue's Agents panel.
```

If `forge install` asks you to pick a product, pick **Jira**.

## Step 2 — prove it responds

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
