# Lab 2 · Customize your agent

## What you're building

This is the lab where you discover that **the prompt is the product**. You teach the Implementation Plan Agent to always weave a new lens into every plan it writes, a Testing checklist, a Security review, or links to the right Forge docs. One YAML edit, one `forge deploy`, and every future plan the agent writes changes shape.

The best part: you built this once in Lab 0. Now, with a single file edit, you've got a sharper, more opinionated version. That's the loop every real agent lives in.

You will not run a coding assistant for this lab. You open the file, you paste one block, you deploy. Feeling the YAML in your fingers is the whole point.

## Ideas you need

- **Prompt edits are deploys, not reinstalls.** You're not changing scopes, so `forge install --upgrade` is not needed. One `forge deploy` is enough.
- **The agent's prompt is a numbered pipeline.** Open `manifest.yml` and find the `prompt: >` block on `rovo:agent`. Inside it the agent follows a 6-step pipeline titled `WHEN A USER ASKS YOU TO PLAN AN ISSUE:`. The steps are: *(1)* ask for an issue key, *(2)* call `inspect-issue`, *(3)* draft a plan, *(4)* **structure the plan into these sections**, *(5)* call `post-implementation-plan`, *(6)* reply to the user. **Step 4 is where this lab lives.** It currently defines four plan sections (Context, Proposed approach, Implementation steps, Risks & open questions). You're going to add a fifth.
- **YAML cares about spaces.** The prompt body is indented 6 spaces under `prompt: >`. Section bullets inside step 4 start with 9 spaces (`-` then a space). Bullet continuation lines wrap to 13 spaces. If your new bullet is off by even one space, `forge lint` will catch it. Match the surrounding indentation exactly.

## You should be here

- Lab 1 proof checklist is green.
- You have at least one Jira ticket that already has a stock plan comment on it. You'll compare Lab 2's output against that one.

## Step 1 — pick a customization

Three snippet files ship in `docs/labs/snippets/`. Pick one that matches what you want your plans to feel like:

| Snippet | What it adds | When to pick it |
| --- | --- | --- |
| **[02-prompt-testing-checklist.yml](snippets/02-prompt-testing-checklist.yml)** | A **Testing checklist** section with happy-path, negative-path, and edge-case cases. | You keep forgetting the negative-path test. |
| **[02-prompt-security-review.yml](snippets/02-prompt-security-review.yml)** | A **Security review** section covering scopes, data exposure, and ownership. | You're building for a security-sensitive environment. |
| **[02-prompt-forge-docs-ground.yml](snippets/02-prompt-forge-docs-ground.yml)** | A **Relevant Forge documentation** section with inline links to the official docs. | Your plans too often cite made-up module names. |

Pick exactly one. (You can layer a second one later; keep this lab small.)

## Step 2 — paste the snippet into `manifest.yml`

1. Open `forge-inspired/implementation-plan-agent/starter/manifest.yml` in the Codespace editor.
2. Find the `prompt: >` block on `rovo:agent` (around line 11).
3. Scroll down inside that block until you find step 4 of the `WHEN A USER ASKS YOU TO PLAN AN ISSUE:` pipeline. It lists four section bullets. The last one is **Risks & open questions**.
4. Open the snippet file you picked in Step 1 and copy its full contents.
5. Paste the snippet **immediately after** the `**Risks & open questions**` bullet (and its continuation lines), still **inside** step 4.
6. Save the file.

> **Indentation is everything.** Your new bullet must start at the same column as the four existing bullets (9 spaces). Bullet continuation lines must start at 13 spaces. If your editor uses tabs, swap them for spaces. `forge lint` will refuse to deploy a misaligned prompt.

Here's what step 4 should look like once you've pasted the testing-checklist snippet (abridged):

```yaml
        4. Structure the plan with these sections, in this order:

           - **Context** ...

           - **Proposed approach** ...

           - **Implementation steps** ...

           - **Risks & open questions** ...

           - **Testing checklist** — a short, prescriptive list of tests
             an engineer should write for this change. Include at least
             one negative-path and one edge-case test.
```

Same shape for the other two snippets, just with different section titles and body text.

## Step 3 — lint and deploy

In the Codespace terminal, from `forge-inspired/implementation-plan-agent/starter/`:

```bash
forge lint
forge deploy
```

Both should finish without errors. No `forge install --upgrade` needed (scopes did not change).

## Already written

- The agent's two actions, three scopes, and the surrounding pipeline. Do not change them. The lab is one bullet in step 4, nothing else.

## Step 4 — rerun Lab 1 and compare

1. Open a Jira ticket, ideally one you *haven't* planned before, so you get a clean comment. Or create a new one using the Lab 1 starter.
2. Invoke the Implementation Plan Agent and ask it to plan the ticket.
3. Wait for the new comment and read it.

## Proof checklist

- [ ] The new plan comment contains your added section. The title you added (e.g. **Testing checklist**) appears as a heading in the plan.
- [ ] The section's content matches the shape your snippet asked for (e.g. a testing checklist actually has at least 4 bulleted tests and includes a negative-path test).
- [ ] The four original sections (**Context / Proposed approach / Implementation steps / Risks & open questions**) are still there. Your edit *extended* the plan, it didn't *replace* parts of it.
- [ ] Side-by-side with your Lab 1 plan on the same (or a similar) ticket, the Lab 2 plan is visibly richer in the dimension you added.

## Solution

If your YAML edit won't lint or deploy cleanly, overlay the final-state manifest from **[`solution/`](../../solution/)**. The default solution uses the **testing checklist** customization. If you picked security review or Forge-docs grounding instead, use the matching snippet file. See [`solution/README.md`](../../solution/README.md) for overlay instructions, and in particular do NOT replace your `starter/manifest.yml` wholesale because it holds your personal `app.id` from Lab 0.

## If you get stuck

- **`forge lint` complains about indentation.** Open the diff in your editor and compare your new bullet column-for-column against the four existing bullets. The dash must line up with the other dashes; continuation lines must indent four more spaces beyond the dash.
- **The new section isn't appearing in plans.** Did `forge deploy` actually finish successfully? Did you give the prompt cache ~30 seconds? Did you paste the snippet INSIDE step 4 (not after the whole sequence)?
- **Stuck on an error you don't understand?** Hand the error output to your AI coding assistant and ask it to diagnose using the Forge MCP `diagnose-forge-error` tool. Forge MCP consults the authoritative Forge docs for the fix, so you're not guessing.
- See **[docs/reference/TROUBLESHOOTING.md](../reference/TROUBLESHOOTING.md)** for more.

## What you just learned

The main takeaway for this whole workshop is this: **the quality of AI-generated work is a function of requirements, context, and iteration.**

- **Requirements:** Lab 1 showed you that a sharper Jira description produces a sharper plan.
- **Context:** the agent's prompt is the context it brings to every plan. Changing the prompt changes the context every future plan is drafted against.
- **Iteration:** Lab 2 is literally one iteration. Nothing stops you from doing another. Layer in a second snippet, or write your own, or tighten what you added. `forge deploy` is cheap.

## Where to go next

- **Try the companion workshop:** **[Forge Guru](../../../forge-guru-agent/README.md)** teaches you to build an agent from the other direction, ideation and writing tickets, instead of reading and planning them.
- **Take an idea to market.** The **[Build and Launch your Forge App](https://developer.atlassian.com/platform/forge/build-and-launch-your-forge-app/)** guide walks you through packaging a Forge app, listing it on the Atlassian Marketplace, and sharing it with your team.

→ **[Back to the workshop index](../../README.md)**
