# `.do` Platform

This repository contains the SDKs, primitives and example workflows that power [workflows.do](https://workflows.do). The root `README.md` demonstrates simple usage of the `ai`, `db`, `every` and `on` helpers. New features should follow the same style and remain easy to read.

## Definition of Done

For a feature to be considered **done**, it must meet the following criteria:

### SDK

- [ ] `sdks/[sdk]/README.md` with simple and intuitive examples similar to the ones shown in the root `README.md`
- [ ] `sdks/[sdk]/types.ts` with JSDoc for all exported types
- [ ] `sdks/[sdk]/*.test.ts` without mocks for all functionality

### Primitive

- [ ] `primitives/*.ts` with simple and intuitive examples
- [ ] `primitives/*.test.ts` without mocks for all functionality

### API

- [ ] `(apis)/[api]/README.md` with simple and intuitive examples
- [ ] `(apis)/[api]/types.ts` with JSDoc for all exported types
- [ ] `(apis)/[api]/*.test.ts` without mocks for all functionality

### General Guidelines

- Keep TypeScript interfaces lightweight and easy to understand.
- Provide end-to-end tests demonstrating how the primitives work together.
- New documentation should reference the `AI` and `DB` functions as shown in the repository examples.
