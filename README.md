# Forge Inspired

[![Atlassian license](https://img.shields.io/badge/license-Apache%202.0-blue.svg?style=flat-square)](LICENSE) [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](CONTRIBUTING.md)

> A collection of small, open-source **Atlassian Forge reference apps** built for the
> **Get Inspired** section of the Forge Developer Journey. Clone, install, and remix.

> **Prefer a zero-install browser IDE?** Use the community **[Forge Codespace](https://github.com/ccurti-dx/forge-codespace/tree/main)** — a preconfigured GitHub Codespace with Node and the Forge CLI already set up. Once you're in the Codespace, `git clone` this repo and pick a demo to deploy.

**These apps demonstrate the Atlassian platform in action.** Each one solves a real developer pain point with a working, cloneable Forge app that spans real Atlassian products — not marketing artefacts.

## Start here

Before any demo in this repo will run, make sure your Forge setup is complete: **[Build and launch your Forge app → Choose your build path](https://developer.atlassian.com/platform/forge/build-and-launch/)**. That page covers installing the Forge CLI and provisioning a Cloud site.

### Install the Forge AI Plugin (recommended)

If you'll be using an AI coding agent (Cursor, Claude Code, Codex, GitHub Copilot CLI, Gemini CLI, etc.) to extend or remix these demos, also install the **[Forge AI Plugin](https://developer.atlassian.com/platform/forge/ai-development-toolkit/forge-ai-plugin/)**. It bundles the Forge developer skills *and* the Forge MCP Server so your agent builds on grounded, current Forge documentation instead of guessing.

Prefer **just the MCP server** without the skills? Follow [Set up the Forge MCP Server](https://developer.atlassian.com/platform/forge/ai-development-toolkit/forge-mcp/) instead.

**Already using the [Forge Codespace](https://github.com/ccurti-dx/forge-codespace/tree/main)?** The plugin and MCP server come preinstalled — skip this step. **Not using an AI coding agent?** The demos deploy fine with just the Forge CLI — skip this step too.

## What's in here

Each demo is a self-contained Forge app. Pick one, `cd` into it, and follow the per-app README.

| Demo | What it demonstrates | Modules |
|------|----------------------|---------|
| [`sprint-ready-agent/`](sprint-ready-agent/) | AI native to the platform — one `rovo:agent` gives you Rovo Chat *and* the Jira ticket Agents panel. Reads freely, writes only after you confirm. | `rovo:agent`, `action` |
| [`smart-workflow-followup/`](smart-workflow-followup/) | Reacting to real Jira events with a Forge `trigger` — no queues, no cron, no server. Per-project opt-in, editable templates, full audit trail. | `trigger`, `jira:globalPage` |
| [`team-pulse-board/`](team-pulse-board/) | Cross-product in a single Forge app — a Confluence macro that runs a live Jira JQL search from words in the page title. Surfaces the ticket↔page connection nobody types. | `confluence:macro`, `jira:globalPage` |
| [`implementation-plan-agent/`](implementation-plan-agent/) | A **Rovo agent that plans Jira tickets for you** — reads the issue, drafts a four-section implementation plan grounded in your organization's knowledge, and posts it back as a single comment. | `rovo:agent`, `action` |
| [`forge-guru-agent/`](forge-guru-agent/) | A **conversational Rovo agent that answers your Forge questions** — manifest, modules, scopes, UI Kit, CLI, storage, Rovo. Zero actions, zero scopes, installs on any site in seconds. | `rovo:agent` |

Each folder contains its own `README.md` with the concept, install instructions,
and an `AppRequirements.md` describing what the app does and why.

## Try any demo

Once your Forge setup is complete (see [Start here](#start-here)), every demo follows the same shape:

```bash
git clone https://github.com/atlassian-labs/forge-inspired.git
cd forge-inspired/<demo-folder>
npm install
forge register              # First time only — creates your own app ID
forge deploy
forge install
```

That's it. Open the linked product on your site and follow the per-app `README.md` for what to click.

## Repo layout

```
forge-inspired/
├── LICENSE                          # Apache 2.0, shared by every demo
├── CONTRIBUTING.md                  # shared
├── CODE_OF_CONDUCT.md               # shared
├── .gitignore                       # shared
├── README.md                        # this file
├── sprint-ready-agent/              # demo 1
├── smart-workflow-followup/         # demo 2
├── team-pulse-board/                # demo 3
├── implementation-plan-agent/       # demo 4
└── forge-guru-agent/                # demo 5
```

Each demo has its **own** `manifest.yml`, `package.json`, and `node_modules/` —
they are deployed and installed independently. Repo-level files (`LICENSE`,
`CONTRIBUTING.md`, etc.) live at the root and are shared.

## Contributions

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for
details. If you have an idea for a new demo, open an issue first so we can
sanity-check the concept before you invest time.

## License

Copyright (c) 2026 Atlassian US., Inc.
Apache 2.0 licensed, see [LICENSE](LICENSE) file.

<br/>

[![With love from Atlassian](https://raw.githubusercontent.com/atlassian-internal/oss-assets/master/banner-cheers.png)](https://www.atlassian.com)
