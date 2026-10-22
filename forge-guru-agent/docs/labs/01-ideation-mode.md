# Lab 1 · Ideation mode

## What you're building

A version of Forge Guru that, when asked, pitches you a **structured Forge app idea** — Problem, Who it helps, Suggested module(s), Suggested scopes, Rough happy path. By default it'll pitch three ideas at once, ordered from safest to boldest.

You don't write a single line of JavaScript, and you don't type the YAML yourself either. The whole change is a one-prompt handoff to your coding assistant — the assistant edits `manifest.yml` for you using the exact snippet shipped in this repo, redeploys the agent, and reports back.

## Ideas you need

- **The `prompt:` block IS the agent's instructions.** Editing it is editing the agent. Nothing is compiled, nothing is transformed.
- Adding a new behavior is usually a matter of adding a new `## Section` to the prompt and (optionally) one new entry under `conversationStarters:`.
- The Lab 0 prompt already tells Forge Guru it's a Forge expert. You're layering a new *mode* on top of that identity, not replacing it.
- **No scope change, so no reinstall.** The lab prompt tells the assistant to run `forge deploy` and stop — no `forge install --upgrade` needed.
- **Why hand this to the assistant?** The exact snippet to paste, the exact spot it goes in `manifest.yml`, and the correct indentation are all deterministic. The assistant does it the same way every time; a human does it the same way *most* of the time. Workshops are better when "most" becomes "every."

## You should be here

- Lab 0's proof checklist is green. Forge Guru is installed on your site and replies to a stock prompt.
- Your local `manifest.yml` is still the baseline (one `rovo:agent` entry, one placeholder `function`, empty `scopes: []`).
- You're sitting in `forge-inspired/forge-guru-agent/` in your Codespace terminal.

## Source-of-truth snippet file

The assistant will apply the exact contents of this file:

- **[docs/labs/snippets/01-prompt-ideation.yml](snippets/01-prompt-ideation.yml)** — the `## Ideation mode` section to add to the agent prompt.

## Step 1 — paste the lab prompt into your coding assistant

Open your coding assistant inside the Codespace — Cursor, Claude Code, Codex, GitHub Copilot CLI, Gemini CLI, or whichever one you prefer. Paste the prompt below and let it drive.

```text
Please apply Lab 1 (Ideation mode) to my local Forge Guru checkout.

I'm in `forge-inspired/forge-guru-agent/` in a Codespace. I've already
completed Lab 0, so `manifest.yml` has my own `app.id` and the stock
agent is deployed to a Jira Cloud site.

The source-of-truth snippet file is:

  docs/labs/snippets/01-prompt-ideation.yml

Please do the following in order, stopping if any step fails:

1. Open `manifest.yml`. Find the `prompt: >` block on the single
   `rovo:agent` entry. Find the line that starts with `## Important`.
2. Insert the full contents of
   `docs/labs/snippets/01-prompt-ideation.yml` IMMEDIATELY BEFORE the
   `## Important` section, preserving the surrounding indentation of
   the prompt body (8 spaces).
3. Under `conversationStarters:`, add one new entry at the bottom of
   the list:
       - Help me brainstorm a Forge app for my team
4. Show me the full diff of the two edits BEFORE saving the file.
   Wait for my confirmation before writing.
5. After I confirm, save the file, run `forge lint` to confirm the
   YAML is valid, then run `forge deploy` to the default (development)
   environment.
6. Do NOT run `forge install --upgrade` — no scopes changed.

When you're done, give me:
- a one-line summary of each file you touched,
- confirmation that `forge lint` passed and `forge deploy` succeeded,
- a conversation starter I can click in Rovo Chat to test the new
  ideation mode.
```

Your assistant will walk through those steps. Confirm the diff when it shows it to you.

## Proof checklist

1. Open Rovo Chat and pick Forge Guru.
2. You should see your new conversation starter listed. Click it, or type:

   > *"I'm on a platform team at a mid-sized SaaS company. Give me 3 Forge app ideas that would make our Jira project cleaner. For each one, name the module and scopes it'd use."*

3. The reply contains **three** app pitches.
4. Each pitch has the five fields: **Problem**, **Who it helps**, **Suggested module(s)** (with real manifest keys), **Suggested scopes**, **Rough happy path** (3–5 numbered steps).
5. The pitches are ordered safest → boldest.

If the reply looks like a plain prose answer instead of the structured shape, the new section probably didn't land inside the prompt — ask your assistant to re-check indentation and re-deploy.

## If you get stuck

- Ask your assistant to re-open `manifest.yml` and show you the current content of the `prompt:` block. Compare against **[snippets/01-prompt-ideation.yml](snippets/01-prompt-ideation.yml)** — the inserted section should match exactly.
- `forge lint` will point at the first offending YAML line.
- See [docs/reference/TROUBLESHOOTING.md](../reference/TROUBLESHOOTING.md) or flag your instructor.

## What you just learned

The prompt *is* the product. One YAML edit — applied for you by your coding assistant — gave the agent a brand new behavior. In **[Lab 2 · Write a ticket](02-write-a-ticket.md)**, you'll go further: give the agent an actual *action* so it can file a Jira ticket for an idea you picked. Same assistant-driven pattern, more files.

→ **[Lab 2 · Write a ticket](02-write-a-ticket.md)**
