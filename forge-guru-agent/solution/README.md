# Forge Guru — Lab 1 + Lab 2 reference solution

This folder is a **standalone, deployable Forge app** that represents the final state of the Forge Guru workshop with both Lab 1 (Ideation mode) and Lab 2 (Ticket-writing mode + the `create-ticket` action) already applied.

It sits beside the `starter/` folder, which is the baseline app attendees build on across the workshop. If your coding assistant can't apply the lab edits cleanly, or you fall behind in a live workshop, you can:

- **Browse these files directly in GitHub** to compare them with your own `starter/` files and copy specific sections across; OR
- **Deploy this folder as its own Rovo agent** on your Jira site so you can see the finished workshop running end-to-end.

## What's in here

- **`manifest.yml`** — the Lab 2 end-state manifest. Includes the baseline Forge Guru prompt, the Lab 1 `## Ideation mode` section (with the "want me to file this?" turn-boundary nudge), the Lab 2 `## Ticket-writing mode` section (five-step Sprint-Ready-style pipeline), the `create-ticket` action module (`actionVerb: TRIGGER`), the `create-ticket-fn` function entry, and the `write:jira-work` scope. **Deliberately does NOT include an `app.id`** — `forge register` writes your own.
- **`src/index.js`** — the Lab 2 end-state handler. Includes the baseline `placeholder` export, the `baseUrlFromSelf` helper (same pattern used across the Forge Inspired collection), and the `createTicket` export.
- **`package.json`** — mirrors `starter/package.json` versions (`@forge/api ^8.0.4`, `@forge/cli ^14.1.0`) so this folder installs cleanly without any extra setup.
- **`.gitignore`** — standard Forge app ignores plus `package-lock.json`.

## How to deploy this as a reference app

Run every command inside this folder. These are the same five commands from Lab 0, pointed at this folder instead of `starter/`:

```bash
cd forge-inspired/forge-guru-agent/solution
npm install
forge register       # mints a brand-new app id, writes it into manifest.yml
forge deploy
forge install        # pick your Jira site
```

Then open Rovo Chat on your site, pick **Forge Guru** (the one with the fully-applied prompt — you may want to name it `Forge Guru (reference)` in `manifest.yml` first if you also have your workshop copy installed), and try the end-to-end flow:

1. *"Pitch me 3 Forge app ideas for my team."*
2. *"File the first one in `<YOUR_PROJECT_KEY>`."* — replace with a real key from a Jira project on your site.
3. Click the link in the agent's reply. The ticket should exist on your tenant.

## How to use this as a reference without deploying

Just browse the files on GitHub:

- **[`manifest.yml`](manifest.yml)** — compare with your `starter/manifest.yml` section by section. The sections you'll have added across Lab 1 and Lab 2 are:
  - `## Ideation mode` (inside `prompt:`), with the trailing turn-boundary nudge.
  - `## Ticket-writing mode` (inside `prompt:`).
  - `## Important` — a simplified two-rule version.
  - A new `action:` list under the `rovo:agent` module: `[create-ticket]`.
  - A new top-level `modules.action` block.
  - A new entry in `modules.function` for `create-ticket-fn`.
  - A new `permissions.scopes` entry: `write:jira-work`.
- **[`src/index.js`](src/index.js)** — compare with your `starter/src/index.js`. The new entries are the `baseUrlFromSelf` helper and the `createTicket` export.

> **Important: do NOT overwrite your `starter/manifest.yml` wholesale with the solution's `manifest.yml`.** Your starter file has your own `app.id` written there by `forge register` in Lab 0. If you overwrite it, your Lab 0 deploys will go to a different app than this folder's does. Copy specific sections across instead, and leave your own `app:` block exactly as it is.

## When to reach for this

- Your coding assistant kept looping on the Lab 2 confirmation flow and you want to compare prompts.
- You pasted a snippet into the wrong spot and the diff is more painful to reverse than to copy a section cleanly from here.
- You're facilitating a live workshop and want a reference app installed on the same site so you can demo the end state.
- You want to understand what a correct final state actually looks like before you start Lab 2.

## When NOT to reach for this

- You haven't tried the lab yet. The lab files (`docs/labs/01-ideation-mode.md`, `docs/labs/02-write-a-ticket.md`) explain the *reasoning* behind each edit — this folder is just the end result.
- You want to keep two different Forge Guru agents permanently installed on the same site. The reference app isn't a demo app you ship with — it's a workshop safety net. Uninstall it (`forge uninstall`) when you're done comparing.
