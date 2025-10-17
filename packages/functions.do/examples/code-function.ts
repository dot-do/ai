/**
 * Code Function Examples
 *
 * Pure computation with optional eval-based execution
 */

import { defineCodeFunction, execute } from '../src'
import { z } from 'zod'

// Simple arithmetic function
export const addNumbers = defineCodeFunction({
  name: 'addNumbers',
  description: 'Add two numbers together',
  input: z.object({
    a: z.number(),
    b: z.number(),
  }),
  output: z.number(),
  handler: async ({ a, b }) => a + b,
  deterministic: true,
  idempotent: true,
  tags: ['math', 'arithmetic'],
})

// String manipulation
export const reverseString = defineCodeFunction({
  name: 'reverseString',
  description: 'Reverse a string',
  input: z.object({
    text: z.string(),
  }),
  output: z.string(),
  handler: async ({ text }) => text.split('').reverse().join(''),
  deterministic: true,
  idempotent: true,
})

// Data transformation
export const transformUser = defineCodeFunction({
  name: 'transformUser',
  description: 'Transform user data',
  input: z.object({
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email(),
  }),
  output: z.object({
    fullName: z.string(),
    username: z.string(),
    email: z.string(),
  }),
  handler: async ({ firstName, lastName, email }) => ({
    fullName: `${firstName} ${lastName}`,
    username: email.split('@')[0],
    email,
  }),
  deterministic: true,
  idempotent: true,
})

// Async with external API call
export const fetchUserData = defineCodeFunction({
  name: 'fetchUserData',
  description: 'Fetch user data from external API',
  input: z.object({
    userId: z.string(),
  }),
  output: z.object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
  }),
  handler: async ({ userId }, ctx) => {
    const response = await fetch(`https://api.example.com/users/${userId}`, {
      headers: ctx.headers,
    })
    return response.json()
  },
  timeout: 5000,
  retries: 3,
  retryBackoff: 'exponential',
  deterministic: false,
})

// Code string example (for eval-based execution)
export const evalExample = defineCodeFunction({
  name: 'evalSquare',
  description: 'Square a number (eval-based)',
  input: z.object({
    x: z.number(),
  }),
  output: z.number(),
  code: `
    async function handler({ x }) {
      return x * x
    }
  `,
  handler: async ({ x }) => x * x, // Fallback handler
  runtime: 'worker',
  deterministic: true,
})

// Example usage
async function main() {
  // Execute addNumbers
  const sum = await execute('fn_add_numbers', { a: 5, b: 3 })
  console.log('Sum:', sum.output) // 8

  // Execute reverseString
  const reversed = await execute('fn_reverse_string', { text: 'hello' })
  console.log('Reversed:', reversed.output) // 'olleh'

  // Execute transformUser
  const user = await execute('fn_transform_user', {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
  })
  console.log('User:', user.output)
  // { fullName: 'John Doe', username: 'john.doe', email: 'john.doe@example.com' }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main()
}
