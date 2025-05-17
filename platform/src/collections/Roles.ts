import type { CollectionConfig } from 'payload'

export const Roles: CollectionConfig = {
  slug: 'roles',
  admin: {
    group: 'Admin'
  },
  fields: [
    { name: 'id', type: 'text', required: true, label: 'Name' },
    // { name: 'defaultAccess', type: 'select', defaultValue: 'Allow', options: ['Allow', 'Deny'] },
    // { name: 'collections', type: 'array', fields: [
    //   { name: 'collection', type: 'select', options: ['users', 'roles', 'generations', 'models', 'things', 'properties', 'actions', 'verbs', 'nouns'] },
    //   { name: 'access', type: 'select', options: ['Allow', 'Deny'] },
    // ]},
    // { name: 'users', type: 'join', collection: 'users', on: 'roles' },
  ],
}
