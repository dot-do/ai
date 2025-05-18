# TODO

The following tasks expand the simple examples and TypeScript interfaces shown in the root `README.md`.

## Definition of Done

- [ ] SDK documentation contains runnable examples and clear `types.ts` definitions.
- [ ] Each primitive and API has tests covering real interactions (no mocks).

## Types to Formalize

- [ ] `ai` object – proxy functions that map to language model calls.
- [ ] `db` object – minimal database wrapper used in the examples.
- [ ] `every` function – schedule recurring workflow execution.
- [ ] `on` function – handle one‑off events or webhooks.
- [ ] `AI` function – build strongly‑typed AI helpers from a schema object.
- [ ] `DB` function – define collections with typed CRUD helpers.

## Implementations & Tests

- [ ] Implement `ai` proxy object for generating arbitrary objects or text.
- [ ] Support tagged template literals: `await ai\`Summarize {topic}\``.
- [ ] Create a `list` helper to generate string arrays via numbered lists.
- [ ] Provide a `research` function that returns markdown with citations.
- [ ] Expand `AI()` to create functions that return typed objects or arrays.
- [ ] Allow `AI()` to define code generators using `ai` and `db` from the context.
- [ ] Implement `DB()` to register data models and generate CRUD operations.
- [ ] Extend `DB()` with `getOrCreate` that uses `ai` when the record is missing.
- [ ] Add `every()` for recurring events based on cron or natural language.
- [ ] Add `on()` for one‑time events such as webhooks or manual triggers.
