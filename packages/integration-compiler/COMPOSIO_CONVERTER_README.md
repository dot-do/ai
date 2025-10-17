# Composio-to-MDXLD Converter

Automated tool to convert 815 Composio app definitions into MDXLD integration format for the `.do` platform.

## Overview

This converter tool successfully transformed **815 Composio apps** into MDXLD integration definitions, achieving a **99.76% compilation success rate** (827/829 integrations compiled successfully).

## Results Summary

- **Total Composio apps fetched**: 815
- **MDXLD files generated**: 815 (100% success rate)
- **Integrations compiled**: 827/829 (99.76% success rate)
- **Failed compilations**: 2 (\_21risk, \_2chat - TypeScript naming restrictions)
- **Total execution time**: ~2 minutes

## Architecture

### Converter Tool

**Location**: `src/tools/composio-converter.ts`

**Key Features**:

- Fetches all apps from Composio API
- Maps Composio auth schemes to MDXLD auth config
- Converts Composio categories to MDXLD category enum
- Generates generic Action resource for each app
- Includes webhook configuration if triggers exist
- Adds standard error handling and test scenarios
- Batch processing with rate limiting (10 apps at a time)

### Data Mapping

#### Authentication

**OAuth 2.0**:

```typescript
// Composio
{
  "mode": "OAUTH2",
  "authorization_url": "...",
  "token_url": "...",
  "fields": [{ "name": "scopes", "default_value": "repo,user" }]
}

// MDXLD
auth:
  type: oauth2
  authorizationUrl: ...
  tokenUrl: ...
  scopes:
    - repo
    - user
```

**API Key**:

```typescript
// Composio
{
  "mode": "API_KEY",
  "proxy": {
    "headers": { "Authorization": "Bearer {{generic_api_key}}" }
  }
}

// MDXLD
auth:
  type: api-key
  location: header
  headerName: Authorization
  scheme: Bearer
```

#### Category Mapping

| Composio Category                 | MDXLD Category  |
| --------------------------------- | --------------- |
| Developer Tools & DevOps          | developer-tools |
| CRM                               | crm             |
| Collaboration & Communication     | communication   |
| Document & File Management        | storage         |
| Analytics & Data                  | analytics       |
| Productivity & Project Management | productivity    |
| Marketing & Social Media          | marketing       |
| Sales & Customer Support          | support         |
| E-commerce                        | ecommerce       |
| Education & LMS                   | productivity    |
| Finance & Accounting              | accounting      |
| HR & Recruiting                   | hr              |
| Scheduling & Booking              | productivity    |
| Entertainment & Media             | social-media    |
| AI & Machine Learning             | developer-tools |
| Design & Creative Tools           | productivity    |
| Gaming                            | social-media    |
| Voice                             | communication   |
| Workflow Automation               | productivity    |
| Other / Miscellaneous             | productivity    |

#### Resources

Since Composio uses an action-based model (e.g., GitHub has 825 actions), we created a generic "Action" resource with an "execute" operation:

```yaml
resources:
  - name: Action
    plural: Actions
    description: Execute ${appName} actions
    operations:
      - name: execute
        method: POST
        path: /
        params:
          - name: action
            type: string
            required: true
            description: Action name to execute
          - name: parameters
            type: object
            required: false
            description: Action parameters
        returns: object
```

## Usage

### Run the Converter

```bash
cd ai/packages/integration-compiler
COMPOSIO_API_KEY=your_api_key pnpm convert:composio
```

### Output

Integrations are generated in: `ai/integrations/*.mdx`

### Compile Integrations

```bash
node dist/cli/cli.js compile-all ../../integrations --output ../sdk.do/src/integrations
```

### Generated Files Per Integration

Each integration gets its own directory with:

- `client.ts` - Main client class
- `types.ts` - TypeScript interfaces
- `errors.ts` - Error classes
- `index.ts` - Public exports
- `{service}.test.ts` - Test file
- `README.md` - Documentation

## Known Limitations

### 1. Identifiers Starting with Numbers

**Issue**: TypeScript doesn't allow identifiers to start with numbers.

**Affected Apps**:

- `_21risk` (21risk)
- `_2chat` (2chat)

**Solution**: These apps were skipped during compilation. To fix, they would need to be manually renamed to valid TypeScript identifiers (e.g., `TwentyOneRisk`, `TwoChat`).

### 2. Base URLs

**Limitation**: Composio API doesn't provide base URLs for each app.

**Current Approach**: Generated placeholder URLs like `https://api.{appKey}.com`

**Impact**: These may not be accurate and should be manually verified for production use.

### 3. Action-Based vs Resource-Based Model

**Difference**: Composio uses an action-based model (list of actions), while MDXLD uses a resource-based REST model (CRUD operations on resources).

**Solution**: Created a generic "Action" resource with an "execute" operation that can invoke any Composio action.

**Trade-off**: Less type-safe than specific resource definitions, but enables automated conversion.

### 4. Webhook Details

**Limitation**: Limited webhook configuration details from Composio API.

**Current Approach**: Generic webhook configuration if `triggersCount > 0`:

```yaml
webhooks:
  enabled: true
  verificationMethod: none
  events:
    - name: generic_trigger
      type: trigger
      description: Generic webhook trigger
```

## Future Enhancements

1. **Fetch Detailed Action Schemas**: Query Composio API for each app's actions and generate specific resource operations instead of generic "execute".

2. **Discover Base URLs**: Enhance converter to discover actual base URLs (perhaps from Composio docs or OpenAPI specs).

3. **Categorization Improvements**: Add new categories to MDXLD schema to better match Composio's categorization (e.g., `scheduling`, `ai`, `design`, `workflow`).

4. **Handle Number-Prefixed Apps**: Implement automatic renaming strategy for apps starting with numbers.

5. **Incremental Updates**: Add ability to update existing integrations rather than regenerating all 815 each time.

6. **Validation**: Add integration validation to catch issues before compilation.

## Files Modified

### New Files Created

- `src/tools/composio-converter.ts` - Main converter tool
- `/tmp/composio-to-mdxld-mapping.md` - Mapping strategy documentation

### Files Updated

- `package.json` - Added `convert:composio` script
- (No schema changes required - all existing categories worked!)

## Performance

- **API Fetching**: ~3 seconds (1 request for 815 apps)
- **MDXLD Generation**: ~60 seconds (815 files, 10 per batch with 100ms delay)
- **Compilation**: ~60 seconds (827 successful compilations)
- **Total Time**: ~2 minutes from start to finish

## Integration Quality

### Strengths

✓ 100% Composio app coverage (815/815)
✓ 99.76% compilation success rate (827/829)
✓ Consistent MDXLD structure across all integrations
✓ Standard error handling and test scenarios
✓ Proper TypeScript typing
✓ Auth scheme mapping works for OAuth2 and API Key

### Areas for Improvement

- Base URLs need manual verification
- Generic "Action" resource less specific than ideal
- Webhook configuration is minimal
- Documentation could be richer with actual API examples

## Comparison with Manual Integrations

**Manual integrations** (first 50 created):

- Rich, detailed resource definitions
- Specific CRUD operations per resource
- Accurate base URLs and endpoints
- Comprehensive webhook event definitions
- Detailed test scenarios
- Complete documentation with examples

**Composio-generated integrations**:

- Generic action-based resource model
- Single "execute" operation
- Placeholder base URLs
- Generic webhook configuration
- Basic test scenarios
- Minimal documentation

**Recommendation**: Use Composio-generated integrations as a starting point, then enhance high-priority integrations with manual refinement.

## Maintenance

### Updating from Composio

To fetch latest apps and regenerate integrations:

```bash
cd ai/packages/integration-compiler
pnpm build
COMPOSIO_API_KEY=your_key pnpm convert:composio
node dist/cli/cli.js compile-all ../../integrations --output ../sdk.do/src/integrations
```

### Adding New Categories

If Composio adds categories not in our mapping:

1. Add to `CATEGORY_MAP` in `composio-converter.ts`
2. If needed, extend `IntegrationCategory` enum in `schema/integration.ts` and `schema/validator.ts`
3. Rebuild: `pnpm build`
4. Regenerate integrations

## License

MIT

## Credits

- **Composio**: For providing the comprehensive app catalog and API
- **MDXLD Format**: Semantic integration definition format for `.do` platform
- **Integration Compiler**: TypeScript code generator for integrations
