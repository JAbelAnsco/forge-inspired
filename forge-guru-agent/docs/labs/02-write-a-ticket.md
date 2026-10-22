# Lab 2 · Write a ticket

## What you're building

A version of Forge Guru that can **create a real Jira ticket** for an app idea you picked. By the end of this lab the agent you deployed in Lab 0 will:

1. Pitch you three Forge app ideas (Lab 1 behavior).
2. Ask you which one you like and which Jira project to file it in.
3. **Create the ticket**, and reply with a working link to it in Jira.

Full circle: the agent pitches, you decide, the agent files.

## Ideas you need

- **Rovo agents can call `action` modules.** An action is a tiny, typed function the agent invokes mid-conversation when it decides it needs to do something in a product. The agent reasons about *when* to call it based on the prompt you write; the action handler does the *doing*.
- **Actions need scopes.** The second you add `write:jira-work`, your app's permissions change — so after this lab you'll run `forge install --upgrade` (not just `forge deploy`) so the site re-accepts the new scope.
- **`.asUser()` is the right default.** The ticket's reporter will be *you*, and the create-issue permission check runs against *your* Jira permissions, not the app's. The app can't do anything you yourself can't do.
- The action takes four typed inputs: `projectKey`, `summary`, `description`, `issueType`. The agent fills them from the conversation.

## You should be here

- Lab 1 proof checklist is green. Forge Guru pitches structured ideas.
- Your `manifest.yml` has the `## Ideation mode` section and the extra conversation starter.
- You have a Jira project you can create issues in (any project in your dev site works).

## File 1: `manifest.yml`

Open **[snippets/02-manifest-action.yml](snippets/02-manifest-action.yml)** and follow its four edits (A, B, C, D), in order. In short:

- **Edit A:** add `action: [create-ticket]` on the `rovo:agent` entry.
- **Edit B:** add one new `conversationStarters:` line — *"Turn my app idea into a Jira ticket"*.
- **Edit C:** add a new `modules.action` list with the `create-ticket` action definition, and a new entry under `modules.function` for the handler.
- **Edit D:** add `write:jira-work` under `permissions.scopes`.

## File 2: `src/index.js`

Open **[snippets/02-create-ticket.js](snippets/02-create-ticket.js)** and append the `createTicket` export to your `src/index.js`.

Keep the existing `placeholder` export. You're adding a sibling, not replacing anything.

Also add this import at the top of `src/index.js` if it's not already there:

```javascript
import api, { route } from '@forge/api';
```

## File 3: the agent prompt (back to `manifest.yml`)

Open **[snippets/02-prompt-ticket-mode.yml](snippets/02-prompt-ticket-mode.yml)** and paste its `## Ticket-writing mode` section into the `prompt:` block, immediately **after** your `## Ideation mode` section from Lab 1 (and still **before** `## Important`).

Same indentation rule as Lab 1: 8 spaces, matching the surrounding sections.

## Already written

- The agent personality + ideation mode (don't change them).
- The `placeholder` function (leave it alone — Forge still requires it).

## Redeploy *and* reinstall

Because scopes changed, you need both:

```bash
forge deploy
forge install --upgrade
```

Confirm the new scope grant when the install prompts you.

## Proof checklist

1. Open Rovo Chat and pick Forge Guru.
2. Ask it to pitch three Forge app ideas for your team (same as Lab 1 proof).
3. In the same chat, say:

   > *"I like the first one. File it as a ticket in project PROJ."*
   > *(Replace `PROJ` with a real project key from your Jira site.)*

4. The agent's reply contains a line like **"Created [PROJ-123](https://your-site.atlassian.net/browse/PROJ-123)."**
5. Open that link. The ticket exists, you're the reporter, and the description contains the Problem / Who / Modules / Scopes / Happy path fields.

## If you get stuck

- **Chat says "I don't have permission".** You skipped `forge install --upgrade`. Scopes-change always needs it, not just `deploy`.
- **The ticket is created but the link in chat is wrong.** The handler builds the URL from `context.siteUrl`. If chat shows no URL, double-check you deployed the handler file and that `forge logs --since 5m` doesn't show a Jira error.
- **Jira rejects with 400.** Usually your project key doesn't exist, or your site doesn't allow the `Task` issue type on that project. Try a different project, or ask the agent to use `Story` instead.
- **Prompt tweak didn't take effect.** Give it ~30 seconds (prompts cache briefly), then try again.

Compare each of the four snippet files against the corresponding section of your local `manifest.yml` / `src/index.js` if anything looks structurally off. Still stuck? See [docs/reference/TROUBLESHOOTING.md](../reference/TROUBLESHOOTING.md) or flag your instructor.

## What you just learned

The prompt tells the agent *when* to act. Actions let the agent *actually act*. Scopes gate what actions are allowed to touch. That three-part model — **prompt + actions + scopes** — is how every Rovo agent is built, from the simplest to the most elaborate.

## Where to go next

- **Want the agent to read a ticket back and plan it in detail?** That's the next workshop in the collection: **[Implementation Plan Agent](../../../implementation-plan-agent/README.md)**. The agent you just built *writes* tickets; that one *reads* them and drafts an implementation plan.
- **Want to extend Forge Guru further?** Try adding a second action — e.g. `list-recent-tickets` so Forge Guru can show you what it's created recently.

→ **[Back to the workshop index](../../README.md)**
