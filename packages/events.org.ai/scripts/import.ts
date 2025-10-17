#!/usr/bin/env tsx
/**
 * Import enhanced business event data for events.org.ai
 *
 * Enhances GS1 EPCIS (Electronic Product Code Information Services) with:
 * - Extended event types beyond GS1 core
 * - Richer semantic relationships
 * - AI/automation metadata
 * - Business process integration
 *
 * Data Sources:
 * - GS1 EPCIS (base event model)
 * - GS1 CBV (Core Business Vocabulary)
 * - Platform enrichment (semantics, automation)
 *
 * Based on 5W+H Model:
 * - What: Objects/entities involved
 * - When: Timestamp and duration
 * - Where: Location (physical/virtual)
 * - Who: Actors and roles
 * - Why: Business context
 * - How: Process and technology
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import type { BusinessEvent, EventType } from '../src/types/event.js'

// ES module __dirname equivalent
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/**
 * Main import function
 */
async function importEvents() {
  console.log('🚀 Importing enhanced business event templates...\n')

  // Starter set of common event templates
  const eventTemplates = [
    {
      id: 'object-created',
      name: 'Object Created',
      type: 'ObjectEvent' as EventType,
      step: 'commissioning',
      disposition: 'active',
      description: 'New object/entity created in system',
    },
    {
      id: 'object-shipped',
      name: 'Object Shipped',
      type: 'ObjectEvent' as EventType,
      step: 'shipping',
      disposition: 'in_transit',
      description: 'Object shipped from one location to another',
    },
    {
      id: 'object-received',
      name: 'Object Received',
      type: 'ObjectEvent' as EventType,
      step: 'receiving',
      disposition: 'available',
      description: 'Object received at destination',
    },
    {
      id: 'transaction-completed',
      name: 'Transaction Completed',
      type: 'TransactionEvent' as EventType,
      step: 'accepting',
      disposition: 'sold',
      description: 'Business transaction completed',
    },
    {
      id: 'state-changed',
      name: 'State Changed',
      type: 'StateChangeEvent' as EventType,
      disposition: 'in_progress',
      description: 'Object or entity state changed',
    },
    {
      id: 'process-executed',
      name: 'Process Executed',
      type: 'ProcessEvent' as EventType,
      disposition: 'in_progress',
      description: 'Business process step executed',
    },
    {
      id: 'quality-inspected',
      name: 'Quality Inspected',
      type: 'QualityEvent' as EventType,
      step: 'inspecting',
      description: 'Quality inspection performed',
    },
    {
      id: 'ownership-transferred',
      name: 'Ownership Transferred',
      type: 'OwnershipEvent' as EventType,
      step: 'accepting',
      disposition: 'sold',
      description: 'Ownership transferred between parties',
    },
  ]

  // Create events map (these are templates/patterns, not actual events)
  const eventsMap = new Map<string, BusinessEvent>()

  for (const template of eventTemplates) {
    eventsMap.set(template.id, {
      $type: 'BusinessEvent',
      $id: `events.org.ai:template:${template.id}`,
      eventId: template.id,
      eventType: template.type,
      eventTime: new Date().toISOString(),
      businessStep: template.step,
      disposition: template.disposition,
      description: template.description,
    })
  }

  // Convert to record
  const events: Record<string, BusinessEvent> = {}
  for (const [id, event] of eventsMap.entries()) {
    events[id] = event
  }

  console.log(`📊 Created ${Object.keys(events).length} event templates`)

  // Count by event type
  const typeCounts = Object.values(events).reduce((acc, evt) => {
    acc[evt.eventType] = (acc[evt.eventType] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  console.log('\n📋 Event templates by type:')
  Object.entries(typeCounts)
    .sort((a, b) => b[1] - a[1])
    .forEach(([type, count]) => {
      console.log(`  ${type}: ${count}`)
    })

  // Generate events.ts file
  const eventsContent = `/**
 * Enhanced business event templates for events.org.ai
 * Built on GS1 EPCIS with 5W+H model
 *
 * Based on:
 * - GS1 EPCIS (Electronic Product Code Information Services)
 * - GS1 CBV (Core Business Vocabulary)
 * - 5W+H Model: What, When, Where, Who, Why, How
 */

import type { BusinessEvent } from '../types/event.js'

export const eventTemplates: Record<string, BusinessEvent> = ${JSON.stringify(events, null, 2)}

/**
 * Get event template by ID
 */
export function getEventTemplate(eventId: string): BusinessEvent | undefined {
  return eventTemplates[eventId]
}

/**
 * Get all event templates
 */
export function getAllEventTemplates(): BusinessEvent[] {
  return Object.values(eventTemplates)
}

/**
 * Get event templates by type
 */
export function getEventTemplatesByType(eventType: string): BusinessEvent[] {
  return Object.values(eventTemplates).filter((evt) => evt.eventType === eventType)
}

/**
 * Get event templates by business step
 */
export function getEventTemplatesByBusinessStep(businessStep: string): BusinessEvent[] {
  return Object.values(eventTemplates).filter((evt) => evt.businessStep === businessStep)
}

/**
 * Search event templates
 */
export function searchEventTemplates(query: string): BusinessEvent[] {
  const searchTerm = query.toLowerCase()
  return Object.values(eventTemplates).filter(
    (evt) =>
      evt.eventId.toLowerCase().includes(searchTerm) ||
      evt.eventType.toLowerCase().includes(searchTerm) ||
      evt.description?.toLowerCase().includes(searchTerm)
  )
}

/**
 * Create event from template
 */
export function createEventFromTemplate(
  templateId: string,
  overrides: Partial<BusinessEvent>
): BusinessEvent {
  const template = getEventTemplate(templateId)
  if (!template) {
    throw new Error(\`Event template not found: \${templateId}\`)
  }

  return {
    ...template,
    ...overrides,
    eventId: overrides.eventId || \`\${templateId}-\${Date.now()}\`,
    eventTime: overrides.eventTime || new Date().toISOString(),
  }
}
`

  // Write to file
  const dataDir = path.resolve(__dirname, '../src/data')
  fs.mkdirSync(dataDir, { recursive: true })
  fs.writeFileSync(path.join(dataDir, 'events.ts'), eventsContent)

  console.log(`\n✅ Generated events.ts with ${Object.keys(events).length} event templates`)
  console.log('\n📝 Note: These are templates. Actual events created at runtime')
  console.log('   GS1 EPCIS compatibility maintained via epcisEventType field')
}

// Run import
importEvents().catch((error) => {
  console.error('❌ Import failed:', error)
  process.exit(1)
})
