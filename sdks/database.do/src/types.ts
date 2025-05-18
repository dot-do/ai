import { Noun, Thing } from 'ai-primitives';

/**
 * Schema definition for a Noun
 */
export type SchemaDefinition = {
  [key: string]: 'string' | 'number' | 'boolean' | 'object' | 'array' | string;
};

/**
 * Options for DB configuration
 */
export interface DBOptions {
  project?: string;
}

/**
 * Database definition function
 * Allows defining Nouns and their Schema to be generated
 */
export interface DBDefinition {
  <T extends Record<string, SchemaDefinition>>(
    schema: T,
    options?: DBOptions
  ): {
    [K in keyof T]: Noun & {
      schema: T[K];
    };
  };
}

/**
 * CRUD operations for a Thing
 */
export interface ThingOperations<T = any> {
  /**
   * Create a new Thing
   */
  create: (data: Partial<T>) => Promise<Thing>;
  
  /**
   * Get a Thing by ID
   */
  get: (id: string) => Promise<Thing>;
  
  /**
   * List Things of this type
   */
  list: (query?: {
    limit?: number;
    page?: number;
    sort?: string;
    where?: Record<string, any>;
  }) => Promise<{
    docs: Thing[];
    totalDocs: number;
    page: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  }>;
  
  /**
   * Update a Thing
   */
  update: (id: string, data: Partial<T>) => Promise<Thing>;
  
  /**
   * Delete a Thing
   */
  delete: (id: string) => Promise<void>;
}

/**
 * Database client for runtime operations
 * Allows List + CRUD operations on Things, creating Nouns on demand if needed
 */
export type DBClient = {
  [key: string]: ThingOperations;
};
