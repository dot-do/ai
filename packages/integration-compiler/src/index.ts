/**
 * Integration Compiler
 *
 * Main exports for the Integration Compiler package.
 */

// Compiler
export { IntegrationCompiler, type CompileResult } from './compiler/integration-compiler.js'
export { FileWriter, type WriteResult } from './compiler/file-writer.js'

// Parsers
export { MDXParser, type ParseResult } from './parser/mdx-parser.js'
export { FrontmatterParser, type ParsedIntegration } from './parser/frontmatter-parser.js'

// Generators
export { TypesGenerator } from './generators/types-generator.js'
export { ClientGenerator } from './generators/client-generator.js'
export { ErrorsGenerator } from './generators/errors-generator.js'
export { WebhooksGenerator } from './generators/webhooks-generator.js'
export { IndexGenerator } from './generators/index-generator.js'
export { ReadmeGenerator } from './generators/readme-generator.js'
export { TestsGenerator } from './generators/tests-generator.js'

// Schema
export type * from './schema/integration.js'
export { validateIntegration, safeValidateIntegration, integrationSchema } from './schema/validator.js'
