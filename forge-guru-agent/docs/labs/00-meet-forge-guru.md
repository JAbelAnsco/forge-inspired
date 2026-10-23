# Lab 0 · Meet Forge Guru

## What you're building

In this lab you install Forge Guru, a conversational Rovo agent, onto your Jira site using your AI coding assistant. Then you prove it answers back in Rovo Chat. Later labs will teach the agent new tricks.

## Ideas you need

- **Forge Guru is a Rovo agent, not an app with a UI.** Its entire behavior is defined by the `prompt:` block in `manifest.yml`, and (in Lab 2) by any `action` modules you wire up.
- **Zero scopes.** The starter agent has no OAuth scopes and never reads or writes product data. That's why Lab 0 is low-friction.
- **Your coding assistant can do the whole install.** You'll paste a short prompt into Cursor, Claude Code, GitHub Copilot CLI, Gemini CLI, or whichever assistant you have set up, and let it run `git clone`, `npm install`, `forge register`, `forge deploy`, and `forge install` for you.

## You should be here

- You finished **[Setup](../SETUP.md)**: your Codespace is open, `forge whoami` works, and you have a Jira Cloud site URL ready.
- You have **not** cloned `forge-inspired` yet. Your coding assistant will do that in Step 1.

## Step 1 — Provision a fresh Jira Cloud site

If you skipped Setup Step 3, run this in your Codespace terminal:

```bash
forge site provision
```

Follow the prompts and pick a short, memorable name. You'll end up with a site URL like `https://your-name.atlassian.net`. **Copy that URL.** You'll paste it into the install prompt in the next step.

> **Why fresh?** The site is empty, has Rovo enabled by default, and has nothing pre-installed to collide with Forge Guru.

## Step 2 — Install Forge Guru via your coding assistant

Open your AI coding assistant inside the Codespace. Replace `<YOUR_SITE_URL>` in the prompt below with the site URL you just copied, then paste the whole thing.

> **Why hand it off?** The Codespace already has Node, the Forge CLI, and the Forge AI Plugin preinstalled. The install flow is deterministic (clone, install, register, deploy, install), so letting your assistant run it means fewer typos and gives you a feel for what "my agent did the plumbing for me" looks like before you start editing agents yourself.

```text
**What this prompt does:** clones the Forge Guru repo, installs its deps,
registers a new app id, deploys it to Forge, and installs it onto my
Jira site. Uses the Forge MCP server to validate manifest shape and
diagnose any errors along the way.

Install the Forge Guru Rovo agent for me from this Codespace.

I'm in the community Forge Codespace, which has Node, the Forge CLI,
and the Forge AI Plugin preinstalled, and I've already run `forge login`.
The agent's source lives in another GitHub repo you'll need to clone.
You have Forge MCP tools available — use them as noted below.

The site to install onto is: <YOUR_SITE_URL>

If any Forge CLI command shows an interactive prompt, answer on my
behalf as follows (do not stop to ask me):
  - Developer Terms of Use: accept.
  - Analytics / anonymous usage data: opt in (I can turn it off later).
  - Developer console space picker: pick the default.

Run these commands in order, and stop only if a command returns an
actual error:

1. Clone the repo: `git clone https://github.com/atlassian-labs/forge-inspired.git`
   (skip if the directory already exists).
2. `cd` into `forge-inspired/forge-guru-agent/starter`. This is the baseline
   app you'll build on across the workshop. Do not `cd` into the sibling
   `solution/` folder; that's a reference you only use if you get stuck.
3. Run `npm install`.
4. Run `forge register` so a fresh app id is written into `manifest.yml`
   (skip if the manifest already contains a non-placeholder app id). If
   it asks you to pick a developer console space, pick the default.
5. Run `forge deploy` to the default (development) environment.
6. Run `forge install` and install the app to the site URL above. If it
   asks you to pick a product, choose Jira.

If any `forge deploy` or `forge install` step fails, use the Forge MCP
`diagnose-forge-error` tool with the error output to find the fix,
then retry. Do not guess — the MCP has the authoritative Forge docs.

When you're done, confirm which site it was installed
on, and tell me how to open Forge Guru in Rovo Chat.
```

Your assistant will walk through those six commands. Confirm each one when it asks.

## Step 3 — Prove it answers

1. Open your Jira Cloud site in a browser.
2. Open **Rovo Chat** (the chat icon in the top-right).
3. In the agent picker, choose **Forge Guru**.
4. Click one of the built-in conversation starters, or type your own Forge question.

## Already written

- `manifest.yml` — the baseline Rovo agent definition, with its prompt and conversation starters.
- `src/index.js` — a placeholder function Forge requires on every app.

Do not edit either file in this lab.

## Proof checklist

- [ ] `forge install list` includes Forge Guru on your Jira Cloud site.
- [ ] Forge Guru appears in Rovo Chat's agent picker on that site.
- [ ] Forge Guru replies with a plausible, Forge-specific answer.

## You own this now

Everything the agent *is* lives in the `prompt:` block of `manifest.yml`. In Lab 1 you'll edit that block for the first time, and the agent's behavior will change because *you* changed it.

→ **[Lab 1 · Ideation mode](01-ideation-mode.md)**
