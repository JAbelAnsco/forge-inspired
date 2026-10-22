# Command reference — Implementation Plan Agent

Cheatsheet of every command used across the workshop. Run them all in the Codespace terminal from the `forge-inspired/implementation-plan-agent/` directory, unless noted.

## One-time, in Setup

```bash
forge login           # paste email + API token
forge whoami          # confirm you're logged in
```

## Lab 0 — deploy & install

The Lab 0 agent-prompt flow does all of these for you. If you want to run them by hand:

```bash
npm install
forge register        # writes your personal app id into manifest.yml
forge deploy
forge install         # pick your Jira Cloud site
```

## Lab 1 — nothing to run

Lab 1 is a behavior lab — you create a Jira work item and ask the agent to plan it. No `forge` commands are needed.

## Lab 2 — prompt-only edit, no scope change

```bash
forge deploy          # redeploys the updated prompt; no reinstall needed
```

## Debugging

```bash
forge logs --since 15m    # tail logs from the last 15 min
forge logs -n 200         # last 200 lines
forge lint                # catch manifest.yml problems before deploy
```

## After the workshop

```bash
forge uninstall           # remove the app from your Jira site
forge install list        # confirm the development install is gone
```

> **Codespace tip:** stop the Codespace when you're done (**Codespaces → Stop current codespace** in the browser) so it stops counting against your free hours.
