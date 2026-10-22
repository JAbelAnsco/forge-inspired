# Lab 2 · Write a ticket

## What you're building

A version of Forge Guru that can **create a real Jira ticket** for an app idea you picked. By the end of this lab the agent you deployed in Lab 0 will:

1. Pitch you three Forge app ideas (Lab 1 behavior).
2. Ask you which one you like and which Jira project to file it in.
3. **Create the ticket**, and reply with a working link to it in Jira.

Full circle: the agent pitches, you decide, the agent files.

Like Lab 1, you don't type any of the YAML or JavaScript by hand — one prompt tells your coding assistant to apply the four shipped snippet files, redeploy, and reinstall with the new scope. You review the diff before saving.

## Ideas you need

- **Rovo agents can call `action` modules.** An action is a tiny, typed function the agent invokes mid-conversation when it decides it needs to do something in a product. The agent reasons about *when* to call it based on the prompt you write; the action handler does the *doing*.
- **Actions need scopes.** The second you add `write:jira-work`, your app's permissions change — so this lab's prompt tells your assistant to run `forge install --upgrade` (not just `forge deploy`) so the site re-accepts the new scope.
- **`.asUser()` is the right default.** The ticket's reporter will be *you*, and the create-issue permission check runs against *your* Jira permissions, not the app's. The app can't do anything you yourself can't do.
- The action takes four typed inputs: `projectKey`, `summary`, `description`, `issueType`. The agent fills them from the conversation.

## You should be here

- Lab 1 proof checklist is green. Forge Guru pitches structured ideas.
- Your `manifest.yml` has the `## Ideation mode` section and the extra conversation starter from Lab 1.
- You have a Jira project you can create issues in (any project in your dev site works).
- You're sitting in `forge-inspired/forge-guru-agent/` in your Codespace terminal.

## Source-of-truth snippet files

The assistant will apply the exact contents of these four files:

- **[docs/labs/snippets/02-manifest-action.yml](snippets/02-manifest-action.yml)** — four manifest edits (A, B, C, D): wire the agent to the new action, add a conversation starter, declare the `action` and handler `function`, add `write:jira-work`.
- **[docs/labs/snippets/02-create-ticket.js](snippets/02-create-ticket.js)** — the full `createTicket` handler, to be appended to `src/index.js`.
- **[docs/labs/snippets/02-prompt-ticket-mode.yml](snippets/02-prompt-ticket-mode.yml)** — the `## Ticket-writing mode` section to add to the agent `prompt:` block.

## Step 1 — paste the lab prompt into your coding assistant

Open your coding assistant inside the Codespace — Cursor, Claude Code, Codex, GitHub Copilot CLI, Gemini CLI, or whichever one you prefer. Paste the prompt below and let it drive.

```text
Please apply Lab 2 (Write a ticket) to my local Forge Guru checkout.

I'm in `forge-inspired/forge-guru-agent/` in a Codespace. I've already
completed Lab 0 (so `manifest.yml` has my own `app.id` and the stock
agent is deployed) and Lab 1 (so the agent `prompt:` block has an
`## Ideation mode` section and the conversation starters list has
`Help me brainstorm a Forge app for my team` at the bottom).

The source-of-truth snippet files are:

  docs/labs/snippets/02-manifest-action.yml
  docs/labs/snippets/02-create-ticket.js
  docs/labs/snippets/02-prompt-ticket-mode.yml

Please do the following in order, stopping if any step fails:

1. Open `manifest.yml`. Apply the four edits documented in
   `docs/labs/snippets/02-manifest-action.yml` — edits A, B, C, D in
   that file — preserving all surrounding indentation:
     - Edit A: add `action: [create-ticket]` under the single
       `rovo:agent` entry, after the `prompt:` block and before
       `conversationStarters:`.
     - Edit B: add `- Turn my app idea into a Jira ticket` at the
       bottom of the `conversationStarters:` list.
     - Edit C: add a top-level `modules.action` list containing the
       `create-ticket` action definition, AND add an entry under
       `modules.function` for the `create-ticket-fn` handler.
     - Edit D: add `write:jira-work` under `permissions.scopes`.

2. Open `src/index.js`. If `import api, { route } from '@forge/api';`
   is not already at the top, add it. Then append the full
   `createTicket` export from `docs/labs/snippets/02-create-ticket.js`
   AFTER the existing `placeholder` export. Keep `placeholder` as is.

3. Open `manifest.yml` again. Insert the full contents of
   `docs/labs/snippets/02-prompt-ticket-mode.yml` into the `prompt: >`
   block of `rovo:agent`, IMMEDIATELY AFTER the `## Ideation mode`
   section (which Lab 1 added) and BEFORE the `## Important` section.
   Preserve 8-space indentation.

4. Show me the full diff of all edits across both files BEFORE saving.
   Wait for my confirmation before writing.

5. After I confirm, save all files, run `forge lint` to confirm the
   YAML and the manifest are valid, then run `forge deploy` to the
   default (development) environment.

6. After `forge deploy` succeeds, run `forge install --upgrade`. The
   install will ask me to re-accept the new `write:jira-work` scope;
   confirm it when prompted.

When you're done, give me:
- a one-line summary of each file you touched,
- confirmation that `forge lint` passed, `forge deploy` succeeded,
  and `forge install --upgrade` finished,
- a sample chat sequence I can paste into Rovo Chat to test the
  end-to-end flow (pitch ideas, pick one, create a ticket in a
  project I name).
```

Your assistant will walk through the sequence. Confirm the diff when it shows it to you, and confirm the scope re-grant when `forge install --upgrade` asks.

## Proof checklist

1. Open Rovo Chat and pick Forge Guru.
2. Ask it to pitch three Forge app ideas for your team (same as Lab 1 proof).
3. In the same chat, say:

   > *"I like the first one. File it as a ticket in project PROJ."*
   > *(Replace `PROJ` with a real project key from your Jira site.)*

4. The agent's reply contains a line like **"Created [PROJ-123](https://your-site.atlassian.net/browse/PROJ-123)."**
5. Open that link. The ticket exists, you're the reporter, and the description contains the Problem / Who / Modules / Scopes / Happy path fields.

## If you get stuck

- **Chat says "I don't have permission".** `forge install --upgrade` was skipped or didn't take. Ask your assistant to re-run it and reconfirm the scope.
- **The ticket is created but the link in chat is wrong.** The handler builds the URL from `context.siteUrl`. Have your assistant tail `forge logs --since 5m` and look for Jira errors or URL-build warnings.
- **Jira rejects with 400.** Usually your project key doesn't exist, or your site doesn't allow the `Task` issue type on that project. Try a different project, or ask the agent to use `Story` instead.
- **Prompt tweak didn't take effect.** Give it ~30 seconds (prompts cache briefly), then try again.
- **Diff looked wrong.** Re-paste the lab prompt and ask the assistant to re-plan the edits against the source-of-truth snippet files. The snippet files are the ground truth.

See [docs/reference/TROUBLESHOOTING.md](../reference/TROUBLESHOOTING.md) or flag your instructor.

## What you just learned

The prompt tells the agent *when* to act. Actions let the agent *actually act*. Scopes gate what actions are allowed to touch. That three-part model — **prompt + actions + scopes** — is how every Rovo agent is built, from the simplest to the most elaborate.

And across Labs 0, 1, and 2 you've seen the same workflow three times: your coding assistant drives the file edits using source-of-truth snippet files in this repo, you review the diff, and the agent redeploys. The *doing* is the assistant's; the *deciding* is yours.

## Where to go next

- **Want the agent to read a ticket back and plan it in detail?** That's the next workshop in the collection: **[Implementation Plan Agent](../../../implementation-plan-agent/README.md)**. The agent you just built *writes* tickets; that one *reads* them and drafts an implementation plan.
- **Want to extend Forge Guru further?** Try adding a second action — e.g. `list-recent-tickets` so Forge Guru can show you what it's created recently. Write the snippet file first, then write the lab prompt that applies it. You now know the shape.

→ **[Back to the workshop index](../../README.md)**
