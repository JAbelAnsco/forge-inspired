# Implementation Plan Agent — Lab 2 solution

This folder is the **final state** of the Implementation Plan Agent workshop after Lab 2 (customize your agent) has been applied. If your coding assistant fails to apply the Lab 2 edit cleanly, or you fall behind in a live workshop, you can use these files as an escape hatch.

Lab 2 ships three example customizations under [`docs/labs/snippets/`](../docs/labs/snippets/) — testing checklist, security review, and Forge-docs grounding. The solution folder uses the **testing checklist** customization because that's what Lab 2 recommends by default; if you picked a different one, use its snippet instead and don't overlay this folder's `manifest.yml`.

## What's in here

- **`manifest.yml`** — the Lab 2 end-state manifest with the testing-checklist customization applied. The plan now has FIVE sections instead of four (Context / Proposed approach / Implementation steps / Risks & open questions / **Testing checklist**). Deliberately **does NOT include an `app.id`** — see "Important" below.

There's no `src/` folder because Lab 2 is a **prompt-only** customization — the agent handlers are unchanged from Lab 0.

## How to use it

> **Important: do NOT replace your own `manifest.yml` wholesale.**
> `forge register` writes your own `app.id` into your local `manifest.yml`. If you overwrite the whole file with this one, you'll lose that id and your deploys will go nowhere (or worse, nowhere useful). Overlay the sections you need, keeping your own `app.id` block intact.

The simplest recovery flow:

1. From the agent app directory (`forge-inspired/implementation-plan-agent/`), look at `solution/manifest.yml` side-by-side with your own `manifest.yml`.
2. The only real difference is **the extra `**Testing checklist**` bullet inside step 4 of the "WHEN A USER ASKS YOU TO PLAN AN ISSUE" sequence** in the `prompt:` block. Copy just that bullet into your file.
3. **Leave your own `app:` block (with your `id:`) exactly as it is.** Do not copy the `app:` block from this folder.

Then:

```bash
forge lint
forge deploy
```

No `forge install --upgrade` needed — scopes haven't changed.

## When to reach for this

- Your coding assistant produced malformed YAML.
- You pasted the snippet into the wrong spot and the indentation is painful to fix.
- You're running a live workshop and an attendee is behind.
- You want to compare your end-state against a known-good one.

## When NOT to reach for this

- You picked the **security review** or **Forge-docs grounding** customization instead of testing checklist — use the matching snippet file in `docs/labs/snippets/` instead.
- You want to understand *why* the edit is there — the lab file (`docs/labs/02-customize-your-agent.md`) explains it in context.
