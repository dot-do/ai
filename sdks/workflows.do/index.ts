// Runtime helpers for workflows.do
import type { AIFunction, AIFunctionContext, AIInstance, DBInstance, ModelSchema, CollectionHandlers, DBConfig, EveryHandler, OnHandler } from './types'

// Simple in-memory database implementation
function createCollection<T extends ModelSchema>() {
  let seq = 0
  const records = new Map<string, T & { id: string }>()
  const handlers: CollectionHandlers<T> = {
    async create(data) {
      const id = String(++seq)
      const record = { ...data, id }
      records.set(id, record)
      return record
    },
    async read(id) {
      return records.get(id)
    },
    async update(record) {
      records.set(record.id, record)
      return record
    },
    async delete(id) {
      records.delete(id)
    },
    async search() {
      return Array.from(records.values())
    },
    async getOrCreate(query, generator) {
      const found = Array.from(records.values()).find((r) => Object.entries(query).every(([k, v]) => (r as any)[k] === v))
      if (found) return found
      const created = generator ? await generator() : (({ ...query } as unknown) as T & { id: string })
      return handlers.create(created)
    },
  }
  return handlers
}

export function DB<S extends Record<string, ModelSchema>>(schema: S, _config: DBConfig = {}): DBInstance<S> {
  const db = {} as DBInstance<S>
  for (const key of Object.keys(schema) as Array<keyof S>) {
    ;(db as any)[key] = createCollection(schema[key])
  }
  return db
}

export const db = DB({})

function template(strings: TemplateStringsArray, ...values: any[]) {
  let str = ''
  strings.forEach((s, i) => {
    str += s + (values[i] ?? '')
  })
  return str
}

const baseAI = async (strs: TemplateStringsArray | string, ...values: any[]): Promise<string> => {
  const prompt = typeof strs === 'string' ? strs : template(strs, ...values)
  return prompt.toUpperCase()
}

export const ai: AIInstance & ((strs: TemplateStringsArray | string, ...values: any[]) => Promise<string>) = new Proxy(baseAI as any, {
  get(_target, prop) {
    if (prop === 'list') {
      return async (prompt: string) => [prompt + ' 1', prompt + ' 2']
    }
    if (prop === 'research') {
      return async ({ topic }: { topic: string }) => `# Research on ${topic}`
    }
    return async (args: any) => ({ function: prop.toString(), args })
  },
}) as any

export function AI<T extends Record<string, any>>(schema: T): { [K in keyof T]: AIFunction<any, T[K]> } {
  const instance: Partial<AIInstance> = {}
  for (const key of Object.keys(schema) as Array<keyof T>) {
    const value = schema[key]
    ;(instance as any)[key] = async (args: any, _ctx: AIFunctionContext) => {
      if (typeof value === 'function') return value(args, _ctx)
      return JSON.parse(JSON.stringify(value)) as T[typeof key]
    }
  }
  return instance as any
}

export const every = async (schedule: string, handler: EveryHandler) => {
  await handler({ schedule }, { ai, db })
}

export const on = async <E = any>(event: E, handler: OnHandler<E>) => {
  await handler(event, { ai, db })
}
