# Lab 1 · Ideation mode

## What you're building

A version of Forge Guru that, when asked, pitches you a **structured Forge app idea** — Problem, Who it helps, Suggested module(s), Suggested scopes, Rough happy path — grounded in Forge reality. By default it'll pitch three ideas at once, ordered from safest to boldest.

**You don't write a single line of JavaScript.** The whole change lives in the agent `prompt:` block in `manifest.yml`.

## Ideas you need

- **The `prompt:` block IS the agent's instructions.** Editing it is editing the agent. Nothing is compiled, nothing is transformed.
- Adding a new behavior is usually a matter of adding a new `## Section` to the prompt and (optionally) one new entry under `conversationStarters:`.
- The Lab 0 prompt already tells Forge Guru it's "a friendly, pragmatic expert on Atlassian Forge". You're layering a new *mode* on top of that identity, not replacing it.
- **No scope change, so no reinstall.** You only need `forge deploy`.

## You should be here

- Lab 0's proof checklist is green. Forge Guru is installed on your site and replies to a stock prompt.
- Your local `manifest.yml` is still the baseline (one `rovo:agent` entry, one placeholder `function`, empty `scopes: []`).

## File: `manifest.yml`

1. Open `forge-guru-agent/starter/manifest.yml`.
2. Find the `prompt: >` block on `rovo:agent`.
3. Find the line that starts with `## Important`.
4. Immediately **before** `## Important`, paste the contents of **[snippets/01-prompt-ideation.yml](snippets/01-prompt-ideation.yml)**.

> **Watch the indentation.** The prompt body is indented 8 spaces under `prompt: >`. Your new `## Ideation mode` section must sit at the same indent as `## What you know`, `## How to answer`, etc. — otherwise YAML will refuse to parse it.

5. Scroll down to `conversationStarters:` and add one new line at the bottom of the list:

```yaml
        - Help me brainstorm a Forge app for my team
```

## Already written

- The agent's baseline personality, tone, and rules. Do not change them.
- The placeholder `function`. Do not touch it.

## Redeploy

In the Codespace terminal, from `forge-inspired/forge-guru-agent/starter/`:

```bash
forge deploy
```

That's it. No `forge install --upgrade` — you didn't change scopes.

## Proof checklist

1. Open Rovo Chat and pick Forge Guru.
2. You should see your new conversation starter listed. Click it, or type:

   > *"I'm on a platform team at a mid-sized SaaS company. Give me 3 Forge app ideas that would make our Jira project cleaner. For each one, name the module and scopes it'd use."*

3. The reply contains **three** app pitches.
4. Each pitch has the five fields: **Problem**, **Who it helps**, **Suggested module(s)** (with real manifest keys), **Suggested scopes**, **Rough happy path** (3–5 numbered steps).
5. The pitches are ordered safest → boldest, not alphabetically or at random.

If the reply looks like a plain prose answer instead of the structured shape, the new section probably didn't land inside the prompt — check indentation and re-deploy.

## If you get stuck

- Run `forge lint` — if the new section's indentation is off, it'll point at the line.
- Open **[docs/labs/snippets/01-prompt-ideation.yml](snippets/01-prompt-ideation.yml)** and recheck that your pasted section matches it exactly (including the leading 8 spaces).
- Still stuck? Flag your instructor, or see [docs/reference/TROUBLESHOOTING.md](../reference/TROUBLESHOOTING.md).

## What you just learned

The prompt *is* the product. One YAML edit → the agent has a brand new behavior. In **[Lab 2 · Write a ticket](02-write-a-ticket.md)**, you'll go further: give the agent an actual *action* so it can file a Jira ticket for an idea you picked.

→ **[Lab 2 · Write a ticket](02-write-a-ticket.md)**
