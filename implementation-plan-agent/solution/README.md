# Implementation Plan Agent — solution

This folder is the **reference state after [Lab 2](../docs/labs/02-customize-your-agent.md) is complete**: baseline agent plus the **Testing checklist** customization applied to step 4 of the agent prompt.

If you picked **Security review** or **Relevant Forge documentation** instead of Testing checklist in Lab 2, the matching snippet lives in **[`../docs/labs/snippets/`](../docs/labs/snippets/)**.

## How to overlay this onto your starter

If your Lab 2 edit won't lint or deploy and you need a known-good state:

1. **Do NOT replace `starter/manifest.yml` wholesale.** Your starter manifest holds your personal `app.id` from Lab 0. Copy *only* the `prompt:` block from `solution/manifest.yml` into your starter manifest, preserving your own `app.id`.
2. From `starter/`, run `forge lint` to confirm the merge is valid.
3. Run `forge deploy`. No `install --upgrade` needed (no scope changes).

The `src/` and `package.json` files in this folder are identical to the starter. You never need to copy them over.
