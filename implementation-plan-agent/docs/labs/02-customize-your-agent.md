# Lab 2 · Customize your planning agent

## What you're building

An opinionated version of the Implementation Plan Agent that *always* bakes a specific lens into every plan it writes — a **Testing checklist**, a **Security considerations** section, or a **Relevant Forge documentation** section. (Or your own — once you've seen how the pattern works, you can invent your own.)

The point: see with your own eyes that **the prompt is the product**. One YAML edit → every future plan the agent writes changes shape. No new code, no new scopes, no reinstall — just `forge deploy`.

## Ideas you need

- **Prompt edits are deploys, not reinstalls.** You're not changing scopes, so `forge install --upgrade` is not needed. One `forge deploy` is enough.
- **Where you insert matters.** The stock prompt structures a plan in step 4 of the "WHEN A USER ASKS YOU TO PLAN AN ISSUE" sequence. New plan sections go *inside* that step 4, as a new bullet, so the agent treats them as "a required section of every plan."
- **Your AI coding assistant should do the file edit.** The point of this lab is iterating on the agent's behavior, not practising YAML edits by hand. Let your assistant paste the snippet in the right place.

## You should be here

- Lab 1 proof checklist is green.
- You have at least one Jira ticket that already has a stock plan comment on it — you'll compare Lab 2's output against that one.

## Step 1 — pick a customization

Pick **one** of the three starter snippets. (If you prefer, write your own in the same shape and skip the snippet.)

| Snippet | Teaches the agent to always… |
|---|---|
| **[snippets/02-prompt-testing-checklist.yml](snippets/02-prompt-testing-checklist.yml)** | …end every plan with a 4+ item testing checklist, including unit, integration, and negative-path tests. |
| **[snippets/02-prompt-security-review.yml](snippets/02-prompt-security-review.yml)** | …end every plan with 3–5 explicit security questions — scopes, `asUser` vs `asApp`, input validation, egress, data storage. |
| **[snippets/02-prompt-forge-docs-ground.yml](snippets/02-prompt-forge-docs-ground.yml)** | …end every plan with a short list of relevant `developer.atlassian.com` doc links, each tied to a specific decision in the plan. |

> **Which one should you pick?** All three are good — pick the one that fits a gap you noticed when reading your Lab 1 plan. If you're genuinely torn, pick the Testing checklist: it's the most visually obvious change, which makes the "it actually worked" moment unmissable.

## Step 2 — ask your AI coding assistant to edit the prompt

Open the AI chat panel in your Codespace. Paste this prompt and run it (replace the snippet path with the one you picked):

```text
Please update `implementation-plan-agent/manifest.yml` for me.

Open the `prompt:` block on `rovo:agent`. Find the "WHEN A USER ASKS
YOU TO PLAN AN ISSUE:" sequence, then step 4 inside that sequence.
Step 4 currently defines four plan sections, ending with the
"**Risks & open questions**" bullet.

Add a new section bullet IMMEDIATELY AFTER the "**Risks & open
questions**" bullet, using exactly the content from this file:

implementation-plan-agent/docs/labs/snippets/02-prompt-testing-checklist.yml

Preserve the surrounding YAML indentation. Do not change anything
outside step 4. Show me the diff before saving.
```

Review the diff. If the new bullet is indented at the same level as the four existing section bullets (**Context / Proposed approach / Implementation steps / Risks & open questions**), you're good.

## Step 3 — redeploy

In the Codespace terminal, from `forge-inspired/implementation-plan-agent/`:

```bash
forge deploy
```

No `--upgrade`. No new scopes.

## Step 4 — rerun Lab 1 and compare

1. Open a Jira ticket — ideally one you *haven't* planned before, so you get a clean comment. Or create a new one using the Lab 1 starter.
2. Invoke the Implementation Plan Agent and ask it to plan the ticket.
3. Wait for the new comment and read it.

## Proof checklist

- [ ] The new plan comment contains your added section — the title you added (e.g. **Testing checklist**) appears as a heading in the plan.
- [ ] The section's content matches the shape your snippet asked for (e.g. a testing checklist actually has at least 4 bulleted tests and includes a negative-path test).
- [ ] The four original sections (**Context / Proposed approach / Implementation steps / Risks & open questions**) are still there — your edit *extended* the plan, it didn't *replace* parts of it.
- [ ] Side-by-side with your Lab 1 plan on the same (or a similar) ticket, the Lab 2 plan is visibly richer in the dimension you added.

## If you get stuck

- **The new section isn't appearing.** Did `forge deploy` actually finish successfully? Did you give the prompt cache ~30 seconds? Did you paste the snippet INSIDE step 4 (not after the whole sequence)?
- **Indentation errors.** Run `forge lint` — it will tell you which line YAML can't parse.
- **The plan has your section but the content is thin.** Your snippet's expectations are the ceiling. If you want more depth, strengthen the snippet (e.g. "at least 6 tests" instead of 4), redeploy, and try again. This is the iteration loop the lab is teaching.

Compare against **[`implementation-plan/lab-02`](https://github.com/atlassian-labs/forge-inspired/tree/implementation-plan/lab-02/implementation-plan-agent/manifest.yml)** if the structure of your `manifest.yml` looks off. (The checkpoint ships the testing-checklist snippet applied.) **Never copy the checkpoint `manifest.yml` wholesale** — your local one holds your personal `app.id`.

## What you just learned

The main takeaway for this whole workshop is this: **the quality of AI-generated work is a function of requirements, context, and iteration.**

- **Requirements** — Lab 1 showed you that a sharper Jira description produces a sharper plan.
- **Context** — the agent's prompt is the context it brings to every plan. Changing the prompt changes the context every future plan is drafted against.
- **Iteration** — Lab 2 is literally one iteration. Nothing stops you from doing another: layer in a second snippet, or write your own, or tighten what you added. `forge deploy` is cheap.

## Where to go next

- **Add a second customization.** Pick a different snippet from Step 1 and layer it in. Both will apply to every future plan.
- **Write your own section.** Mirror the shape of the shipped snippets — a bullet labelled with a bold section name, followed by a few lines explaining what should go in it. Keep it prescriptive.
- **Tighten the Lab 1 behavior.** Add a short "If the issue description is weaker than X, ask one clarifying question before planning" rule to the prompt.
- **Try the companion workshop:** **[Forge Guru](../../../forge-guru-agent/README.md)** teaches you to build an agent from the other direction — ideation and writing tickets, instead of reading and planning them.

→ **[Back to the workshop index](../../README.md)**
