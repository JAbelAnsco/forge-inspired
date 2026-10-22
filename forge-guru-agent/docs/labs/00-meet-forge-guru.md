# Lab 0 · Meet Forge Guru

## What you're building

Nothing *yet*. In this lab you install Forge Guru — a conversational Rovo agent — onto your dev site using your coding assistant, then prove it answers back in Rovo Chat. Later labs will teach the agent new tricks.

## Ideas you need

- **Forge Guru is a Rovo agent, not an app with a UI.** Its entire behavior is defined by the `prompt:` block in `manifest.yml` and (later) by any `action` modules you wire up.
- **Zero scopes.** The stock agent has no OAuth scopes — it never reads or writes product data. That's why Lab 0 install is low-friction.
- **Your coding assistant can do the deploy.** You'll paste a short prompt into Rovo Dev / Cursor / Copilot / Codex / Gemini CLI (whichever is set up in your Codespace) and let it run `npm install → forge register → forge deploy → forge install` for you.

## You should be here

- You finished **[Setup](../SETUP.md)**: Codespace open, `forge whoami` works, you know your Jira Cloud site URL, and you've cloned the repo and `cd`'d into `forge-inspired/forge-guru-agent/`.

## Step 1 — install Forge Guru via your coding assistant

Open the AI chat panel in your Codespace. Paste this prompt and run it:

```text
Please install Forge Guru for me from the Codespace I'm in.

I'm already sitting in `forge-inspired/forge-guru-agent/`. Please do the
following in order, running each command in the terminal and stopping if
any step fails:

1. Run `npm install`.
2. Run `forge register` so a fresh app id is written into `manifest.yml`
   (skip if the manifest already has a non-placeholder app id).
3. Run `forge deploy` to the default (development) environment.
4. Run `forge install` and pick my Jira Cloud site when prompted.

When you're done, tell me the app id, which site it was installed on,
and how to open Forge Guru in Rovo Chat.
```

The assistant will walk through those four commands. If `forge install` asks you to choose a product, choose **Jira**.

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
