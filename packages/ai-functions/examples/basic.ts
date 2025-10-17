/**
 * Basic example - Register and execute a simple function
 */

import { registerFunction, executeFunction, getFunction } from '../src/index.js'

async function main() {
  console.log('=== ai-functions Basic Example ===\n')

  // 1. Register a function
  console.log('1. Registering function...')
  const func = await registerFunction({
    metadata: {
      id: 'hello-world',
      name: 'Hello World',
      description: 'A simple greeting function',
      version: '1.0.0',
      author: 'example@example.com',
      tags: ['example', 'greeting'],
      runtime: 'typescript',
      timeout: 30,
      memory: 128,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    source: {
      code: `export default function handler(input) {
        return {
          message: \`Hello, \${input.name || 'World'}!\`,
          timestamp: new Date().toISOString()
        }
      }`,
      language: 'typescript',
      handler: 'handler',
    },
  })

  console.log('Function registered:', func.definition.metadata.name)
  console.log('Function ID:', func.definition.metadata.id)
  console.log('Status:', func.status)
  console.log()

  // 2. Get function details
  console.log('2. Getting function details...')
  const retrieved = await getFunction('hello-world')
  if (retrieved) {
    console.log('Found function:', retrieved.definition.metadata.name)
    console.log('Version:', retrieved.definition.metadata.version)
    console.log('Tags:', retrieved.definition.metadata.tags?.join(', '))
  }
  console.log()

  // 3. Execute function
  console.log('3. Executing function...')
  const result = await executeFunction('hello-world', {
    params: {
      name: 'Developer',
    },
    options: {
      sandbox: true,
      timeout: 30,
    },
  })

  if (result.success) {
    console.log('✓ Execution successful!')
    console.log('Result:', result.data)
    console.log('Duration:', result.execution.duration, 'ms')
    console.log('Execution ID:', result.execution.executionId)
  } else {
    console.error('✗ Execution failed:', result.error)
  }
  console.log()

  // 4. Execute with different params
  console.log('4. Executing with different params...')
  const result2 = await executeFunction('hello-world', {
    params: {
      name: 'World',
    },
  })

  if (result2.success) {
    console.log('✓ Execution successful!')
    console.log('Result:', result2.data)
  }
  console.log()

  console.log('=== Example Complete ===')
}

main().catch(console.error)
