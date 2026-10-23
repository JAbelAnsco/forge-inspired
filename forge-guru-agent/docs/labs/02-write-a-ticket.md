# Lab 2 · Write a ticket

## What you're building

This is the lab where the magic happens. You give Forge Guru hands.

Up to now the agent has only ever *talked*. In this lab you teach it to reach out and create a real Jira ticket on your behalf, filling in a title and a rich description for one of the ideas it just pitched you. Pick an idea you like, say the word, and your idea lands on the board as a ticket, ready for your team to pick up.

## Ideas you need

- **Rovo agents can call `action` modules.** An action is a small, typed function the agent decides to invoke mid-conversation when it needs to actually *do* something in a product.
- The prompt tells the agent *when* to call the action. The action handler does the *doing*.
- **Actions need scopes.** Adding `write:jira-work` changes your app's permissions, so this lab ends with `forge install --upgrade` so your site re-grants the new scope.
- **`.asUser()` is the right default.** The ticket's reporter will be *you*, and the create-issue permission check runs against your own Jira permissions.
- The action takes four typed inputs: `projectKey`, `summary`, `description`, `issueType`. The agent fills them from the conversation.

## Helpers you'll meet

The handler snippet brings in two small helper functions. They look like plumbing but each one solves a real Rovo + Jira gotcha.

- **`tenantUrlFromContext(context)`** — reads the real Jira site URL (e.g. `https://your-site.atlassian.net`) from the Rovo invocation context. We need this because `requestJira()` goes through a Forge proxy, and the `self` field on Jira's response has the proxy hostname (`api.atlassian.com`), not the user's tenant. Without this helper, the "Created [KEY]" link in chat would 404.
- **`markdownToAdf(markdown)`** — converts the Markdown description the agent generates into Atlassian Document Format (ADF), the structured JSON Jira actually accepts. Without this, the ticket description renders as literal `**bold**` text and `-` characters.
- **`inlineRunsToAdf(text)`** — inner helper used by `markdownToAdf` to find `**bold**` and `` `inline code` `` runs inside paragraphs and emit the right ADF marks.

You don't have to understand every line, but when you read the diff, these are the parts that make the ticket look *good*, not just *created*.

## You should be here

- Lab 1 is green. Forge Guru pitches structured ideas with four fields per idea.
- Your `manifest.yml` has the `## Ideation mode` section and the ideation conversation starter from Lab 1.
- You're in `forge-inspired/forge-guru-agent/starter/` in the Codespace terminal.

> **Fresh sites have no projects.** Step 1 walks you through creating one so the agent has somewhere to file the ticket.

## Source-of-truth snippet files

Your coding assistant will apply the exact contents of these three files:

- **[snippets/02-prompt-ticket-mode.yml](snippets/02-prompt-ticket-mode.yml)** — new `## File an idea as a Jira ticket` section for the agent prompt.
- **[snippets/02-manifest-action.yml](snippets/02-manifest-action.yml)** — four manifest edits that wire the action in.
- **[snippets/02-create-ticket.js](snippets/02-create-ticket.js)** — the `createTicket` handler and the two helpers above.

## Step 1 — Create a Jira project

The agent needs an existing Jira project to file into. Make one now.

1. Open your Jira site in a browser.
2. Click **Projects** → **Create project** in the top nav.
3. Pick any template. **Scrum** or **Kanban** under Software Development is a safe default.
4. Name it something short (e.g. `Forge Ideas`). Jira will suggest a **project key** like `FI`, `FORGE`, or `IDEAS`.
5. **Copy the project key.** You'll give it to the agent in the Proof checklist.
6. Finish the wizard.

## Step 2 — Apply Lab 2 via your coding assistant

Open your AI coding assistant inside the Codespace and paste the prompt below.

```text
**What this prompt does:** applies three source-of-truth snippet files
to your Forge Guru checkout to add the `create-ticket` action, then
validates with Forge MCP, lints, deploys, and reinstalls with the new
scope. Shows the diff for your approval before saving, and self-heals
any deploy errors by consulting the Forge docs via MCP.

Add a `create-ticket` Rovo action to my Forge Guru agent so it can
file a Jira ticket from an idea it just pitched.

I'm in `forge-inspired/forge-guru-agent/starter/` in a Codespace. You
have Forge MCP tools available — use them as noted below.

Apply the three snippet files listed below to this checkout exactly
as documented inside each snippet's header comment:

  docs/labs/snippets/02-prompt-ticket-mode.yml
  docs/labs/snippets/02-manifest-action.yml
  docs/labs/snippets/02-create-ticket.js

(Note: `manifest.yml` already has an `## Ideation mode` section in the
agent `prompt:` block and an ideation conversation starter. Leave
those as-is and add the new content alongside them.)

If any Forge CLI command shows an interactive prompt, answer on my
behalf as follows (do not stop to ask):
  - Developer Terms of Use: accept.
  - Analytics / anonymous usage data: opt in.
  - Scope re-grant on install --upgrade: accept.

Do the following in order:

1. Pre-flight check with Forge MCP. Before applying any edits, use
   the `forge-app-manifest-guide` tool to confirm the correct shape
   for `rovo:agent` `actions:`, the `action` module, and the
   `write:jira-work` scope. If any of my snippet files diverge from
   the authoritative shape, flag it and stop.

2. Apply the three snippet files to `manifest.yml` and `src/index.js`
   as documented inside each snippet's header comment. Preserve
   existing indentation. Leave the `placeholder` function in place.

3. Show me the full diff. Wait for my confirmation before saving.

4. After I confirm, save, then run `forge lint`. If lint reports any
   error, use the Forge MCP `diagnose-forge-error` tool to find the
   fix, apply it, and re-lint. Loop until lint is clean.

5. Run `forge deploy`. If deploy fails, do the same MCP-assisted
   diagnose-fix-retry loop. Do not guess at fixes.

6. After deploy succeeds, run `forge install --upgrade`. Accept the
   scope re-grant.

When done, tell me:
- a short list of files touched as clickable relative links, one
  sentence per file,
- confirmation that lint, deploy, and install --upgrade all finished,
- a sample chat sequence I can use to test the end-to-end flow.
```

Confirm the diff when it shows you one.

## Already written

- `src/index.js`'s `placeholder` function. Leave it alone — the manifest's `function:` list still references it.
- Your Lab 1 `## Ideation mode` prompt section. The new ticket section goes immediately after it.

## Proof checklist

1. Open Rovo Chat in your Jira site. Pick Forge Guru.
2. Ask for ideas, e.g. *"I'm on a platform team at a mid-sized SaaS company. Pitch me 3 Forge app ideas."*
3. Pick one: *"I like the first one. File it in `<YOUR_PROJECT_KEY>`."* (Use the project key from Step 1.)
4. The agent's reply looks something like:

   > Nice, your idea is on the board. Check it out here:
   > [FORGE-12](https://your-site.atlassian.net/browse/FORGE-12).
   >
   > Want to refine the scope, split it into smaller tickets, or sketch out a next step? Just ask.

5. Click the link. You should land on a real Jira ticket where **you** are the reporter and the description renders with bold field labels, paragraphs, and lists.

## Solution

If your coding assistant can't apply the edits cleanly, overlay the finished state from **[`solution/`](../../solution/)**. See [`solution/README.md`](../../solution/README.md) for how, and in particular do **not** replace your `manifest.yml` wholesale, it holds your personal `app.id` from Lab 0.

## If you get stuck

- **"I don't have permission" in chat.** The scope re-grant was skipped. Re-run `forge install --upgrade` and accept it this time.
- **Jira returns 400.** Your project key doesn't exist, or the project doesn't allow the `Task` issue type. Try a different project, or ask the agent to use `Story` instead.
- **Ticket description renders as a wall of text.** The Markdown-to-ADF converter wasn't included in the merge. Re-check `src/index.js` has both `markdownToAdf` and its inner `inlineRunsToAdf` helper.
- **Browse link in chat points at `api.atlassian.com`.** The handler isn't using `tenantUrlFromContext`. Re-check the merge.
- **Prompt tweak didn't take.** Give it ~30 seconds, prompts cache briefly.

See **[docs/reference/TROUBLESHOOTING.md](../reference/TROUBLESHOOTING.md)** or flag your instructor.

## What you just learned

The prompt tells the agent *when* to act. Actions let the agent *actually act*. Scopes gate what actions are allowed to touch. **Prompt + actions + scopes** is how every Rovo agent is built, from the simplest to the most elaborate.

And you didn't hope your implementation was right — you *validated* it, with the Forge MCP server consulting the authoritative Forge docs on your behalf. Every future Forge app you build can be checked the same way.

## Where to go next

Take your idea from a Jira ticket to a shipped app. The **[Build and Launch your Forge App](https://developer.atlassian.com/platform/forge/build-and-launch-your-forge-app/)** guide walks you through packaging it, listing it on the Atlassian Marketplace, and sharing it with your team.

→ **[Back to the workshop index](../../README.md)**
