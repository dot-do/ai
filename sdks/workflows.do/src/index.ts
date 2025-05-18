export * from './types'

export const ai: Record<string, (...args: any[]) => Promise<any>> = new Proxy({}, {
  get: () => async () => ({})
})

export const db = {
  ideas: {
    async create(data: any) {
      return { id: '1', ...data }
    },
    async search(_query: string) {
      return [] as any[]
    },
    async update(data: any) {
      return data
    },
  },
}

export const every = (schedule: string, fn: (...args: any[]) => any) => ({ schedule, fn })
export const on = (event: string, fn: (...args: any[]) => any) => ({ event, fn })

export const AI = <T extends Record<string, any>>(schema: T): T => schema
export const DB = <T extends Record<string, any>>(models: T): T => models
