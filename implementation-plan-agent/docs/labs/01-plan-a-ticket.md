# Lab 1 · Turn requirements into an implementation plan

## What you're building

In this lab you take an idea you want built, hand it to the agent, and watch it draft a real implementation plan right into the Jira ticket. No code, no manifest edits, just you and your agent working on a real problem together.

The plan it writes becomes your Lab 1 baseline. In Lab 2 you'll teach the agent to write *better* ones, and you'll compare side by side.

## Ideas you need

- **The quality of what the agent writes is bounded by the quality of what you give it to read.** A one-line summary gets a one-line-worth plan. A short description with explicit "out of scope" and "nice-to-haves" sections gives the agent material to actually structure a plan from.
- The agent reads the issue's **summary, description, type, status, priority, assignee, reporter, and labels**, nothing else. Anything you want it to weigh belongs in those fields.
- The stock plan has four sections: **Context / Proposed approach / Implementation steps / Risks & open questions**. In Lab 2 you'll teach it to add a fifth.

## You should be here

- Lab 0 proof checklist is green. Agent installed, responds to invocations.

> **Note:** your fresh Jira site from Lab 0 almost certainly doesn't have any projects yet. That's fine. Step 1 below walks you through creating one before you create the work item for the agent to plan.

## Step 1 — create a Jira project (if you don't already have one)

The agent plans *existing* Jira work items, so you need a project to create one in. If you already have a project on your site, skip to Step 2.

1. Open your Jira Cloud site in a browser.
2. Click **Projects → Create project** in the top nav.
3. Pick any template. **Scrum** or **Kanban** under Software Development is a safe default.
4. Name the project something short (e.g. `Implementation Lab`). Jira will suggest a **project key** (e.g. `IL`, `IMPL`, `LAB`). Remember it. You'll create a work item inside this project in a moment.
5. Finish the wizard. You should land on an empty board.

## Step 2 — create a work item

You have two options:

### Option A — use the starter requirement

If you don't have a feature idea of your own ready to go, open **[snippets/01-starter-requirement.md](snippets/01-starter-requirement.md)** and copy the summary and description into a new Jira ticket. The starter is intentionally small and ambiguous enough that the agent's "Risks & open questions" section has something to say.

### Option B — write your own

Create a new Jira ticket for a Forge app (or any other feature) you'd actually like to build. For the agent to produce something useful, give it:

- A clear **summary**.
- A **description** with at least:
  - What you want built, in your own words.
  - An **Out of scope** section (what the agent should *not* plan for).
  - Optionally, a **Nice-to-haves** section.

Save the ticket. Note its issue key (e.g. `PROJ-42`).

## Step 3 — ask the agent to plan it

1. Open the ticket in Jira.
2. Open the **Agents** panel.
3. Choose **Implementation Plan Agent**.
4. Type: `Plan this ticket for me.` (The agent will pick up the issue key from context. If it asks for one anyway, give it the key.)
5. Wait for the agent's chat reply ("Done, refresh the page to see the comment.").
6. Refresh. Read the new comment on the ticket.

## Already written

The agent prompt and both actions. Do not change them in this lab. You want the stock baseline so you have something concrete to measure your Lab 2 customization against.

## Proof checklist

- [ ] Exactly **one** new comment on the ticket, posted by the agent.
- [ ] The comment has all four sections: **Context**, **Proposed approach**, **Implementation steps**, **Risks & open questions**.
- [ ] *Context* paraphrases your description in 1-3 sentences. It does not copy the description verbatim.
- [ ] *Implementation steps* is an ordered list of concrete steps, not a prose paragraph.
- [ ] *Risks & open questions* names at least one thing your description didn't answer.

## Read the plan critically — this matters for Lab 2

Before moving on, re-read the plan with these questions in mind:

- Does it mention **testing**? Where, and in what detail?
- Does it name any **Forge module** or **scope** by name?
- Does it reference any **Atlassian documentation**?
- Does it think about **security** at all?

Most stock plans are strongest on *approach* and *steps*, and thinnest on *testing*, *security*, and *grounding links*. That's exactly the gap Lab 2 asks you to close.

## What you just learned

The agent is only as sharp as the prompt behind it. In Lab 2 you'll edit that prompt to make every future plan include one of these missing lenses by default, and you'll run Lab 1 again to see the difference.

→ **[Lab 2 · Customize your planning agent](02-customize-your-agent.md)**
