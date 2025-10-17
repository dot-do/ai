# Package Rename: @ai-primitives/experiments → ai-experiments

This document addresses the design considerations for renaming the package from `@ai-primitives/experiments` to `ai-experiments`.

## Package scope strategy

Removing the scope (@ai-primitives) is the appropriate approach to align with our convention of using simple names without organization prefixes. This makes the package name more consistent with the main repository name.

## Migration path

For backward compatibility with existing dependents:

- We should consider a deprecation period where both package names are maintained
- Add a note in the README about the name change
- Consider publishing a final version of the old package with a dependency on the new one

## Repository organization

The package is currently located in the primitives.org.ai repository at `packages/ai-experiments`. This location is appropriate and aligns with the intended name, so no repository reorganization is needed.

## Publishing workflow

The renamed package should be published by:

1. The repository maintainer
2. Using the standard publishing process: `pnpm publish`
3. Ensuring proper versioning as outlined below

## Version numbering strategy

For the renamed package:

- Maintain the current version (0.1.0) since the package is still in early development
- When releasing the first stable version, consider starting with 1.0.0
- Follow semantic versioning for future updates
