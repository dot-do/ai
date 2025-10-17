# Deploying Integrations to Workers for Platforms

Guide for deploying 827+ compiled integrations to the Workers for Platforms namespace.

## Overview

The deployment process consists of:

1. **Compile** integrations from MDXLD to TypeScript
2. **Deploy** workers to Workers for Platforms namespace
3. **Register** integrations in PostgreSQL database
4. **Cache** metadata in KV for fast lookups

## Prerequisites

- Cloudflare account with Workers for Platforms enabled
- Wrangler CLI installed (`npm install -g wrangler`)
- PostgreSQL database accessible via Hyperdrive
- Compiled integrations in `../sdk.do/src/integrations/`

## Quick Start

### Deploy All Integrations (v1)

```bash
cd ai/packages/integration-compiler

# 1. Build the deployment tool
pnpm build

# 2. Deploy all integrations (dry run first)
pnpm deploy:integrations --dry-run

# 3. Deploy for real
pnpm deploy:integrations

# 4. Register in database
psql $DATABASE_URL < deployed-integrations.sql
```

### Deploy Specific Integrations

```bash
# Deploy only stripe, github, and slack
pnpm deploy:integrations stripe github slack
```

### Deploy New Version

```bash
# Deploy all integrations as v2
VERSION=v2 pnpm deploy:integrations
```

## Command Line Options

### Environment Variables

```bash
# Integrations directory (default: ../sdk.do/src/integrations)
INTEGRATIONS_DIR=../sdk.do/src/integrations

# Dispatch namespace (default: integrations)
DISPATCH_NAMESPACE=integrations

# Version to deploy (default: v1)
VERSION=v1

# Batch size for parallel deployments (default: 50)
BATCH_SIZE=50

# Dry run mode (default: false)
DRY_RUN=true

# Full command
INTEGRATIONS_DIR=../sdk.do/src/integrations \
DISPATCH_NAMESPACE=integrations \
VERSION=v2 \
BATCH_SIZE=100 \
pnpm deploy:integrations
```

### Command Line Arguments

```bash
# Dry run (don't actually deploy)
pnpm deploy:integrations --dry-run

# Deploy specific services
pnpm deploy:integrations stripe github slack

# Combine with environment variables
VERSION=v2 pnpm deploy:integrations stripe github
```

## Deployment Process

### Step 1: Compile Integrations

Before deployment, integrations must be compiled from MDXLD to TypeScript:

```bash
# Compile all integrations
node dist/cli/cli.js compile-all ../../integrations --output ../sdk.do/src/integrations

# Or compile specific integrations
node dist/cli/cli.js compile ../../integrations/stripe.mdx --output ../sdk.do/src/integrations
```

### Step 2: Deploy Workers

The deployment tool:

1. Reads compiled integrations from `INTEGRATIONS_DIR`
2. Deploys each as a Worker to the dispatch namespace
3. Uses worker name format: `{service}-{version}` (e.g., `stripe-v1`)
4. Deploys in parallel batches (default: 50 at a time)
5. Generates SQL for database registration

**Batch Deployment**:

Integrations are deployed in batches to avoid overwhelming the Cloudflare API:

```
Deploying batch 1/17 (50 integrations)...
  ✓ stripe-v1
  ✓ github-v1
  ✓ slack-v1
  ...
Batch complete: 50 successful, 0 failed

Deploying batch 2/17 (50 integrations)...
  ✓ hubspot-v1
  ✓ salesforce-v1
  ...
```

### Step 3: Register in Database

After successful deployment, run the generated SQL to register integrations:

```bash
# The deployment tool generates this file
cat deployed-integrations.sql

# Example output:
# INSERT INTO integrations (service, version, worker_name, status, metadata)
# VALUES
#   ('stripe', 'v1', 'stripe-v1', 'active', NULL),
#   ('github', 'v1', 'github-v1', 'active', NULL),
#   ...

# Run it
psql $DATABASE_URL < deployed-integrations.sql
```

### Step 4: Cache Metadata in KV

Update KV cache with latest versions:

```bash
# Set latest version for each service
curl -X PUT "https://api.do/admin/integrations/stripe/cache" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{"version": "v1"}'

# Bulk update (recommended)
psql $DATABASE_URL -c "SELECT service, version FROM integrations WHERE status='active'" \
  | xargs -I {} curl -X PUT "https://api.do/admin/integrations/{}/cache"
```

## Performance

### Deployment Speed

**Serial deployment** (not recommended):

- 827 integrations × ~3 seconds = **~41 minutes**

**Parallel deployment** (batch size = 50):

- 827 integrations ÷ 50 = 17 batches
- 17 batches × ~10 seconds = **~3 minutes**

**Recommended batch sizes**:

- Small deployments (1-10): Batch size 5
- Medium deployments (10-100): Batch size 20
- Large deployments (100+): Batch size 50
- Full deployment (827): Batch size 100

### Resource Limits

**Cloudflare Workers for Platforms limits**:

- Scripts per namespace: 10,000 (we use 827)
- Script size: 10 MB (our workers are ~50KB each)
- Deployment rate: ~50/minute (controlled by batch size)

## Error Handling

### Common Errors

**1. Integration not compiled**

```
✗ stripe-v1: Integration not compiled (client.ts not found)
```

**Solution**: Compile the integration first:

```bash
node dist/cli/cli.js compile ../../integrations/stripe.mdx
```

**2. Wrangler authentication**

```
✗ stripe-v1: Not authenticated
```

**Solution**: Login to wrangler:

```bash
wrangler login
```

**3. Namespace not found**

```
✗ stripe-v1: Namespace 'integrations' not found
```

**Solution**: Create the namespace:

```bash
wrangler dispatch-namespace create integrations
```

**4. Rate limiting**

```
✗ stripe-v1: Too many requests (429)
```

**Solution**: Reduce batch size:

```bash
BATCH_SIZE=20 pnpm deploy:integrations
```

### Retry Failed Deployments

If some deployments fail, you can retry just those:

```bash
# Get list of failed integrations from output
FAILED_SERVICES="stripe github slack"

# Retry deployment
pnpm deploy:integrations $FAILED_SERVICES
```

## Monitoring

### Deployment Summary

The tool provides a summary after deployment:

```
==================================================
Deployment Complete
==================================================
Total integrations: 827
✓ Successful: 825
✗ Failed: 2
Duration: 182.4s
Success rate: 99.8%

Failed integrations:
  - _21risk-v1: Integration not compiled (client.ts not found)
  - _2chat-v1: Integration not compiled (client.ts not found)

Database registration SQL written to: deployed-integrations.sql
Run this SQL to register integrations in the database.
```

### Verify Deployment

```bash
# List workers in namespace
wrangler dispatch-namespace list integrations

# Test specific integration
curl -X POST https://integrations.do/v1/stripe/charge \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $API_TOKEN" \
  -d '{"params": {"amount": 5000, "currency": "usd"}}'
```

## Best Practices

### DO

✅ Always run with `--dry-run` first
✅ Deploy in batches (don't deploy all 827 at once)
✅ Test a few integrations before deploying all
✅ Keep deployment logs for troubleshooting
✅ Register in database after successful deployment
✅ Update KV cache after database registration

### DON'T

❌ Deploy without compiling first
❌ Deploy with batch size > 100 (rate limiting)
❌ Skip database registration (breaks version resolution)
❌ Forget to update KV cache (slow lookups)
❌ Delete old versions immediately (give grace period)

## Troubleshooting

### Deployment hanging

**Symptom**: Deployment stuck on one integration

**Solution**: Kill the process and reduce batch size:

```bash
Ctrl+C
BATCH_SIZE=10 pnpm deploy:integrations
```

### High failure rate

**Symptom**: >10% of deployments failing

**Solution**: Check Cloudflare status and wrangler authentication:

```bash
wrangler whoami
curl https://www.cloudflarestatus.com/api/v2/status.json
```

### Database registration fails

**Symptom**: SQL errors when running `deployed-integrations.sql`

**Solution**: Check database connection and run migrations:

```bash
# Test connection
psql $DATABASE_URL -c "SELECT 1"

# Run migrations
psql $DATABASE_URL < workers/integrations/migrations/001_create_integrations_table.sql
```

## Advanced Usage

### Custom Worker Names

By default, workers are named `{service}-{version}`. To use custom names:

```typescript
// Modify deploy-integrations.ts
const workerName = `my-custom-${service}-${version}`
```

### Deploy to Multiple Namespaces

Deploy same integrations to different namespaces (e.g., staging, production):

```bash
# Staging
DISPATCH_NAMESPACE=integrations-staging pnpm deploy:integrations

# Production
DISPATCH_NAMESPACE=integrations-production pnpm deploy:integrations
```

### Canary Deployments

Deploy new version to subset of users:

```bash
# Deploy v2 for 5% of traffic
VERSION=v2 pnpm deploy:integrations stripe

# Update database with canary status
psql $DATABASE_URL <<EOF
UPDATE integrations
SET metadata = metadata || '{"canary": true, "traffic_percentage": 5}'::jsonb
WHERE service = 'stripe' AND version = 'v2';
EOF
```

## License

MIT
