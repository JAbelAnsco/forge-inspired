// Entry point for the Forge Guru Rovo agent.
//
// Forge Guru is a *conversational-only* agent — it has no `action` modules
// wired up in `manifest.yml`, so it never reads or writes product data.
// Rovo invokes the agent's conversation handler automatically from its
// `rovo:agent` module definition; no custom function is needed for that.
//
// However, every Forge app must declare at least one `function` in the
// manifest, so we export a tiny placeholder below. If you later extend
// Forge Guru with an action (for example, "look up the manifest reference
// page for a given module"), add the handler alongside this one and wire
// it into `manifest.yml` under `modules.action` + `modules.function`.

export const placeholder = async (payload, context) => {
  // Intentionally unused. See the note above.
  // We log the invocation so that, if someone wires a module to this
  // handler by mistake, it's easy to spot in `forge logs`.
  console.log('Forge Guru placeholder function invoked', {
    payload,
    principalType: context?.principal?.accountType,
  });
  return { ok: true, note: 'Forge Guru placeholder — see src/index.js.' };
};
