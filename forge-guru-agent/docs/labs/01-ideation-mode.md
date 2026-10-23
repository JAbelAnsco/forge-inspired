# Lab 1 · Ideation mode

## What you're building

In this lab you teach Forge Guru to help you brainstorm Forge app ideas. Ask it what to build next, give it a bit of context about you or your team, and it comes back with 3 to 5 tailored pitches, each a sketch of a real app you could actually ship.

Every idea comes back in the same shape, so they are easy to compare: a title, the Problem it solves, Who it's for, the Forge modules it would use, and the Happy path end-to-end.

And you do it all without writing a single line of JavaScript. The whole change lives in the agent `prompt:` block in `manifest.yml`.

## Ideas you need

- **The `prompt:` block IS the agent's instructions.** Editing it is editing the agent. Nothing is compiled, nothing is transformed.
- A new behavior is usually a new `## Section` in the prompt, plus (optionally) a new conversation starter.
- The starter prompt already tells Forge Guru how to answer Forge questions. You're layering a new mode on top of that identity, not replacing it.
- **No scope change, so no reinstall.** You only need `forge deploy`.

## You should be here

- Lab 0's proof checklist is green. Forge Guru is installed on your Jira site and replies to Forge questions.
- Your local `manifest.yml` is still the starter: one `rovo:agent` entry, one placeholder `function`, empty `scopes: []`.

## File: `manifest.yml`

1. Open `forge-guru-agent/starter/manifest.yml`.
2. Find the `prompt: >` block on `rovo:agent`.
3. Find the line that starts with `## Important`.
4. Immediately **before** `## Important`, paste the contents of **[snippets/01-prompt-ideation.yml](snippets/01-prompt-ideation.yml)**.

> **Watch the indentation.** The prompt body is indented 8 spaces under `prompt: >`. Your new `## Ideation mode` section must sit at the same indent as the existing sections, or YAML will refuse to parse it.

5. Scroll down to `conversationStarters:` and add a new line at the bottom of the list:

```yaml
        - I want to build a Forge app but I don't know where to start, any ideas?
```

## Already written

- The agent's baseline personality, tone, and Forge-question behavior. Do not change them.
- The placeholder `function`. Do not touch it.

## Redeploy

In the Codespace terminal, from `forge-inspired/forge-guru-agent/starter/`:

```bash
forge deploy
```

That's it. No `forge install --upgrade` needed; scopes did not change.

## Proof checklist

1. Open Rovo Chat and pick Forge Guru.
2. You should see your new conversation starter listed. Click it, or type:

   > *"I'm on a platform team at a mid-sized SaaS company. Give me 3 Forge app ideas to clean up our Jira project."*

3. The reply contains 3 to 5 pitches, numbered.
4. Each pitch has the four fields: **Problem**, **Who it's for**, **Forge modules** (with real manifest keys), **Happy path**.
5. The reply ends with the one-line nudge inviting you to file one as a Jira ticket.

If the reply reads like plain prose instead of the structured shape, the new section probably did not land inside the prompt. Check indentation, re-deploy, and try again.

## If you get stuck

- Run `forge lint`. If indentation is off, it will point at the line.
- Open **[snippets/01-prompt-ideation.yml](snippets/01-prompt-ideation.yml)** and recheck the pasted section matches exactly, including the leading 8 spaces.
- Still stuck? Flag your instructor, or see **[docs/reference/TROUBLESHOOTING.md](../reference/TROUBLESHOOTING.md)**.

## What you just learned

The prompt is the product. One YAML edit, and the agent has a brand new behavior. In **[Lab 2 · Write a ticket](02-write-a-ticket.md)** you will go further and give the agent a real action, so it can file a Jira ticket for an idea you pick.

→ **[Lab 2 · Write a ticket](02-write-a-ticket.md)**
