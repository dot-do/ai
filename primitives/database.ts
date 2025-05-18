import { getPayload } from 'payload';
import { config as configPromise } from './index';
import { DBClient, DBDefinition, DBOptions, SchemaDefinition, ThingOperations } from '../sdks/database.do/src/types';

/**
 * DB function for defining Nouns and Schema to be generated
 * 
 * @param schema - The schema definition for Nouns
 * @param options - Optional configuration options
 * @returns An object with the defined Nouns
 */
export const DB: DBDefinition = (schema, options: DBOptions = {}) => {
  const result: Record<string, any> = {};
  
  for (const [name, schemaDefinition] of Object.entries(schema)) {
    result[name] = {
      id: `noun_${name.toLowerCase()}`,
      name,
      schema: schemaDefinition,
    };
  }
  
  return result as any;
};

/**
 * Create CRUD operations for a specific Thing type
 * 
 * @param nounName - The name of the Noun
 * @returns ThingOperations for the specified Noun
 */
const createThingOperations = (nounName: string): ThingOperations => {
  return {
    /**
     * Create a new Thing
     */
    create: async (data) => {
      const config = await configPromise;
      const payload = await getPayload({ config });
      
      let noun;
      try {
        const response = await payload.find({
          collection: 'nouns',
          where: {
            name: {
              equals: nounName,
            },
          },
        });
        
        if (response.docs.length > 0) {
          noun = response.docs[0];
        } else {
          noun = await payload.create({
            collection: 'nouns',
            data: {
              name: nounName,
            },
          });
        }
      } catch (error) {
        noun = await payload.create({
          collection: 'nouns',
          data: {
            name: nounName,
          },
        });
      }
      
      const thing = await payload.create({
        collection: 'things',
        data: {
          type: noun.id,
          name: data.name || `${nounName} Thing`,
          data,
        },
      });
      
      return thing;
    },
    
    /**
     * Get a Thing by ID
     */
    get: async (id) => {
      const config = await configPromise;
      const payload = await getPayload({ config });
      
      return await payload.findByID({
        collection: 'things',
        id,
      });
    },
    
    /**
     * List Things of this type
     */
    list: async (query = {}) => {
      const config = await configPromise;
      const payload = await getPayload({ config });
      
      const nounResponse = await payload.find({
        collection: 'nouns',
        where: {
          name: {
            equals: nounName,
          },
        },
      });
      
      if (nounResponse.docs.length === 0) {
        return {
          docs: [],
          totalDocs: 0,
          page: 1,
          totalPages: 1,
          hasNextPage: false,
          hasPrevPage: false,
        };
      }
      
      const noun = nounResponse.docs[0];
      
      // Find Things of this type
      const response = await payload.find({
        collection: 'things',
        where: {
          type: {
            equals: noun.id,
          },
          ...(query.where || {}),
        },
        limit: query.limit,
        page: query.page,
        sort: query.sort,
      });
      
      return {
        docs: response.docs as any[],
        totalDocs: response.totalDocs,
        page: response.page || 1, // Ensure page is always a number
        totalPages: response.totalPages,
        hasNextPage: response.hasNextPage,
        hasPrevPage: response.hasPrevPage,
      };
    },
    
    /**
     * Update a Thing
     */
    update: async (id, data) => {
      const config = await configPromise;
      const payload = await getPayload({ config });
      
      return await payload.update({
        collection: 'things',
        id,
        data,
      });
    },
    
    /**
     * Delete a Thing
     */
    delete: async (id) => {
      const config = await configPromise;
      const payload = await getPayload({ config });
      
      await payload.delete({
        collection: 'things',
        id,
      });
    },
  };
};

/**
 * db client for List + CRUD operations on Things
 * Can create Nouns on demand if needed
 */
export const db: DBClient = new Proxy({} as DBClient, {
  get: (target, prop) => {
    if (typeof prop !== 'string') return undefined;
    
    return createThingOperations(prop);
  }
});
