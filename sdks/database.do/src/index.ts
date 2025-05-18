import { DBClient, DBDefinition } from './types';

/**
 * DB function for defining Nouns and Schema to be generated
 */
export const DB: DBDefinition = (schema, options = {}) => {
  return {} as any;
};

/**
 * db client for List + CRUD operations on Things
 * Can create Nouns on demand if needed
 */
export const db: DBClient = new Proxy({} as DBClient, {
  get: (target, prop) => {
    if (typeof prop !== 'string') return undefined;
    
    return {
      create: async () => ({}),
      get: async () => ({}),
      list: async () => ({ docs: [], totalDocs: 0, page: 1, totalPages: 1, hasNextPage: false, hasPrevPage: false }),
      update: async () => ({}),
      delete: async () => {},
    };
  }
});

export * from './types';
