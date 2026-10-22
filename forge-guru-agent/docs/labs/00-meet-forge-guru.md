# Lab 0 · Meet Forge Guru

## What you're building

Nothing *yet*. In this lab you install Forge Guru — a conversational Rovo agent — onto your dev site using your coding assistant, then prove it answers back in Rovo Chat. Later labs will teach the agent new tricks.

## Ideas you need

- **Forge Guru is a Rovo agent, not an app with a UI.** Its entire behavior is defined by the `prompt:` block in `manifest.yml` and (later) by any `action` modules you wire up.
- **Zero scopes.** The stock agent has no OAuth scopes — it never reads or writes product data. That's why Lab 0 install is low-friction.
- **Your coding assistant can do the whole install.** You'll paste a short prompt into Cursor, Claude Code, Codex, GitHub Copilot CLI, Gemini CLI, or whichever assistant you've set up in your Codespace, and let it run `git clone → npm install → forge register → forge deploy → forge install` for you.

## You should be here

- You finished **[Setup](../SETUP.md)**: Codespace open, `forge whoami` works, you have your Jira Cloud site URL handy.
- You have **not** cloned `forge-inspired` yet — your coding assistant will do that for you in Step 1.

## Step 1 — install Forge Guru via your coding assistant

> **Before you paste anything:** make sure you have a **fresh** Jira Cloud site provisioned for this workshop. If you skipped that in Setup, run it now:
>
> ```bash
> forge site provision
> ```
>
> …and keep the resulting `https://<name>.atlassian.net` URL handy — the install prompt will ask you to pick it. Fresh sites are strongly preferred: they're empty, they already have Rovo enabled, and they have nothing pre-installed to collide with Forge Guru.

Open your coding assistant inside the Codespace — Cursor, Claude Code, Codex, GitHub Copilot CLI, Gemini CLI, or whichever one you prefer. Paste the prompt below and let it drive.

> **Why hand it off?** The Codespace already has Node, the Forge CLI, and the Forge AI Plugin preinstalled. The install flow is deterministic — clone, `npm install`, `forge register`, `forge deploy`, `forge install`. Letting your assistant run it means fewer typos, and it gives you a feel for what "my agent did the plumbing for me" looks like before you start editing agents yourself.

```text
Please install the Forge Guru Rovo agent for me from this Codespace.

I'm in the community Forge Codespace, which has Node, the Forge CLI and
the Forge AI Plugin preinstalled, and I've already run `forge login`.
The agent's source lives in a different GitHub repo that I need to
clone first.

Please do the following in order, running each command in the terminal
and stopping if any step fails:

1. Clone the repo: `git clone https://github.com/atlassian-labs/forge-inspired.git`
   (skip if the directory already exists).
2. `cd` into `forge-inspired/forge-guru-agent`.
3. Run `npm install`.
4. Run `forge register` so a fresh app id is written into `manifest.yml`
   (skip if the manifest already contains a non-placeholder app id).
5. Run `forge deploy` to the default (development) environment.
6. Run `forge install` and pick my Jira Cloud site when prompted. If
   it asks me to choose a product, choose Jira.

When you're done, tell me the app id, which site it was installed on,
and how to open Forge Guru in Rovo Chat.
```

Your assistant will walk through those six commands. Confirm each one when it asks.

## Step 2 — prove it answers

1. Open your Jira Cloud site in a browser.
2. Open **Rovo Chat** (the chat icon in the top-right).
3. In the agent picker, choose **Forge Guru**.
4. Click one of the built-in conversation starters — e.g. *"What's the difference between UI Kit and Custom UI?"* — or type your own Forge question.

## Already written

- `manifest.yml` — the baseline Rovo agent definition with its prompt and 5 conversation starters.
- `src/index.js` — a placeholder function Forge requires on every app. You will not touch it in Labs 0 or 1.

Do not edit either file in this lab.

## Proof checklist

- [ ] `forge install list` includes Forge Guru on your Jira Cloud site.
- [ ] Forge Guru appears in Rovo Chat's agent picker on that site.
- [ ] Forge Guru replies with a plausible, Forge-specific answer to a starter prompt.

## You own this now

Everything the agent *is* lives in the `prompt:` block of `manifest.yml`. In Lab 1 you'll edit that block for the first time — and the agent's behavior will change because *you* changed it.

→ **[Lab 1 · Ideation mode](01-ideation-mode.md)**
