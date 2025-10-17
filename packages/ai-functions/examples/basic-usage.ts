/**
 * Basic usage example for ai-functions
 *
 * This example demonstrates:
 * - Registering functions
 * - Executing functions
 * - Searching for functions
 * - Managing function lifecycle
 */

import { registerFunction, executeFunction, searchFunctions, updateFunction, deleteFunction, getFunctionStats } from 'ai-functions'

async function main() {
  console.log('=== ai-functions Basic Usage Example ===\n')

  // 1. Register a simple function
  console.log('1. Registering a greeting function...')
  const greetFunc = await registerFunction({
    name: 'greet',
    description: 'Greet a person by name',
    version: '1.0.0',
    code: 'export default function greet(name) { return `Hello, ${name}!` }',
    tags: ['greeting', 'text'],
    author: 'example-user',
  })
  console.log(`   Registered: ${greetFunc.name} (${greetFunc.id})\n`)

  // 2. Register a math function
  console.log('2. Registering a math function...')
  const mathFunc = await registerFunction({
    name: 'calculateSum',
    description: 'Calculate the sum of two numbers',
    version: '1.0.0',
    code: 'export default function sum(a, b) { return a + b }',
    tags: ['math', 'arithmetic'],
    author: 'example-user',
  })
  console.log(`   Registered: ${mathFunc.name} (${mathFunc.id})\n`)

  // 3. Execute functions
  console.log('3. Executing functions...')
  const greetResult = await executeFunction(greetFunc.id, 'World')
  console.log(`   Greeting result: ${greetResult.status} (${greetResult.duration}ms)`)

  const mathResult = await executeFunction(mathFunc.id, { a: 5, b: 3 })
  console.log(`   Math result: ${mathResult.status} (${mathResult.duration}ms)\n`)

  // 4. Search for functions
  console.log('4. Searching for functions...')
  const mathFunctions = await searchFunctions({ tags: ['math'] })
  console.log(`   Found ${mathFunctions.total} math functions`)

  const greetingFunctions = await searchFunctions({ query: 'greet' })
  console.log(`   Found ${greetingFunctions.total} greeting functions\n`)

  // 5. Get function statistics
  console.log('5. Getting function statistics...')
  const stats = await getFunctionStats(mathFunc.id)
  console.log(`   Executions: ${stats?.executionCount}`)
  console.log(`   Last executed: ${stats?.lastExecutedAt?.toISOString()}\n`)

  // 6. Update a function
  console.log('6. Updating function version...')
  const updated = await updateFunction(mathFunc.id, {
    version: '1.1.0',
    description: 'Calculate the sum of two numbers (with validation)',
  })
  console.log(`   Updated to version: ${updated.version}\n`)

  // 7. Delete a function
  console.log('7. Deleting greeting function...')
  const deleted = await deleteFunction(greetFunc.id)
  console.log(`   Deleted: ${deleted}\n`)

  console.log('=== Example Complete ===')
}

main().catch(console.error)
