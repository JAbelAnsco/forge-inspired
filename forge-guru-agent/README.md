# Forge Guru

[![Atlassian license](https://img.shields.io/badge/license-Apache%202.0-blue.svg?style=flat-square)](../LICENSE) [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](../CONTRIBUTING.md)

> Part of the [**Forge Inspired**](../README.md) collection.

**A Rovo agent that answers your Atlassian Forge questions.** Think of Forge Guru as a Forge-specialist teammate who lives in Rovo Chat — ask it about the manifest, modules, scopes, UI Kit, storage, the Forge CLI, deployment, anything — and get grounded, concrete answers without leaving the product.

Forge Guru is **conversational only** — it has no actions and no scopes, so it installs with zero friction and never touches product data.

## Prerequisites — get your machine ready

You need three things before you can deploy this app:

### 1. Node.js and the Forge CLI

- Install **Node.js LTS** (v20 or newer). The Forge runtime is Node 24, but the CLI itself runs on any modern LTS.
- Install the Forge CLI globally:
  ```bash
  npm install -g @forge/cli
  ```
- Verify it's on your PATH:
  ```bash
  forge --version
  ```

### 2. An Atlassian account and API token

- Log in to Forge with an API token from https://id.atlassian.com/manage-profile/security/api-tokens:
  ```bash
  forge login
  ```
- Confirm you're logged in:
  ```bash
  forge whoami
  ```

### 3. A Jira (or Confluence) Cloud site

- Any Atlassian Cloud site you're an admin on will work. If you don't have one, provision one with:
  ```bash
  forge site provision
  ```

### (Optional) Skip local setup with the Forge Codespace

Prefer not to install Node and the Forge CLI on your laptop? Use the community **[Forge Codespace](https://github.com/ccurti-dx/forge-codespace/tree/main)** — a preconfigured GitHub Codespace with Node and the Forge CLI already set up. Once you're in the Codespace, `git clone` this repo and `cd` into `forge-guru-agent/` to deploy.

## Deploy it

Each command is in its own code block so you can copy, paste, and hit **Enter** one at a time.

Clone the repo (first time only):

```bash
git clone https://github.com/atlassian-labs/forge-inspired.git
```

Change into the app directory:

```bash
cd forge-inspired/forge-guru-agent
```

Install dependencies:

```bash
npm install
```

Register the app under your Atlassian account (first time only — this writes your own app id into `manifest.yml`):

```bash
forge register
```

Deploy the app:

```bash
forge deploy
```

Install it on your Atlassian Cloud site (you'll be prompted to pick the site and product):

```bash
forge install
```

## Try it

1. Open **Rovo Chat** on your site.
2. Pick **Forge Guru** from the agent list.
3. Try one of the built-in conversation starters, or ask your own Forge question:
   - *"What's the difference between UI Kit and Custom UI?"*
   - *"How do I add a scope to my Forge app?"*
   - *"Explain Forge triggers vs scheduled triggers."*
   - *"Show me a minimal `rovo:agent` manifest."*
   - *"Why does my app render blank when I use `<div>` in UI Kit?"*

## Under the hood

- **Modules:** [`rovo:agent`](https://developer.atlassian.com/platform/forge/manifest-reference/modules/rovo-agent/) + [`function`](https://developer.atlassian.com/platform/forge/manifest-reference/modules/function/) × 1 (a required but intentionally-unused placeholder — see [`src/index.js`](./src/index.js)).
- **Scopes:** **none**. Forge Guru does not call any product REST APIs.
- **Grounding:** Rovo's built-in access to the organization's knowledge base and the public Forge documentation. The agent prompt tells it to prefer linking to canonical docs over guessing.

### The interesting files

- **[`manifest.yml`](./manifest.yml)** — the agent definition. 90% of the "magic" lives in the `prompt:` block, which frames Forge Guru's domain, tone, and gotcha list.
- **[`src/index.js`](./src/index.js)** — the Forge function entry point. For Forge Guru this is just the placeholder handler Forge requires on every app.

## Extend it

A few natural next steps if you want to push Forge Guru further — try asking your AI coding agent (Rovo Dev, Cursor, Copilot, etc.) to add one:

- **Add a `search-forge-docs` action** that calls out to a docs search endpoint, so Forge Guru can retrieve a fresh snippet and quote it back with a link.
- **Add a `generate-starter-manifest` action** that takes a free-text description and returns a minimal `manifest.yml` for the closest template.
- **Pin a few repo-specific conventions** by editing the system prompt — if your team always uses `@forge/kvs`, mention that; if you have a shared helper package, tell Forge Guru about it.

After any manifest change, redeploy (`forge deploy`) and, if you changed scopes, run `forge install --upgrade`.

## Troubleshooting

- **Forge Guru doesn't show up in Rovo.** Confirm your site has Rovo enabled and that `forge install` succeeded on the site you're testing. Try `forge install list` to check.
- **Agent replies feel generic / not Forge-specific.** The system prompt in `manifest.yml` is the biggest lever — tighten or extend it, redeploy with `forge deploy`, and try again. (No `--upgrade` needed because scopes haven't changed.)
- **`forge lint` complains about the manifest.** Manifests are strict YAML. Check indentation and make sure every `function` key referenced from a module exists under `modules.function`.

## License

Apache 2.0 · [LICENSE](../LICENSE) · Contributions welcome — see [CONTRIBUTING.md](../CONTRIBUTING.md).
