# Lab 1 starter requirement — paste this into a new Jira work item

Use this if you don't already have a feature idea of your own. It's deliberately small, realistic, and has enough ambiguity for the agent's "Risks & open questions" section to actually find something to say.

---

**Issue type:** Story
**Project:** (any project you have create-issue permission on)
**Summary:**

```
Add a "Last 5 contributors" byline to Confluence pages
```

**Description:**

```
We want a small Forge app that renders a byline near the top of every
Confluence page, listing the last 5 people who edited the page. Each
contributor should show their avatar and display name, and clicking a
contributor should open their Atlassian profile in a new tab.

Only show the byline on pages with 2 or more distinct contributors.
Pages with a single contributor already show enough information in
their default "Owned by" metadata.

Out of scope for v1:
- An admin UI to toggle the byline on and off per space.
- Showing anonymous edits.
- Any kind of filtering by date range.

Nice-to-haves to consider but not commit to:
- Caching the contributor list so we don't hit the version history API
  on every page render.
- Deduping edits made by the same person within a short window.
```

---

Save the ticket. Note down its issue key (e.g. `PROJ-42`). You'll give that key to the Implementation Plan Agent in Lab 1.
