import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { sql } from '@payloadcms/db-sqlite/drizzle'
import { customType, index, integer, sqliteTable } from '@payloadcms/db-sqlite/drizzle/sqlite-core'

const float32Array = customType<{
  data: number[];
  config: { dimensions: number };
  configRequired: true;
  driverData: Buffer;
}>({
  dataType(config) {
    return `F32_BLOB(${config.dimensions})`;
  },
  fromDriver(value: Buffer) {
    return Array.from(new Float32Array(value.buffer));
  },
  toDriver(value: number[]) {
    return sql`vector32(${JSON.stringify(value)})`;
  },
})

const adapter = sqliteAdapter({
  idType: 'uuid',
  client: {
    url: process.env.DATABASE_URI || 'file:./ai.db',
    syncUrl: process.env.DATABASE_SYNC_URI,
    authToken: process.env.DATABASE_TOKEN || process.env.TURSO_AUTH_TOKEN,
  },
  afterSchemaInit: [
    ({ schema, extendTable }) => {
      extendTable({
        table: schema.tables.nouns,
        columns: {
          embeddings: float32Array('embeddings', { dimensions: 256 }),
        },
        extraConfig: (table) => ({
          embeddings_index: index(
            'nouns_embeddings_index',
          ).on(table.embeddings),
        }),
      })
      extendTable({
        table: schema.tables.things,
        columns: {
          embeddings: float32Array('embeddings', { dimensions: 256 }),
        },
        extraConfig: (table) => ({
          embeddings_index: index(
            'things_embeddings_index',
          ).on(table.embeddings),
        }),
      })
      return schema
    },
  ]
})

export const db = adapter
