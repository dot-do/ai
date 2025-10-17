/**
 * Example: Compile YAML workflow to TypeScript
 */

import { readFileSync, writeFileSync } from 'fs'
import { parseWorkflow, validateWorkflow, compileWorkflow } from '../src/index.js'

// Read YAML workflow
const yaml = readFileSync('./examples/order-fulfillment.yaml', 'utf-8')

// Parse workflow
const parseResult = parseWorkflow(yaml)

if (parseResult.errors.length > 0) {
  console.error('Parse errors:')
  parseResult.errors.forEach((err) => console.error('  -', err))
  process.exit(1)
}

console.log('✓ Parsed workflow:', parseResult.workflow.name)

// Validate workflow
const validation = validateWorkflow(parseResult.workflow)

if (!validation.valid) {
  console.error('Validation errors:')
  validation.errors.forEach((err) => console.error('  -', err))
  process.exit(1)
}

console.log('✓ Validated workflow')

if (parseResult.warnings.length > 0) {
  console.warn('Warnings:')
  parseResult.warnings.forEach((warn) => console.warn('  -', warn))
}

// Compile to TypeScript
const compileResult = compileWorkflow(parseResult.workflow, {
  pretty: true,
  debug: true,
})

if (compileResult.errors.length > 0) {
  console.error('Compilation errors:')
  compileResult.errors.forEach((err) => console.error('  -', err))
  process.exit(1)
}

console.log('✓ Compiled to TypeScript')

if (compileResult.warnings.length > 0) {
  console.warn('Compilation warnings:')
  compileResult.warnings.forEach((warn) => console.warn('  -', warn))
}

// Write output
writeFileSync('./examples/order-fulfillment.ts', compileResult.code)

console.log('\nGenerated TypeScript:')
console.log('====================')
console.log(compileResult.code)
