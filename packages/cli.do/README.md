# cli.do

**Command-line interface for sdk.do** - Execute SDK functions from the terminal with semantic syntax.

## Installation

```bash
# Global installation
pnpm add -g cli.do

# Project installation
pnpm add cli.do
```

## Configuration

Set your API key in environment variables:

```bash
# .env file
DO_API_KEY=your-api-key-here
DO_BASE_URL=https://rpc.do  # optional, defaults to https://rpc.do
```

Or export in your shell:

```bash
export DO_API_KEY=your-api-key-here
```

## Usage

The CLI is invoked with the `do` command:

```bash
do <command> [options]
```

## Commands

### Database Operations

#### List Entities

```bash
# List all businesses
do db list Business

# List with filters
do db list Product --where '{"category": "electronics", "inStock": true}'

# List with pagination
do db list User --limit 10 --offset 20

# Pretty JSON output
do db list Business --pretty
```

#### Get Entity

```bash
# Get by semantic type and ID
do db get Business acme-corp
do db get Person john-doe
do db get Product prod-123

# JSON output
do db get User user-456 --json
```

#### Create Entity

```bash
# Create with JSON data
do db create Business '{"name": "Acme Corp", "industry": "Technology"}'

# Create with semantic properties
do db create Person '{"$id": "jane-doe", "name": "Jane Doe", "email": "jane@example.com"}'

# Pretty output
do db create Product '{"name": "Laptop", "price": 999}' --pretty
```

#### Update Entity

```bash
# Update by type and ID
do db update Person john-doe '{"jobTitle": "Senior Engineer"}'
do db update Business acme-corp '{"employees": 150}'
```

#### Delete Entity

```bash
# Delete by type and ID
do db delete Person john-doe
do db delete Product prod-123
```

### AI Operations

#### Generate Text

```bash
# Simple generation
do ai generate "Write a haiku about code"

# With model selection
do ai generate "Explain quantum computing" --model claude-sonnet-4.5

# With temperature
do ai generate "Write a creative story" --temperature 0.9

# Structured output with schema
do ai generate "Create a blog post" --schema '{"type": "object", "properties": {"title": {"type": "string"}, "content": {"type": "string"}}}'

# JSON output
do ai generate "List 5 programming languages" --json --pretty
```

#### Create Embeddings

```bash
# Create embeddings for text
do ai embed "Hello world"

# With specific model
do ai embed "Machine learning is fascinating" --model text-embedding-3-large

# JSON output
do ai embed "Semantic search query" --json
```

### Function Execution

#### Execute Function

```bash
# Execute by ID
do functions execute fn_add_numbers '{"a": 5, "b": 3}'
do fn execute fn_validate_email '{"email": "user@example.com"}'

# With options
do functions execute fn_fetch_data '{"url": "https://api.example.com"}' --timeout 10000 --retries 3

# With trace ID
do fn execute fn_process_order '{"orderId": "123"}' --trace-id trace-abc-123

# Pretty output
do functions execute fn_analyze_data '{"data": [1,2,3]}' --pretty
```

#### List Functions

```bash
# List all functions
do functions list

# Filter by type
do fn list --type generative
do fn list --type agentic

# JSON output
do functions list --json --pretty
```

### Workflow Execution

#### Run Workflow

```bash
# Execute workflow
do workflows run processOrder '{"orderId": "order-123"}'
do wf run userOnboarding '{"email": "user@example.com", "name": "John Doe"}'

# With specific engine
do workflows run dataSync '{"source": "db1", "destination": "db2"}' --engine cloudflare

# Pretty output
do wf run importData '{"fileUrl": "https://example.com/data.csv"}' --pretty
```

### Event Publishing

#### Send Event

```bash
# Send semantic event
do send Order.created '{"orderId": "123", "total": 99.99}'
do send Invoice.paid '{"invoiceId": "456", "amount": 99.99}'
do send Customer.registered '{"email": "user@example.com"}'

# Complex event data
do send Shipment.delivered '{"orderId": "123", "trackingNumber": "TRACK123", "deliveredAt": "2025-10-11T12:00:00Z"}'
```

### Configuration

#### Set Configuration

```bash
# Set configuration value
do config set DO_API_KEY your-key-here
do config set DO_BASE_URL https://rpc.do
```

#### Get Configuration

```bash
# Get specific value
do config get DO_API_KEY
do config get DO_BASE_URL
```

#### List Configuration

```bash
# List all configuration
do config list
```

### Health Check

```bash
# Check API health
do health
```

## Output Formats

### Default Output

Plain text output for readability:

```bash
$ do db get Business acme-corp
{ id: 'acme-corp', name: 'Acme Corp', industry: 'Technology' }
```

### JSON Output

Machine-readable JSON:

```bash
$ do db list Business --json
[{"id":"acme-corp","name":"Acme Corp"},{"id":"tech-inc","name":"Tech Inc"}]
```

### Pretty JSON Output

Human-readable formatted JSON:

```bash
$ do db list Business --json --pretty
[
  {
    "id": "acme-corp",
    "name": "Acme Corp",
    "industry": "Technology"
  },
  {
    "id": "tech-inc",
    "name": "Tech Inc",
    "industry": "Software"
  }
]
```

## Common Workflows

### Creating a Business with Related Entities

```bash
# Create business
do db create Business '{"$id": "my-company", "name": "My Company"}'

# Create brand owned by business
do db create Brand '{"$id": "my-brand", "name": "My Brand", "owner": {"$type": "Business", "$id": "my-company"}}'

# Create person working for business
do db create Person '{"$id": "john-doe", "name": "John Doe", "worksFor": {"$type": "Business", "$id": "my-company"}}'
```

### Processing Orders with AI

```bash
# Generate order confirmation email
do ai generate "Write an order confirmation email for order #123" --model gpt-5

# Execute order processing workflow
do workflows run processOrder '{"orderId": "order-123"}'

# Send order created event
do send Order.created '{"orderId": "order-123", "customer": "customer-456"}'
```

### Data Analysis Pipeline

```bash
# Fetch data
do functions execute fn_fetch_analytics_data '{}'

# Generate insights with AI
do ai generate "Analyze this data and provide insights: [data]" --model claude-sonnet-4.5

# Save results
do db create AnalyticsReport '{"date": "2025-10-11", "insights": "..."}'
```

## Environment Variables

| Variable             | Description                         | Default          |
| -------------------- | ----------------------------------- | ---------------- |
| `DO_API_KEY`         | API key for authentication          | Required         |
| `DO_BASE_URL`        | Base URL for API requests           | `https://rpc.do` |
| `DO_ALLOW_ANONYMOUS` | Allow anonymous requests (dev only) | `false`          |

## Error Handling

The CLI provides clear error messages and exits with appropriate codes:

```bash
# Missing API key
$ do db list Business
Error: DO_API_KEY environment variable is required
Set DO_API_KEY in your .env file or environment

# Invalid JSON
$ do db create Business 'invalid json'
Invalid JSON: invalid json

# API error
$ do functions execute fn_nonexistent '{}'
✖ Failed to execute function
Function not found: fn_nonexistent
```

## Exit Codes

- `0` - Success
- `1` - Error (API error, invalid input, etc.)

## Scripting

The CLI is designed for use in shell scripts:

```bash
#!/bin/bash

# Fetch users and process them
USERS=$(do db list User --json)

# Parse with jq
echo "$USERS" | jq '.[] | .email'

# Execute function for each user
for user in $(echo "$USERS" | jq -r '.[] | @base64'); do
  _jq() {
    echo ${user} | base64 --decode | jq -r ${1}
  }

  EMAIL=$(_jq '.email')
  do functions execute fn_send_welcome_email "{\"email\": \"$EMAIL\"}"
done
```

## CI/CD Integration

Use in GitHub Actions:

```yaml
name: Deploy
on: push

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2

      - name: Install CLI
        run: pnpm add -g cli.do

      - name: Execute deployment workflow
        env:
          DO_API_KEY: ${{ secrets.DO_API_KEY }}
        run: |
          do workflows run deployToProduction '{"version": "${{ github.sha }}"}'
```

## Development

### Build

```bash
pnpm build
```

### Watch Mode

```bash
pnpm dev
```

### Test Locally

```bash
# Link globally
pnpm link --global

# Test commands
do health
do db list Business
```

## Aliases

Common command aliases:

- `fn` → `functions`
- `wf` → `workflows`

```bash
# These are equivalent
do functions execute fn_test '{}'
do fn execute fn_test '{}'

# These are equivalent
do workflows run myWorkflow '{}'
do wf run myWorkflow '{}'
```

## Advanced Usage

### Piping and Composition

```bash
# Get data, transform, and save
do db get Business acme-corp --json | jq '.employees' | xargs -I {} do db create Metric '{"type": "employees", "value": {}}'

# Batch operations
do db list User --json | jq -r '.[] | .id' | xargs -I {} do functions execute fn_send_notification '{"userId": "{}"}'
```

### Environment-Specific Configuration

```bash
# Development
DO_API_KEY=dev-key DO_BASE_URL=http://localhost:8787 do db list Business

# Production
DO_API_KEY=prod-key do db list Business
```

## Troubleshooting

### Command Not Found

```bash
# Ensure CLI is installed globally
pnpm add -g cli.do

# Or use with pnpm dlx
pnpm dlx cli.do db list Business
```

### Permission Denied

```bash
# Make sure the binary is executable
chmod +x node_modules/.bin/do
```

### API Connection Issues

```bash
# Check API health
do health

# Verify configuration
do config list

# Test with curl
curl https://rpc.do/health
```

## See Also

- [sdk.do](../sdk.do/) - TypeScript SDK
- [functions.do](../functions.do/) - Universal function abstraction
- [mcp.do](../mcp.do/) - Model Context Protocol server
- [rpc.do](../../content/rpc.do.mdx) - HTTP API documentation

## License

MIT
