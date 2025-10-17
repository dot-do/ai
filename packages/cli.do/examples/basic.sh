#!/bin/bash

# Basic CLI Examples for cli.do

echo "=== Health Check ==="
do health

echo ""
echo "=== Database Operations ==="

# List businesses
echo "Listing businesses:"
do db list Business --pretty

# Get specific business
echo "Getting business:"
do db get Business acme-corp --pretty

# Create business
echo "Creating business:"
do db create Business '{"$id": "new-company", "name": "New Company", "industry": "Technology"}' --pretty

# Update business
echo "Updating business:"
do db update Business new-company '{"employees": 50}' --pretty

echo ""
echo "=== AI Operations ==="

# Generate text
echo "Generating text:"
do ai generate "Write a haiku about programming" --model gpt-5 --pretty

# Create embeddings
echo "Creating embeddings:"
do ai embed "Hello world" --json --pretty

echo ""
echo "=== Function Execution ==="

# Execute function
echo "Executing function:"
do functions execute fn_add_numbers '{"a": 5, "b": 3}' --pretty

echo ""
echo "=== Workflow Execution ==="

# Run workflow
echo "Running workflow:"
do workflows run processOrder '{"orderId": "order-123"}' --pretty

echo ""
echo "=== Event Publishing ==="

# Send event
echo "Sending event:"
do send Order.created '{"orderId": "order-456", "total": 99.99}'

echo ""
echo "Done!"
