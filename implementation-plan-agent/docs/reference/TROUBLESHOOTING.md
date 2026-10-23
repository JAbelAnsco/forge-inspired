# Troubleshooting — Implementation Plan Agent

## The agent doesn't appear in the Jira Agents panel

1. Confirm `forge install list` shows the app on your Jira site.
2. Confirm the site is a Rovo-enabled Cloud site.
3. Try hard-refreshing the Jira issue page.

## The agent posts two comments instead of one

The Jira Agents panel can auto-draft a second comment from the agent's chat reply. The stock agent's prompt tells it to keep its chat reply to one plain line *specifically* to avoid this. If you've edited the prompt and started seeing duplicates, check that your edits haven't turned the chat reply into a Markdown summary of the plan.

## The agent's plan ignores my customization from Lab 2

- **Did you `forge deploy` after editing?** Prompt edits don't take effect until deploy.
- **Prompt cache.** Give it ~30 seconds after deploy, then try again.
- **Section placement matters.** Lab 2 says to add your customization *inside* the "Draft an implementation plan" step. If you put it outside the WHEN-A-USER-ASKS block, the agent may not apply it.

## `forge lint` complains about the manifest

- **Indentation.** Every nested key is 2 spaces. Tabs will break YAML.
- **A `function` key referenced from an `action` doesn't exist** under `modules.function`.
- Compare against the `main` branch's `starter/manifest.yml` — the structure of `actions:` / `action:` / `function:` is easy to break.

## The plan comment isn't appearing on the issue

1. `forge logs --since 10m` — the `postImplementationPlan` handler will log any error.
2. Confirm you're an admin or have **Add comments** permission on the project.
3. Confirm the issue key the agent used actually exists (check for typos in the issue key you gave it).

## I think I broke my local files

- Diff your file against the snippet files under [docs/labs/snippets/](../labs/snippets/) that the lab had you paste from.
- `git diff` from the repo root will show you exactly what you've changed since you cloned.
- Worst-case recovery: `git stash` your local edits, then re-run the lab from the snippet file.

**Heads up: don't replace your `manifest.yml` wholesale.** Your local manifest contains your own `app.id` (written there by `forge register` in Lab 0). If you overwrite it with somebody else's `manifest.yml`, your deploys will go to the wrong app id. Edit in place.

## My logs are empty

```bash
forge logs --since 1h
```

Still empty? Check the environment:

```bash
forge logs --since 1h -e development
```
