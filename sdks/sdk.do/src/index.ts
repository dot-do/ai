// Minimal sdk.do stub for playground compilation
export { $ } from 'graphdl'

// Stub functions for SDK interfaces
export const db = {
  list: async () => [],
  get: async () => null,
  create: async (data: any) => data,
  update: async (id: string, data: any) => data,
  delete: async () => true,
  relate: async () => true,
}

export const ai = {
  generate: async () => ({ text: '' }),
  embed: async () => [],
  batch: async () => [],
}

export const api = {
  fetch: async () => ({ status: 200, data: {} }),
}

export const on = (event: string, handler: Function) => {
  // Stub event listener
}

export const send = async (event: string, data: any) => {
  // Stub event sender
}

export const every = (schedule: string, handler: Function) => {
  // Stub scheduler
}

export const user = {
  current: () => null,
  session: () => null,
  permissions: () => [],
}
