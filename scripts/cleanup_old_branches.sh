#!/bin/bash
set -euo pipefail

# Dependency check
command -v jq >/dev/null 2>&1 || { echo "Error: jq is required but not installed." >&2; exit 1; }

# Configuration
# Derive owner/repo from the current git remote URL (origin) to avoid hardcoding.
REMOTE_URL=$(git remote get-url origin 2>/dev/null || true)
if [ -z "$REMOTE_URL" ]; then
  echo "Error: Could not determine git remote 'origin' URL. Are you in a git repository?" >&2
  exit 1
fi

# Extract owner/repo from common git remote URL formats (SSH and HTTPS)
REPO=$(printf '%s\n' "$REMOTE_URL" | sed -E 's#(git@|ssh://git@|https?://)([^/:]+)[:/]([^/]+/[^.]+)(\.git)?#\3#')

if [ -z "$REPO" ]; then
  echo "Error: Failed to parse repository name from remote URL: $REMOTE_URL" >&2
  exit 1
fi

DRY_RUN=true

# Parse arguments
for arg in "$@"; do
  if [ "$arg" == "--force" ]; then
    DRY_RUN=false
  fi
done

# Calculate the date two weeks ago in Unix timestamp format
# This script uses the 'date' command which might differ slightly between Linux (GNU) and macOS (BSD).
if [[ "$OSTYPE" == "darwin"* ]]; then
  TWO_WEEKS_AGO=$(date -v-2w +%s)
else
  TWO_WEEKS_AGO=$(date -d "2 weeks ago" +%s)
fi

echo "================================================="
if [ "$DRY_RUN" = true ]; then
  echo "🔍 DRY RUN: No branches will be actually deleted."
  echo "Run with --force to execute deletions."
else
  echo "⚠️  FORCE MODE: Branches WILL be deleted from origin!"
fi
echo "================================================="

# If running in force mode, require an explicit confirmation before proceeding.
if [ "$DRY_RUN" = false ]; then
  echo ""
  echo "This will delete remote branches from 'origin' in repository '$REPO'."
  echo "These deletions are immediate and cannot be easily undone."
  echo ""
  echo "To proceed, type 'yes' and press Enter. Any other response will abort."
  printf "Confirm deletion: "
  read -t 30 -r confirmation || { echo ""; echo "Timed out waiting for confirmation. Aborting."; exit 1; }
  if [ "$confirmation" != "yes" ]; then
    echo "Aborting cleanup; no branches were deleted."
    exit 1
  fi
  echo "Proceeding with forced deletion of eligible branches..."
  echo "================================================="
fi

echo "Deleting branches older than 2 weeks or with failed CI..."
echo "Reference timestamp: $TWO_WEEKS_AGO"
echo ""

# Ensure remote-tracking branches are up to date
echo "Fetching latest branches from origin (with prune)..."
git fetch --prune origin

# Get all remote branches with their committerdate in Unix timestamp format
git for-each-ref --format='%(committerdate:unix) %(refname:lstrip=3)' refs/remotes/origin | while read -r branch_date branch_name; do

  # Skip HEAD, master, and main to be safe
  if [[ "$branch_name" == "HEAD" || "$branch_name" == "master" || "$branch_name" == "main" || "$branch_name" == "" ]]; then
    continue
  fi

  # 1. Check if the branch is older than 2 weeks
  is_old=false
  if (( branch_date < TWO_WEEKS_AGO )); then
    is_old=true
  fi

  # 2. Check CI status using GitHub API (only for non-old branches to conserve rate limit quota)
  is_failed=false
  ci_status=""
  if [ "$is_old" = false ]; then
    # URL-encode the branch name (replace '/' with '%2F') for use in the API URL
    encoded_branch_name="${branch_name//\//%2F}"
    api_url="https://api.github.com/repos/$REPO/commits/$encoded_branch_name/status"

    # Fetch CI status and capture HTTP status code; pass auth header if token is available
    if [[ -n "${GITHUB_TOKEN:-}" ]]; then
      api_response=$(curl -sS -H "Authorization: Bearer $GITHUB_TOKEN" "$api_url" -w " HTTPSTATUS:%{http_code}") || api_response=""
    else
      api_response=$(curl -sS "$api_url" -w " HTTPSTATUS:%{http_code}") || api_response=""
    fi
    http_status="${api_response##*HTTPSTATUS:}"
    response_body="${api_response% HTTPSTATUS:*}"

    if [[ -z "$api_response" || ! "$http_status" =~ ^[0-9]+$ || "$http_status" -lt 200 || "$http_status" -ge 300 ]]; then
      # Network or HTTP error – treat as failed to be conservative
      echo "Warning: Failed to fetch CI status for branch '$branch_name' (HTTP $http_status). Treating as failed."
      is_failed=true
    else
      # Use jq to robustly parse the combined state from the JSON response
      ci_status=$(printf '%s' "$response_body" | jq -r '.state // empty')

      # Treat failure-like states as failed CI
      if [[ "$ci_status" == "failure" || "$ci_status" == "error" || "$ci_status" == "cancelled" ]]; then
        is_failed=true
      fi
    fi
  fi

  # Determine if we should delete
  should_delete=false
  reason=""

  if [ "$is_old" = true ]; then
    should_delete=true
    reason="Older than 2 weeks"
  elif [ "$is_failed" = true ]; then
    should_delete=true
    reason="Failed CI status"
  fi

  if [ "$should_delete" = true ]; then
    if [[ "$OSTYPE" == "darwin"* ]]; then
      human_date=$(date -r "$branch_date" '+%Y-%m-%d %H:%M:%S')
    else
      human_date=$(date -d "@$branch_date" '+%Y-%m-%d %H:%M:%S')
    fi

    echo "Marked for deletion: $branch_name"
    echo "  Reason: $reason"
    echo "  Last commit: $human_date"
    echo "  CI Status: ${ci_status:-unknown}"

    if [ "$DRY_RUN" = false ]; then
      # Execute the delete command
      if git push origin --delete "$branch_name"; then
        echo "  ✅ Successfully deleted $branch_name"
      else
        echo "  ❌ Failed to delete $branch_name"
      fi
    else
      echo "  [DRY RUN] Would run: git push origin --delete $branch_name"
    fi
    echo "----------------------------------------"
  fi
done

echo "Cleanup complete!"
