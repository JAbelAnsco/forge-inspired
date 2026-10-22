# Troubleshooting — Forge Guru

## The agent doesn't appear in Rovo Chat

1. Confirm `forge install list` shows the app on your target site.
2. Confirm the site is actually a Rovo-enabled Cloud site (freshly-provisioned ones are).
3. Try hard-refreshing the browser tab where Rovo Chat is open.

## Replies feel generic / not Forge-specific

The `prompt:` block in `manifest.yml` is the single biggest lever. Tighten or extend it, run `forge deploy`, and try again. No reinstall needed as long as scopes haven't changed.

## `forge lint` complains about the manifest

Forge manifests are strict YAML. Common causes:

- **Indentation.** Every nested key is 2 spaces. Tabs will break it.
- **A `function` key referenced from a module doesn't exist** under `modules.function`.
- **A scope you added doesn't exist** or is misspelled (check https://developer.atlassian.com/platform/forge/manifest-reference/permissions/).

## Scope errors after Lab 2

If Rovo Chat says *"your app does not have permission to do that"*, you probably added a scope but didn't reinstall:

```bash
forge install --upgrade
```

Scope changes always need `install --upgrade`, not just `deploy`.

## `forge deploy` succeeds but the agent still behaves like the old prompt

- Forge agent prompts are cached briefly. Give it ~30 seconds and try again.
- Confirm you deployed to the environment the install points at (default is `development`).

## I think I broke my local files

- Diff your file against the snippet files under [docs/labs/snippets/](../labs/snippets/) that the lab had you paste from.
- `git diff` from the repo root will show you exactly what you've changed since you cloned.
- Worst-case recovery: `git stash` your local edits, then re-run the lab from the snippet file.

**Heads up: don't replace your `manifest.yml` wholesale.** Your local manifest contains your own `app.id` (written there by `forge register` in Lab 0). If you overwrite it with somebody else's `manifest.yml`, your deploys will go to the wrong app id. Edit in place.

## My logs are empty

```bash
forge logs --since 1h
```

If still empty, you're probably tailing the wrong environment:

```bash
forge logs --since 1h -e development
```
