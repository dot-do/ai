# GPT-5 Semantic Enrichment Pipeline

Enrich ingested data with semantic analysis using OpenAI's Batch API for cost-effective processing.

## Overview

The enrichment pipeline analyzes MDX files in the `.db` directory and extracts:

- **Nouns and Verbs**: Key entities and actions from descriptions
- **Triggers**: Potential trigger events for automation
- **Searches**: Potential search queries
- **Actions**: Potential actions or operations
- **Business Events**: Event patterns in `$.Subject.predicate.Object` format
- **Relationships**: Semantic relationships between entities
- **Ontology Mappings**: Mappings to Schema.org, GS1, and O\*NET vocabularies

## Features

- ✅ **Batch Processing**: Process thousands of items cost-effectively with OpenAI Batch API
- ✅ **24h Completion Window**: Non-blocking enrichment with automatic processing
- ✅ **50% Cost Savings**: Batch API provides 50% discount compared to synchronous API calls
- ✅ **Concurrent Processing**: Parallel file writes with configurable concurrency limit
- ✅ **Resumability**: Automatically resume interrupted enrichment jobs
- ✅ **Progress Tracking**: Track enrichment progress in `.db/.enrichment-progress.json`
- ✅ **Error Handling**: Graceful error handling with detailed logging

## Usage

### Prerequisites

Set your OpenAI API key:

```bash
export OPENAI_API_KEY=sk-...
```

Optional: Configure the model to use (defaults to `gpt-5`):

```bash
export OPENAI_MODEL=gpt-5          # Default: full GPT-5 model
export OPENAI_MODEL=gpt-5-mini     # Use smaller, more cost-effective variant
export OPENAI_MODEL=gpt-5-nano     # Use smallest variant
```

### Run Enrichment

```bash
# Enrich all data in .db directory
npm run enrich

# Or run GPT-5 enrichment directly
npm run enrich:gpt5

# Specify a different data directory
npm run enrich:gpt5 /path/to/data
```

### Resume Interrupted Jobs

If enrichment is interrupted, simply run the command again. The pipeline will automatically resume from where it left off using the progress file at `.db/.enrichment-progress.json`.

## How It Works

1. **Collect MDX Files**: Scans `.db` directory for all `.mdx` files
2. **Create Batch File**: Generates JSONL batch file with enrichment requests
3. **Upload to OpenAI**: Uploads batch file using Batch API
4. **Create Batch Job**: Creates batch job with 24h completion window
5. **Poll for Completion**: Checks status every 30 seconds until complete (configurable via `BATCH_POLL_INTERVAL_MS`)
6. **Process Results**: Downloads results and enriches MDX frontmatter
7. **Write Back**: Updates original MDX files with enrichment data

## Output Format

Enrichment data is added to MDX frontmatter under the `enrichment` key:

```yaml
---
$id: naics:51
$type: IndustryClassification
code: '51'
title: Information
description: 'Industries engaged in...'
enrichment:
  nouns:
    - information
    - publishing
    - broadcasting
    - telecommunications
  verbs:
    - publish
    - broadcast
    - transmit
    - distribute
  triggers:
    - ContentPublished
    - BroadcastScheduled
    - DataTransmitted
  searches:
    - 'information services'
    - 'publishing companies'
    - 'broadcasting networks'
  actions:
    - publishContent
    - scheduleBroadcast
    - transmitData
  businessEvents:
    - $.Content.published
    - $.Broadcast.scheduled
    - $.Data.transmitted
  relationships:
    - subject: Information
      predicate: includes
      object: Publishing
    - subject: Information
      predicate: includes
      object: Broadcasting
  ontologyMappings:
    schemaOrgType: IndustryClassification
    gs1Type: IndustryClassification
---
# Content...
```

## Cost Estimation

Using the Batch API provides **50% cost savings** compared to synchronous API calls.

### GPT-5 Pricing (as of October 2025)

- **Synchronous API**: $0.015 per 1K input tokens, $0.060 per 1K output tokens
- **Batch API**: $0.0075 per 1K input tokens, $0.030 per 1K output tokens (50% discount)

### Example: 1,000 Items

Assuming average per item:

- Input: 500 tokens per item = 500K total input tokens
- Output: 300 tokens per item = 300K total output tokens

**Synchronous API cost**:

- Input: 500K × $0.015 / 1K = $7.50
- Output: 300K × $0.060 / 1K = $18.00
- **Total: $25.50**

**Batch API cost**:

- Input: 500K × $0.0075 / 1K = $3.75
- Output: 300K × $0.030 / 1K = $9.00
- **Total: $12.75**

**Savings: $12.75 (50%)**

The 50% cost savings come from using the Batch API, which offers discounted pricing in exchange for a 24-hour completion window. No additional configuration is required—the Batch API automatically provides this discount.

## Progress Tracking

The pipeline saves progress to `.db/.enrichment-progress.json`:

```json
{
  "batchId": "batch_abc123",
  "inputFileId": "file-xyz789",
  "outputFileId": "file-output123",
  "status": "processing",
  "startedAt": "2025-10-10T08:00:00.000Z",
  "processedCount": 0,
  "totalCount": 1000,
  "errors": []
}
```

## Error Handling

- Validates `OPENAI_API_KEY` environment variable
- Handles batch API errors gracefully
- Tracks errors in progress file
- Supports resume after failures
- Logs detailed error messages

## Troubleshooting

### Batch Not Completing

If a batch is stuck in `processing` status for longer than expected:

1. Check batch status manually:

   ```bash
   curl https://api.openai.com/v1/batches/{batch_id} \
     -H "Authorization: Bearer $OPENAI_API_KEY"
   ```

2. Cancel and restart:

   ```bash
   # Delete progress file to start fresh
   rm .db/.enrichment-progress.json

   # Run enrichment again
   npm run enrich
   ```

### Empty Enrichment Data

If you see warnings about empty enrichment data:

- The input file may not have enough semantic content to extract
- Consider manually reviewing the file's description and content
- Some files (like index pages) may legitimately have minimal semantic content

### Invalid JSON Responses

If GPT-5 returns invalid JSON:

- The pipeline will skip these files and log errors
- Check the error logs in console output
- Failed files can be re-enriched by deleting the progress file and running again

### Partial Batch Failures

If a batch completes but some files failed:

- Check error logs for specific file failures
- Failed files are logged with their error messages
- Re-run enrichment to attempt processing failed files again
- The pipeline automatically handles failed/expired batches by restarting

### API Key Issues

Ensure your API key has batch API access:

```bash
# Test API key
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

### Memory Issues

For large datasets (100K+ files), the pipeline may need more memory:

```bash
# Increase Node.js memory limit
NODE_OPTIONS=--max-old-space-size=4096 npm run enrich
```

### Rate Limiting

The Batch API has its own rate limits separate from synchronous API:

- Pipeline automatically handles polling with exponential backoff
- Default: starts at 1 minute, increases to max 5 minutes
- Configure via `BATCH_POLL_INTERVAL_MS` and `BATCH_MAX_POLL_INTERVAL_MS`

## Next Steps

After enrichment, you can:

1. Query enriched data using semantic patterns
2. Build triggers based on extracted trigger events
3. Create searches based on extracted search queries
4. Build actions based on extracted actions
5. Map enriched data to ontologies
6. Build autonomous digital workers using enriched semantics

## Related

- [OpenAI Batch API Documentation](https://platform.openai.com/docs/guides/batch)
- [GraphDL Documentation](../../README.md)
- [Data Ingestion](../ingest/)
