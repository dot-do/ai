#!/bin/bash

# Advanced Data Pipeline Example using cli.do

set -e  # Exit on error

echo "=== Data Pipeline Demo ==="
echo ""

# Step 1: Fetch data
echo "Step 1: Fetching user data..."
USERS=$(do db list User --where '{"status": "active"}' --json)
USER_COUNT=$(echo "$USERS" | jq '. | length')
echo "Found $USER_COUNT active users"

# Step 2: Process each user
echo ""
echo "Step 2: Processing users..."
echo "$USERS" | jq -c '.[]' | while read -r user; do
  USER_ID=$(echo "$user" | jq -r '.id')
  USER_EMAIL=$(echo "$user" | jq -r '.email')

  echo "Processing user: $USER_ID ($USER_EMAIL)"

  # Generate personalized content with AI
  PROMPT="Generate a personalized welcome message for a user named $(echo "$user" | jq -r '.name')"
  MESSAGE=$(do ai generate "$PROMPT" --model gpt-5 --json | jq -r '.text')

  # Execute function to send email
  do functions execute fn_send_email "{\"to\": \"$USER_EMAIL\", \"subject\": \"Welcome!\", \"body\": \"$MESSAGE\"}" > /dev/null

  echo "  ✓ Sent welcome email to $USER_EMAIL"
done

# Step 3: Generate analytics report
echo ""
echo "Step 3: Generating analytics report..."
ANALYTICS=$(do functions execute fn_generate_analytics_report '{"date": "'$(date +%Y-%m-%d)'"}' --json)
echo "$ANALYTICS" | jq '.'

# Step 4: Save report
echo ""
echo "Step 4: Saving report..."
REPORT_ID=$(echo "$ANALYTICS" | jq -r '.reportId')
do db create AnalyticsReport "{\"id\": \"$REPORT_ID\", \"date\": \"$(date +%Y-%m-%d)\", \"data\": $(echo "$ANALYTICS" | jq -c '.')}" --pretty

# Step 5: Send completion event
echo ""
echo "Step 5: Sending completion event..."
do send Pipeline.completed "{\"pipelineId\": \"user-welcome-$(date +%s)\", \"processedUsers\": $USER_COUNT}"

echo ""
echo "=== Pipeline Complete ==="
echo "Processed $USER_COUNT users"
echo "Report ID: $REPORT_ID"
