import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    group: 'Admin',
    useAsTitle: 'email',
  },
  auth: {
    // loginWithUsername: true,
    useAPIKey: true,
    tokenExpiration: 2592000,
  },
  fields: [
    // Email added by default
    // Add more fields as needed
    // { name: 'roles', type: 'relationship', relationTo: 'roles' },
  ],
}
