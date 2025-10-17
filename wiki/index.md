---
$id: https://sdk.do/wiki
$type: CollectionPage
$context: https://schema.org
name: SDK Wiki
description: Public documentation for the .do platform SDK, packages, and open-source tools

author:
  $type: Organization
  $id: https://platform.do/team
  name: .do Team
  url: https://platform.do

dateCreated: '2025-10-12'
dateModified: '2025-10-12'
datePublished: '2025-10-12'

keywords: [sdk, documentation, wiki, api, packages, typescript]

hasPart:
  - $type: CollectionPage
    $id: https://sdk.do/wiki/getting-started
    name: Getting Started
  - $type: CollectionPage
    $id: https://sdk.do/wiki/concepts
    name: Core Concepts
  - $type: CollectionPage
    $id: https://sdk.do/wiki/sdk
    name: SDK Reference
  - $type: CollectionPage
    $id: https://sdk.do/wiki/packages
    name: Package Documentation
  - $type: CollectionPage
    $id: https://sdk.do/wiki/examples
    name: Code Examples

license:
  $type: CreativeWork
  name: MIT
  url: https://opensource.org/licenses/MIT

inLanguage: en-US
---

# SDK Wiki

Welcome to the `.do` platform SDK wiki. This is the public documentation for developers building with Business-as-Code and Services-as-Software.

## Contents

### [[Getting Started]]

Quick start guides, installation instructions, and first steps with the SDK.

### [[Core Concepts]]

Foundational concepts like semantic graphs, GraphDL, MDXLD, and Business-as-Code patterns.

### [[SDK Reference]]

Complete API reference for `sdk.do` including `$`, `ai`, `db`, `on`, `send`, `every`, and `user`.

### [[Package Documentation]]

Documentation for all open-source packages: `graphdl`, `mdxld`, `mdxai`, `schema.org.ai`, and more.

### [[Code Examples]]

Real-world examples and code snippets demonstrating common use cases.

## Quick Links

- [SDK Documentation](https://sdk.do)
- [CLI Documentation](https://cli.do)
- [MCP Server Documentation](https://mcp.do)
- [GitHub Repository](https://github.com/dot-do/ai)

## Contributing

This wiki is open source! Contributions are welcome:

1. **Follow MDXLD standards** - Use proper frontmatter with `$id`, `$type`, and Schema.org properties
2. **Use absolute URIs** - All `$id` values should be `https://sdk.do/wiki/*`
3. **Link with [[Wiki Links]]** - Use Obsidian-style links in content
4. **Add semantic metadata** - Include `about`, `mentions`, `isPartOf` relationships
5. **Include educational metadata** - Add `learningResourceType`, `educationalLevel`, `timeRequired`

See `ai/wiki/README.md` for detailed contribution guidelines.
