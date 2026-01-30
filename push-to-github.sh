#!/bin/bash
# Run this script in your terminal to add this project to GitHub as a new repo.
# Usage: ./push-to-github.sh [repo-name]
# Example: ./push-to-github.sh use-case-scanner

set -e
cd "$(dirname "$0")"

REPO_NAME="${1:-use-case-scanner}"

echo "→ Initializing Git..."
git init 2>/dev/null || true
git add .
if git diff --staged --quiet 2>/dev/null; then
  echo "Nothing new to commit (already committed?)."
else
  git commit -m "Initial commit: Use Case Scanner"
fi

echo ""
echo "→ Creating GitHub repo and pushing..."
if command -v gh &>/dev/null; then
  if gh auth status &>/dev/null; then
    gh repo create "$REPO_NAME" --public --source=. --remote=origin --push
    echo ""
    echo "Done. Repo: https://github.com/$(gh api user -q .login)/$REPO_NAME"
  else
    echo "GitHub CLI is installed but not logged in. Run: gh auth login"
    echo "Then run this script again, or run:"
    echo "  git remote add origin https://github.com/YOUR_USERNAME/$REPO_NAME.git"
    echo "  git branch -M main"
    echo "  git push -u origin main"
  fi
else
  echo "Create a new repo at https://github.com/new named: $REPO_NAME"
  echo "Then run:"
  echo "  git remote add origin https://github.com/YOUR_USERNAME/$REPO_NAME.git"
  echo "  git branch -M main"
  echo "  git push -u origin main"
fi
