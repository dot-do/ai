// storage-adapter-import-placeholder
// import { mongooseAdapter } from '@payloadcms/db-mongodb'
// import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { multiTenantPlugin } from '@payloadcms/plugin-multi-tenant'
import { Config } from 'payload'

// import type { Access, CodeField } from 'payload'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
// import sharp from 'sharp'

import { editorOptions } from './lib/collections'
import { db } from './databases/sqlite'

import { Functions } from './collections/Functions'
import { Workflows } from './collections/Workflows'
import { Nouns } from './collections/Nouns'
import { Things } from './collections/Things'
import { Events } from './collections/Events'
import { Webhooks } from './collections/Webhooks'
import { Users } from './collections/Users'
import { Roles } from './collections/Roles'
import { Projects } from './collections/Projects'
import { Settings } from './collections/Settings'


// import { Settings } from './globals/Settings'

import { generate } from './tasks/generate'
import { embedData } from './workflows/embedData'
import { executeFunction } from './workflows/executeFunction'
import { executeWorkflow } from './workflows/executeWorkflow'
import { generateDatabase } from './workflows/generateDatabase'
import { generateNoun } from './workflows/generateNoun'
import { generateThing } from './workflows/generateThing'

// // https://payloadcms.com/docs/typescript/generating-types#disable-declare-statement
// declare module 'payload' {
//   export interface GeneratedTypes extends Config {}
// }

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Functions, Workflows, Nouns, Things, Events, Projects, Users, Roles, Webhooks, Settings],
  // globals: [Settings],
  jobs: {
    tasks: [generate],
    workflows: [embedData, executeFunction, executeWorkflow, generateDatabase, generateNoun, generateThing],
    jobsCollectionOverrides: ({ defaultJobsCollection }) => {
      if (!defaultJobsCollection.admin) {
        defaultJobsCollection.admin = {}
      }
      defaultJobsCollection.admin.hidden = false
      defaultJobsCollection.admin.group = 'Admin'
      defaultJobsCollection.labels = {
        singular: 'Job Queue',
        plural: 'Job Queue',
      }
      defaultJobsCollection.fields.map((field) => {
        if (field.type === 'json') {
          field.admin = {
            ...field.admin,
            editorOptions,
          }
        }
      })
      return defaultJobsCollection
    },
    addParentToTaskLog: true,
    deleteJobOnComplete: false,
  },
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload.types.ts'),
    declare: false,
  },
  db,
  // db: mongooseAdapter({
  //   url: process.env.DATABASE_URI || '',
  // }),
  // sharp,
  plugins: [
    multiTenantPlugin<Config>({
      debug: false,
      enabled: true,
      userHasAccessToAllTenants: () => true,
      tenantsSlug: 'projects',
      tenantField: { name: 'project' },
      tenantSelectorLabel: 'Project',
      collections: {
        events: {},
        functions: {},
        nouns: {},
        roles: {},
        things: {},
        webhooks: {},
        workflows: {},
        settings: {
          isGlobal: true,
        }
      },
    }),
    // storage-adapter-placeholder
  ],
})
