# `.do` Platform

This repository contains the SDKs, primitives and example workflows that power [workflows.do](https://workflows.do). The root `README.md` demonstrates simple usage of the `ai`, `db`, `every` and `on` helpers. New features should follow the same style and remain easy to read.

## Definition of Done

For a feature to be considered **done**, it must meet the following criteria.
These checklist items ensure new code is well documented, typed and tested.

### SDK

- [ ] `sdks/[sdk]/README.md` with simple and intuitive examples similar to the ones shown in the root `README.md`
- [ ] `sdks/[sdk]/types.ts` with JSDoc for all exported types
- [ ] `sdks/[sdk]/*.test.ts` without mocks for all functionality
- [ ] Example usage demonstrates interaction with both `AI` and `DB`
- [ ] `pnpm lint` and `pnpm check-types` run without errors

### Primitive

- [ ] `primitives/*.ts` with simple and intuitive examples
- [ ] `primitives/*.test.ts` without mocks for all functionality
- [ ] Example showcases how the primitive fits into a larger workflow
- [ ] `pnpm lint` and `pnpm check-types` run without errors

### API

- [ ] `(apis)/[api]/README.md` with simple and intuitive examples
- [ ] `(apis)/[api]/types.ts` with JSDoc for all exported types
- [ ] `(apis)/[api]/*.test.ts` without mocks for all functionality
- [ ] Documentation references the primitives that power the API
- [ ] `pnpm lint` and `pnpm check-types` run without errors

### General Guidelines

- Keep TypeScript interfaces lightweight and easy to understand.
- Provide end-to-end tests demonstrating how the primitives work together.
- New documentation should reference the `AI` and `DB` functions as shown in the repository examples.
- All tests must pass when run with `pnpm test`.
- Code should be formatted with `pnpm format` before committing.
