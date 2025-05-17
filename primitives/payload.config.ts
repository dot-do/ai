// storage-adapter-import-placeholder
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { multiTenantPlugin } from '@payloadcms/plugin-multi-tenant'
import { Config } from 'payload'
import type { Access, CodeField } from 'payload'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
// import sharp from 'sharp'

import { editorOptions } from './lib/collections'

import { Functions } from './collections/Functions'
import { Workflows } from './collections/Workflows'
import { Nouns } from './collections/Nouns'
import { Things } from './collections/Things'
import { Events } from './collections/Events'
import { Webhooks } from './collections/Webhooks'
import { Users } from './collections/Users'
import { Roles } from './collections/Roles'


import { Settings } from './globals/Settings'

import { generate } from './tasks/generate'
import { embedData } from './workflows/embedData'
import { executeFunction } from './workflows/executeFunction'
import { executeWorkflow } from './workflows/executeWorkflow'
import { generateDatabase } from './workflows/generateDatabase'
import { generateNoun } from './workflows/generateNoun'
import { generateThing } from './workflows/generateThing'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Functions, Workflows, Nouns, Things, Events, Users, Roles, Webhooks],
  globals: [Settings],
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
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
  }),
  // sharp,
  plugins: [
    multiTenantPlugin<Config>({
      debug: true,
      enabled: false,
      userHasAccessToAllTenants: () => true,
      tenantsSlug: 'projects',
      tenantField: { name: 'project' },
      tenantSelectorLabel: 'Project',
      collections: {
        nouns: {},
        things: {},
        functions: {},
        workflows: {},
        // navigation: {
        //   isGlobal: true,
        // }
      },
    }),
    // storage-adapter-placeholder
  ],
})
