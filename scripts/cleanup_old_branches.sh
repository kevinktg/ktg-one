#!/bin/bash

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
echo "Deleting branches older than 2 weeks or with failed CI..."
echo "Reference timestamp: $TWO_WEEKS_AGO"
echo ""

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

  # 2. Check CI status using GitHub API
  is_failed=false
  # We query the commit status API. `state` at the root object indicates the combined status.
  status=$(curl -sL "https://api.github.com/repos/$REPO/commits/$branch_name/status" | grep -m 1 '"state":' | awk -F'"' '{print $4}')
  if [ "$status" == "failure" ]; then
    is_failed=true
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
    echo "  CI Status: ${status:-unknown}"

    if [ "$DRY_RUN" = false ]; then
      # Execute the delete command
      git push origin --delete "$branch_name"

      if [ $? -eq 0 ]; then
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
