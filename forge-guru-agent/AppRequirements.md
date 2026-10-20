# Forge Guru — App Requirements

## Purpose

Give Forge developers an in-platform teammate they can ask Forge questions,
without having to context-switch to the public docs or ping a human on
Slack. Forge Guru answers questions about the Forge platform —
`manifest.yml`, modules, scopes, UI Kit, storage, the Forge CLI,
deployment, and Rovo — grounded in Rovo's access to organizational
knowledge and the public Forge documentation.

## User story

> As a developer building a Forge app, I want to ask a Rovo agent
> "how does X work in Forge?" and get a grounded, concrete answer with
> links to the right docs — without leaving Rovo Chat.

## In scope

- One `rovo:agent` module usable from Rovo Chat.
- A detailed system prompt that frames Forge Guru as a Forge-specific
  expert, instructs it to ground answers in current Forge reality, and
  flags common gotchas (deprecated `@forge/ui`, UI Kit's component-only
  rendering, `install --upgrade` after scope changes, etc.).
- A handful of conversation starters covering the most common Forge
  questions (UI Kit vs Custom UI, adding a scope, triggers vs
  scheduled triggers, data storage, minimal `rovo:agent` manifest).
- Zero actions and zero scopes — Forge Guru is purely conversational.

## Out of scope

- **Reading or writing product data.** Forge Guru does not call any
  Jira, Confluence, or Bitbucket REST APIs. If a user asks it to "do"
  something inside a product, it should explain the pattern instead
  of trying to execute it.
- **Code generation on behalf of the user.** Forge Guru explains and
  points at docs; it is not an in-IDE coding agent. For that, users
  should use their own AI coding agent (Rovo Dev, Cursor, Copilot, etc.)
  with the `forge-onboarding` skill.
- **Storage.** The app is stateless — every conversation is independent.

## Modules

- `rovo:agent` — the agent definition, prompt, and conversation starters.
- `function` × 1 — an intentionally-unused placeholder handler. Required
  because every Forge app manifest must declare at least one function
  even when no modules invoke one.

## Scopes

- **None.** Forge Guru does not call any product REST APIs.

## Success criteria

1. A developer can `forge deploy && forge install` the app on a clean
   dev environment in under 5 minutes.
2. Once installed, Forge Guru appears in Rovo Chat on the target site.
3. Asking Forge Guru a question like "What's the difference between
   UI Kit and Custom UI?" returns a Forge-specific, grounded answer
   (not generic cloud-dev advice).
4. Forge Guru never attempts to read or write product data — the
   installed app's effective permission surface is empty.

## Why no actions?

Forge Guru is the "ask it questions" companion to the `forge-onboarding`
skill — it's deliberately read-only and conversational so that it can
be installed with no scope approvals and no admin friction. If you want
an agent that can *do* things in a product (comment on an issue, create
a page, update a workflow), use one of the other `forge-inspired`
demos — e.g. [`implementation-plan-agent`](../implementation-plan-agent)
or [`sprint-ready-agent`](../sprint-ready-agent) — as a starting point.
