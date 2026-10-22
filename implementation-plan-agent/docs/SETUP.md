# Setup — Implementation Plan Agent workshop

The whole workshop runs inside the community **[Forge Codespace](https://github.com/ccurti-dx/forge-codespace/tree/main)**. Node, the Forge CLI, the Forge AI Plugin, and the Forge MCP Server are already installed in there. You do not install anything on your laptop.

Do these four things, in order, before Lab 0.

## 1. Open the Forge Codespace

1. Open **https://github.com/ccurti-dx/forge-codespace** in your browser.
2. Click **Code → Codespaces → Create codespace on main**.
3. Wait for the Codespace to finish building (~1 minute). You'll land in VS Code in the browser with a terminal open at the bottom.

> **Why Codespaces?** It gives everyone in the room the same, known-good environment in a single click. Local Node / CLI / plugin installs are the #1 cause of workshop derailments — Codespaces skips all of that.

## 2. Log in to Forge

Get an Atlassian API token from **https://id.atlassian.com/manage-profile/security/api-tokens** (click **Create API token**, copy it to your clipboard).

In the Codespace terminal:

```bash
forge login
```

Paste your email and the API token when prompted. Then confirm:

```bash
forge whoami
```

You should see your Atlassian account email.

## 3. Have a Jira Cloud site you're an admin on

Any Atlassian Cloud site with a Jira project you can create issues in will work. If you don't have one, provision a free one right now:

```bash
forge site provision
```

Keep the resulting site URL handy — you'll install the agent onto it in Lab 0 and create a work item on it in Lab 1.

> **Rovo is required.** The Implementation Plan Agent is a Rovo agent, so the site needs Rovo enabled. Freshly-provisioned Cloud sites already have Rovo on by default.

## 4. Clone this repo into the Codespace

In the Codespace terminal:

```bash
git clone https://github.com/atlassian-labs/forge-inspired.git
cd forge-inspired/implementation-plan-agent
```

You're now in the Implementation Plan Agent app directory, ready for **[Lab 0 · Install the agent](labs/00-install-the-agent.md)**.

## Troubleshooting

- **`forge: command not found`** — you're not in the Codespace. Everything in this workshop runs inside the Codespace terminal.
- **`forge login` fails with 401** — API token wrong, expired, or has an extra space. Create a new one and retry.
- **`forge site provision` fails** — you may already be at the free-site limit. Reuse an existing dev site or delete an old one at https://admin.atlassian.com.

More help: **[docs/reference/TROUBLESHOOTING.md](reference/TROUBLESHOOTING.md)**.
