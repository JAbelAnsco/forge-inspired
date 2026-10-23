# Implementation Plan Agent — starter

This folder is the **baseline Implementation Plan Agent** that attendees deploy in **[Lab 0](../docs/labs/00-install-the-agent.md)**. It's the full agent with its two actions (`inspect-issue`, `post-implementation-plan`) and three scopes (`read:jira-work`, `read:jira-user`, `write:jira-work`), ready to install onto a Jira site.

**Build on this folder across the workshop.** Lab 1 doesn't change any files (it's a behavior lab). Lab 2 asks you to add a new section bullet to the agent `prompt:` block inside `manifest.yml`.

If your edits go sideways, overlay the finished state from **[`../solution/`](../solution/)**. See **[`../solution/README.md`](../solution/README.md)** for how to overlay without clobbering your personal `app.id`.
