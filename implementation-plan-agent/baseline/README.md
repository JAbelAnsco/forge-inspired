# Baseline — Implementation Plan Agent workshop

> This is your **starting point** for the [Implementation Plan Agent workshop](../README.md). It is the untouched output of `forge create -t rovo-agent-rovo` — a "Hello World" Rovo agent that logs a message to Forge logs and nothing else.
>
> During the workshop you'll evolve this app into the [`solution/`](../solution) version, which reads a Jira issue and posts an implementation plan back as a comment.

## What this agent currently does

- Exposes one Rovo agent (`baseline`) with one action (`hello-world-logger`).
- When you ask it to log a message, it writes that message to Forge logs via `console.log`.

That's it. It doesn't call any Atlassian REST APIs, doesn't need any scopes beyond the default, and doesn't touch Jira.

## Run it

Each command is in its own code block so you can copy, paste, and hit **Enter** one at a time.

Clone the repo (first time only):

```bash
git clone https://github.com/atlassian-labs/forge-inspired.git
```

Change into the baseline app directory:

```bash
cd forge-inspired/implementation-plan-agent/baseline
```

Install dependencies:

```bash
npm install
```

Register the app under your Atlassian account (first time only — this writes your app id into `manifest.yml`):

```bash
forge register
```

Deploy the app:

```bash
forge deploy
```

Install it on your Jira Cloud site (you'll be prompted to pick the site):

```bash
forge install
```

Then open Rovo Chat on your site, pick the **baseline** agent, and ask it to log a message. Tail the logs to confirm:

```bash
forge logs --since 15m
```

## Where to go next

Follow the workshop steps in the [top-level README](../README.md#the-workshop-flow) to grow this into the finished agent. If you get stuck, peek at [`../solution/`](../solution) for the reference implementation.
