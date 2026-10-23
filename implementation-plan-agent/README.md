# Implementation Plan Agent — Plan a Ticket, Then Teach the Planner

[![Atlassian license](https://img.shields.io/badge/license-Apache%202.0-blue.svg?style=flat-square)](../LICENSE) [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](../CONTRIBUTING.md)

> Part of the [**Forge Inspired**](../README.md) collection.

**Install a Rovo agent that turns a Jira ticket into an implementation plan — then make the planner yours.** The agent reads a ticket, drafts a four-section plan, and posts it back as a single comment. In this workshop you'll install it, use it on a real feature idea, then customize its prompt so every future plan includes the lens *you* care about — a testing checklist, a security review, Forge documentation grounding, or your own invention.

![Implementation Plan Agent in action](./img/implementationPlanAgent.gif)

## Start here

| When | Open this |
|---|---|
| **Before the workshop** | **[Set up your Codespace and Jira site](docs/SETUP.md)** |
| **When the workshop begins** | **[Lab 0 · Install the agent](docs/labs/00-install-the-agent.md)** |
| **When you need a later lab** | Jump to the [workshop labs](#workshop-labs) below |
| **When you are stuck** | See the [if you get stuck](#if-you-get-stuck) section below |

## Workshop labs

Follow these in order.

| Lab | You build | You are done when |
|---|---|---|
| **[0 · Install the agent](docs/labs/00-install-the-agent.md)** | Stock agent deployed and installed via your coding assistant | Agent posts a 4-section plan comment on a dummy ticket |
| **[1 · Plan a ticket](docs/labs/01-plan-a-ticket.md)** | A real Jira ticket + its first AI-generated plan | Comment with Context / Proposed approach / Steps / Risks on your ticket |
| **[2 · Customize your agent](docs/labs/02-customize-your-agent.md)** | A new section baked into every plan (testing / security / docs / your own) | Rerun of Lab 1 produces a plan containing your new section |

**Main takeaway:** learn to use **requirements, context, and iteration** to improve AI-generated work.

## How to use a lab

Every lab file follows the same shape:

- **What you're building** gives you the destination.
- **Ideas you need** explains the decisions behind the design.
- **You should be here** shows the exact state expected before you start.
- **File:** tells you exactly where a snippet belongs.
- **Already written** means inspect the helper; do not rebuild it.
- **Proof checklist** tells you when it is safe to continue.

Snippets live under **[docs/labs/snippets/](docs/labs/snippets/)** — including the Lab 1 starter requirement and the three Lab 2 customization snippets.

## If you get stuck

1. Re-read the **Proof checklist** at the bottom of the lab you're on — most issues are a missed step.
2. Run `forge lint` from the app directory — it will point at a malformed `manifest.yml`.
3. Tail the logs with `forge logs --since 15m` — any runtime failure in an action handler will land there.
4. Check [docs/reference/TROUBLESHOOTING.md](docs/reference/TROUBLESHOOTING.md) for the most common issues.
5. If you're in a live workshop, flag your instructor. Otherwise, [open an issue](https://github.com/atlassian-labs/forge-inspired/issues/new).

> **Heads up on `starter/manifest.yml`.** Lab 0 writes *your* personal app id into `starter/manifest.yml`. If you ever paste in a `manifest.yml` from somewhere else (another attendee's copy, the sibling `solution/manifest.yml`, an old backup), you'll lose your `app.id` and your deploys will go to someone else's app. Edit the file in place — don't replace it wholesale.

## Under the hood (reference)

- **Modules:** [`rovo:agent`](https://developer.atlassian.com/platform/forge/manifest-reference/modules/rovo-agent/) + [`action`](https://developer.atlassian.com/platform/forge/manifest-reference/modules/action/) × 2 + [`function`](https://developer.atlassian.com/platform/forge/manifest-reference/modules/function/) × 2.
- **Scopes:** `read:jira-work`, `read:jira-user`, `write:jira-work`. Only `post-implementation-plan` ever exercises the write scope.
- Every Jira call uses `asUser()`, so the agent's effective permissions are bounded by the invoking user's.
- The write path is deliberately narrow — it only posts comments. It cannot edit the description, transition the issue, or change any field.
- **Project layout:** two sibling folders.
  - [`starter/`](./starter/) is the baseline you deploy in Lab 0 and edit in Lab 2.
  - [`solution/`](./solution/) is the Lab 2 complete state (Testing checklist customization applied). Use it as a reference if your YAML edit will not lint. See [`solution/README.md`](./solution/README.md) for overlay instructions.
- **Entry points (inside `starter/`):**
  - [`starter/manifest.yml`](./starter/manifest.yml) — agent prompt, 2 actions, 3 scopes.
  - [`starter/src/actions/inspect-issue.js`](./starter/src/actions/inspect-issue.js) — the read path.
  - [`starter/src/actions/post-implementation-plan.js`](./starter/src/actions/post-implementation-plan.js) — the sole write path.
  - [`starter/src/jira.js`](./starter/src/jira.js) — shared helpers for base URLs and ADF conversion.
  - [`starter/src/index.js`](./starter/src/index.js) — exports wiring.
- **Full command cheatsheet:** [docs/reference/COMMANDS.md](docs/reference/COMMANDS.md).
- **Common issues:** [docs/reference/TROUBLESHOOTING.md](docs/reference/TROUBLESHOOTING.md).

## After the workshop

```bash
forge uninstall           # remove the development install from your Jira site
forge install list        # confirm no development installation remains
```

Then stop the Codespace from the GitHub UI (**Codespaces → Stop current codespace**) so it stops counting against your free hours.

## Where to go next

- **[Forge Guru](../forge-guru-agent/README.md)** — the companion workshop. The agent you built here *reads* a ticket and plans it; that one *writes* a ticket from an idea you brainstormed. Together they cover both ends of the loop.
- Browse the full **[Forge Inspired](../README.md)** collection for more small, remixable Forge apps.

## License

Apache 2.0 · [LICENSE](../LICENSE) · Contributions welcome — see [CONTRIBUTING.md](../CONTRIBUTING.md).
