import { defineCloudflareConfig } from '@opennextjs/cloudflare'

export default defineCloudflareConfig({
  // Cloudflare-specific configuration
  // The ChatKit app uses edge runtime by default, which is compatible with Workers
})
