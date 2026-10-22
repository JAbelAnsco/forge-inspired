# Command reference — Forge Guru

Cheatsheet of every command used across the workshop. Run them all in the Codespace terminal from the `forge-inspired/forge-guru-agent/` directory, unless noted.

## One-time, in Lab 0

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

## Lab 1 — prompt-only edit, no scope change

```bash
forge deploy          # redeploys code + manifest; no reinstall needed
```

## Lab 2 — code + manifest edit, scope change

```bash
forge deploy
forge install --upgrade   # re-accepts the new scope on your site
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
