# Forge Guru — Build Your First Forge Agent

[![Atlassian license](https://img.shields.io/badge/license-Apache%202.0-blue.svg?style=flat-square)](../LICENSE) [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](../CONTRIBUTING.md)

> Part of the [**Forge Inspired**](../README.md) collection.

**Deploy a Rovo agent — then make it yours.** Forge Guru is a Forge-specialist Rovo agent that answers Forge questions in Rovo Chat. In this workshop you'll install it, then teach it two new tricks: pitching Forge app *ideas* on demand, and **actually filing a Jira ticket** for an idea you picked. Three short labs, no local installs, everything runs in a GitHub Codespace.

## Start here

| When | Open this |
|---|---|
| **Before the workshop** | **[Set up your Codespace and Jira site](docs/SETUP.md)** |
| **When the workshop begins** | **[Lab 0 · Meet Forge Guru](docs/labs/00-meet-forge-guru.md)** |
| **When you need a later lab** | Jump to the [workshop labs](#workshop-labs) below |
| **When you are stuck** | See the [if you get stuck](#if-you-get-stuck) section below |

## Workshop labs

Follow these in order.

| Lab | You build | You are done when |
|---|---|---|
| **[0 · Meet Forge Guru](docs/labs/00-meet-forge-guru.md)** | Stock agent deployed and installed via your coding assistant | Forge Guru replies in Rovo Chat on your dev site |
| **[1 · Ideation mode](docs/labs/01-ideation-mode.md)** | A `## Ideation mode` section added to the agent prompt | Guru pitches 3 structured Forge app ideas on demand |
| **[2 · Write a ticket](docs/labs/02-write-a-ticket.md)** | A real `create-ticket` action + `write:jira-work` scope | Guru files a Jira ticket for an idea and replies with the link |

**Main takeaway:** learn to **build and extend** a Forge app — the prompt, the manifest, and the actions are all levers you control.

## How to use a lab

Every lab file follows the same shape:

- **What you're building** gives you the destination.
- **Ideas you need** explains the decisions behind the design.
- **You should be here** shows the exact state expected before you start.
- **File:** tells you exactly where a snippet belongs.
- **Already written** means inspect the helper; do not rebuild it.
- **Proof checklist** tells you when it is safe to continue.

Snippets live under **[docs/labs/snippets/](docs/labs/snippets/)**. Each snippet is paste-ready — don't retype them, copy them.

## If you get stuck

1. Re-read the **Proof checklist** at the bottom of the lab you're on — most issues are a missed step.
2. Run `forge lint` from the app directory — it will point at a malformed `manifest.yml`.
3. Tail the logs with `forge logs --since 15m` — any runtime failure in an action handler will land there.
4. Check [docs/reference/TROUBLESHOOTING.md](docs/reference/TROUBLESHOOTING.md) for the most common issues.
5. If you're in a live workshop, flag your instructor. Otherwise, [open an issue](https://github.com/atlassian-labs/forge-inspired/issues/new).

> **Heads up on `manifest.yml`.** Lab 0 writes *your* personal app id into your local `manifest.yml`. If you ever paste in a `manifest.yml` from somewhere else (another attendee's copy, a snippet file, an old backup), you'll lose your `app.id` and your deploys will go to someone else's app. Edit the file in place — don't replace it wholesale.

## Under the hood (reference)

- **Modules:** [`rovo:agent`](https://developer.atlassian.com/platform/forge/manifest-reference/modules/rovo-agent/) + [`function`](https://developer.atlassian.com/platform/forge/manifest-reference/modules/function/). Lab 2 adds [`action`](https://developer.atlassian.com/platform/forge/manifest-reference/modules/action/).
- **Scopes:** none in Labs 0 and 1. Lab 2 adds `write:jira-work`.
- **Grounding:** Rovo's built-in access to the organization's knowledge base and the public Forge documentation.
- **App layout:** this workshop contains **two self-contained Forge apps as subfolders**. [`starter/`](./starter/) is the baseline chat-only Forge Guru that attendees deploy in Lab 0 and build on across Lab 1 and Lab 2. [`solution/`](./solution/) is the fully-built reference app with both labs applied — browse it to compare against your end state, or deploy it as its own agent on your site. See [`solution/README.md`](./solution/README.md) for the when-and-how of using it.
- **Entry points inside `starter/`:** [`manifest.yml`](./starter/manifest.yml) (the agent definition) and [`src/index.js`](./starter/src/index.js) (the Forge function handlers).
- **Full command cheatsheet:** [docs/reference/COMMANDS.md](docs/reference/COMMANDS.md).
- **Common issues:** [docs/reference/TROUBLESHOOTING.md](docs/reference/TROUBLESHOOTING.md).

## After the workshop

```bash
forge uninstall             # remove the development install
forge install list          # confirm no development installation remains
```

Then stop the Codespace from the GitHub UI (**Codespaces → Stop current codespace**) so it stops counting against your free hours.

## Where to go next

- **[Implementation Plan Agent](../implementation-plan-agent/README.md)** — the companion workshop. The agent you built here *writes* tickets; that one *reads* a ticket and drafts an implementation plan.
- Browse the full **[Forge Inspired](../README.md)** collection for more small, remixable Forge apps.

## License

Apache 2.0 · [LICENSE](../LICENSE) · Contributions welcome — see [CONTRIBUTING.md](../CONTRIBUTING.md).
