#!/usr/bin/env tsx
/**
 * Import O*NET Task Statements data
 *
 * Fetches Task Statements dataset from O*NET Center and generates
 * TypeScript data files for tasks.org.ai package
 *
 * Data Source: O*NET Database 30.0
 * File: Task Statements.txt
 * Columns: O*NET-SOC Code, Task ID, Task, Task Type, Incumbents Responding
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import type { Task } from '../src/types/task.js'

// ES module __dirname equivalent
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// O*NET Database URL
const ONET_BASE = 'https://www.onetcenter.org/dl_files/database/db_30_0_text'
const TASKS_URL = `${ONET_BASE}/Task%20Statements.txt`

/**
 * Fetch with retry logic for network timeouts
 */
async function fetchWithRetry(url: string, maxRetries = 3, delayMs = 1000): Promise<string> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      return await response.text()
    } catch (error) {
      if (attempt === maxRetries) {
        throw error
      }
      console.log(`  ⚠️  Attempt ${attempt} failed, retrying in ${delayMs}ms...`)
      await new Promise((resolve) => setTimeout(resolve, delayMs))
      delayMs *= 2 // Exponential backoff
    }
  }
  throw new Error('Max retries exceeded')
}

/**
 * Parse TSV data into array of objects
 */
function parseTSV(text: string): any[] {
  const lines = text.trim().split('\n')
  const headers = lines[0].split('\t')
  return lines.slice(1).map((line) => {
    const values = line.split('\t')
    return headers.reduce((obj, header, i) => {
      obj[header] = values[i] || ''
      return obj
    }, {} as any)
  })
}

/**
 * Main import function
 */
async function importTasks() {
  console.log('🚀 Importing O*NET Task Statements data...\n')

  // Fetch Task Statements data
  console.log('📥 Fetching Task Statements from O*NET Center...')
  const tasksText = await fetchWithRetry(TASKS_URL)
  const tasksData = parseTSV(tasksText)
  console.log(`  ✓ Fetched ${tasksData.length} task statement records\n`)

  // Create tasks map
  const tasksMap = new Map<string, Task>()

  for (const row of tasksData) {
    const onetSocCode = row['O*NET-SOC Code']
    const taskId = row['Task ID']
    const taskStatement = row['Task']
    const taskType = row['Task Type']
    const taskKey = `${onetSocCode}:${taskId}`

    tasksMap.set(taskKey, {
      $type: 'Task',
      $id: `tasks.org.ai:${taskKey}`,
      onetSocCode,
      taskId,
      taskStatement,
      taskType: taskType || undefined,
    })
  }

  // Convert to record
  const tasks: Record<string, Task> = {}
  for (const [key, task] of tasksMap.entries()) {
    tasks[key] = task
  }

  console.log(`📊 Processed ${Object.keys(tasks).length} unique task statements`)

  // Count by occupation
  const occupationCounts = Object.values(tasks).reduce((acc, task) => {
    acc[task.onetSocCode] = (acc[task.onetSocCode] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  console.log(`\n📈 ${Object.keys(occupationCounts).length} occupations with task statements`)
  console.log(
    `   Average ${(Object.keys(tasks).length / Object.keys(occupationCounts).length).toFixed(1)} tasks per occupation`
  )

  // Show top 10 occupations by task count
  const topOccupations = Object.entries(occupationCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)

  console.log('\n🔝 Top 10 occupations by task count:')
  topOccupations.forEach(([code, count]) => {
    console.log(`  ${code}: ${count} tasks`)
  })

  // Generate tasks.ts file
  const tasksContent = `/**
 * Task data for tasks.org.ai
 * Generated from O*NET Database 30.0 - Task Statements
 */

import type { Task } from '../types/task.js'

export const tasks: Record<string, Task> = ${JSON.stringify(tasks, null, 2)}

/**
 * Get task by key (onetSocCode:taskId)
 */
export function getTask(onetSocCode: string, taskId: string): Task | undefined {
  return tasks[\`\${onetSocCode}:\${taskId}\`]
}

/**
 * Get all tasks
 */
export function getAllTasks(): Task[] {
  return Object.values(tasks)
}

/**
 * Get tasks by O*NET-SOC Code (occupation)
 */
export function getTasksByOccupation(onetSocCode: string): Task[] {
  return Object.values(tasks).filter((task) => task.onetSocCode === onetSocCode)
}

/**
 * Search tasks by statement text
 */
export function searchTasks(query: string): Task[] {
  const searchTerm = query.toLowerCase()
  return Object.values(tasks).filter((task) =>
    task.taskStatement.toLowerCase().includes(searchTerm)
  )
}
`

  // Write to file
  const dataDir = path.resolve(__dirname, '../src/data')
  fs.mkdirSync(dataDir, { recursive: true })
  fs.writeFileSync(path.join(dataDir, 'tasks.ts'), tasksContent)

  console.log(`\n✅ Generated tasks.ts with ${Object.keys(tasks).length} task statements`)
}

// Run import
importTasks().catch((error) => {
  console.error('❌ Import failed:', error)
  process.exit(1)
})
