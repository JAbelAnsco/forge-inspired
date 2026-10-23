# Forge Guru — Lab 1 + Lab 2 solution

This folder is the **final state** of the Forge Guru workshop after both Lab 1 (Ideation mode) and Lab 2 (Ticket-writing mode + the `create-ticket` action) have been applied. If your coding assistant fails to apply the lab edits cleanly, or you fall behind in a live workshop, you can use these files as an escape hatch.

## What's in here

- **`manifest.yml`** — the Lab 2 end-state manifest. Includes the baseline Forge Guru prompt, the Lab 1 `## Ideation mode` section, the Lab 2 `## Ticket-writing mode` section, the `create-ticket` action module, the `create-ticket-fn` function entry, and the `write:jira-work` scope. Deliberately **does NOT include an `app.id`** — see "Important" below.
- **`src/index.js`** — the Lab 2 end-state handler file. Includes the baseline `placeholder` export, the `baseUrlFromSelf` helper (same shape used by `sprint-ready-agent` and `implementation-plan-agent`), and the `createTicket` export.

## How to use it

> **Important: do NOT replace your own `manifest.yml` wholesale.**
> `forge register` writes your own `app.id` into your local `manifest.yml`. If you overwrite the whole file with this one, you'll lose that id and your deploys will go nowhere (or worse, nowhere useful). Overlay the sections you need, keeping your own `app.id` block intact.

The simplest recovery flow:

1. From the Forge Guru app directory (`forge-inspired/forge-guru-agent/`), look at `solution/manifest.yml` side-by-side with your own `manifest.yml`.
2. **Copy the `prompt:` body, the `action:` list under `rovo:agent`, the top-level `modules.action` block, the full `modules.function` block, and the `permissions.scopes` block from `solution/manifest.yml` into your `manifest.yml`.**
3. **Leave your own `app:` block (with your `id:`) exactly as it is.** Do not copy the `app:` block from this folder.
4. Overlay `solution/src/index.js` onto your `src/index.js` wholesale — this file has no personal identifiers, so it's safe to replace.

Then:

```bash
forge lint
forge deploy
forge install --upgrade   # only if scopes have changed since your last install
```

## When to reach for this

- Your coding assistant kept looping or produced malformed YAML.
- You pasted a snippet into the wrong place and the diff is more painful to reverse than to restart.
- You're running a live workshop and an attendee is 10 minutes behind.
- You want to compare your end-state against a known-good one.

## When NOT to reach for this

- You're mid-lab and haven't tried a lab prompt yet — do the lab first, this is a safety net not a shortcut.
- You want to understand *why* each edit is there — the lab files (`docs/labs/01-ideation-mode.md`, `docs/labs/02-write-a-ticket.md`) explain the reasoning in context.
