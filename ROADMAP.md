# Roadmap

## v0.2.0 – Typed Building Blocks

- [ ] LLM.do Model Routing - route generative requests to the best model based on the function definition.
- [ ] Functions.do Generate Text - basic helper returning raw text from the language model.
- [ ] Functions.do Generate TextArray - return an array of strings using numbered markdown lists.
- [ ] Functions.do Generate Object - parse JSON objects from the model output.
- [ ] Functions.do Generate ObjectArray - parse arrays of JSON objects from the model output.
- [ ] Functions.do Generate Strongly-Typed Object - use the schema pattern from `AI()` to validate output.
- [ ] Functions.do Generate Strongly-Typed ObjectArray - same as above but for arrays.
- [ ] Functions.do Generate Code - return executable code snippets as shown in the README examples.
- [ ] Functions.do Generate UI - experimental generation of UI components.
- [ ] Database.do List + CRUD - a thin layer over the database primitives for create/read/update/delete operations.
- [ ] Database.do Get or Generate - automatically call `ai` when data is missing.
- [ ] Workflows.do Code Execution - run user defined functions or scripts as workflow steps.
- [ ] Workflows.do Execution at Intervals - schedule workflows with `every()`.
- [ ] Workflows.do Execution on Events - trigger workflows via `on()` handlers.

## v0.3.0 – Advanced Agents

- [ ] LLM.do Managed Tool Use - allow the language model to invoke tools and APIs declared in the workflow.
- [ ] Triggers.do Event-Driven Process Execution - subscribe to external events and start workflows automatically.
