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
| **When you are stuck** | Use the [browser checkpoint](#if-you-get-stuck) for your lab |

## Workshop labs

Follow these in order. Checkpoint branches let you compare completed work without blowing up your local repo.

| Lab | You build | You are done when | Browser checkpoint |
|---|---|---|---|
| **[0 · Meet Forge Guru](docs/labs/00-meet-forge-guru.md)** | Stock agent deployed and installed via your coding assistant | Forge Guru replies in Rovo Chat on your dev site | [`forge-guru/lab-00`](https://github.com/atlassian-labs/forge-inspired/tree/forge-guru/lab-00/forge-guru-agent) |
| **[1 · Ideation mode](docs/labs/01-ideation-mode.md)** | A `## Ideation mode` section added to the agent prompt | Guru pitches 3 structured Forge app ideas on demand | [`forge-guru/lab-01`](https://github.com/atlassian-labs/forge-inspired/tree/forge-guru/lab-01/forge-guru-agent) |
| **[2 · Write a ticket](docs/labs/02-write-a-ticket.md)** | A real `create-ticket` action + `write:jira-work` scope | Guru files a Jira ticket for an idea and replies with the link | [`forge-guru/lab-02`](https://github.com/atlassian-labs/forge-inspired/tree/forge-guru/lab-02/forge-guru-agent) |

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

1. Find your lab in the table above.
2. Open its **Browser checkpoint** link.
3. Navigate to the file named by the lab step you're on.
4. Compare it with your local file.
5. Copy only the named section — not the whole file.

> **Never copy a checkpoint's `manifest.yml` wholesale.** Lab 0 writes *your* personal app id into your local `manifest.yml`. Replacing it with the checkpoint's version gives you an app you don't own — the subsequent labs will deploy to the wrong app id. Copy only the section the lab is teaching.

The **[`forge-guru/finished`](https://github.com/atlassian-labs/forge-inspired/tree/forge-guru/finished/forge-guru-agent)** branch is the full answer key — all three labs applied.

## Under the hood (reference)

- **Modules:** [`rovo:agent`](https://developer.atlassian.com/platform/forge/manifest-reference/modules/rovo-agent/) + [`function`](https://developer.atlassian.com/platform/forge/manifest-reference/modules/function/). Lab 2 adds [`action`](https://developer.atlassian.com/platform/forge/manifest-reference/modules/action/).
- **Scopes:** none in Labs 0 and 1. Lab 2 adds `write:jira-work`.
- **Grounding:** Rovo's built-in access to the organization's knowledge base and the public Forge documentation.
- **Entry points:** [`manifest.yml`](./manifest.yml) (the agent definition) and [`src/index.js`](./src/index.js) (the Forge function handlers).
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
