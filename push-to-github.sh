#!/usr/bin/env bash
set -e

# ==============================================================================
# Portfolify - Incremental 2-Day Git History & Sequential Push Script
#
# Creates a realistic 2-day commit timeline (Backend on Day 1, Frontend on Day 2)
# and pushes commits one-by-one to your GitHub repository.
#
# Usage:
#   ./push-to-github.sh <GITHUB_REPO_URL>
#   ./push-to-github.sh --dry-run
# ==============================================================================

REPO_URL="${1:-}"
DRY_RUN=false

if [ "$REPO_URL" = "--dry-run" ]; then
  DRY_RUN=true
  REPO_URL=""
fi

# 1. Prompt for GitHub repository URL if not supplied and not in dry-run mode
if [ -z "$REPO_URL" ] && [ "$DRY_RUN" = false ]; then
  echo ""
  echo "=========================================================="
  echo " Portfolify - GitHub Sequential Push"
  echo "=========================================================="
  echo ""
  read -rp "Enter your GitHub repository URL (e.g. git@github.com:username/portfolify.git): " REPO_URL
  if [ -z "$REPO_URL" ]; then
    echo "Error: Repository URL is required."
    exit 1
  fi
fi

# 2. Check Git configuration
if ! git config user.name > /dev/null 2>&1; then
  read -rp "Enter your Git commit name: " GIT_NAME
  git config user.name "$GIT_NAME"
fi

if ! git config user.email > /dev/null 2>&1; then
  read -rp "Enter your Git commit email: " GIT_MAIL
  git config user.email "$GIT_MAIL"
fi

# 3. Handle existing Git repository
BUILD_COMMITS=true
if [ -d ".git" ]; then
  COMMIT_COUNT=$(git rev-list --count HEAD 2>/dev/null || echo 0)
  if [ "$COMMIT_COUNT" -gt 0 ]; then
    echo ""
    echo "Found existing Git repository with $COMMIT_COUNT commits."
    echo "  1) Push existing commits directly one-by-one"
    echo "  2) Rebuild fresh 2-day commit history (backs up .git to .git.bak) and push"
    echo "  3) Cancel"
    read -rp "Select option [1/2/3] (default 1): " CHOICE
    CHOICE="${CHOICE:-1}"

    if [ "$CHOICE" = "1" ]; then
      BUILD_COMMITS=false
    elif [ "$CHOICE" = "2" ]; then
      rm -rf .git.bak
      mv .git .git.bak
      echo "Backed up existing .git to .git.bak"
      git init -b main
    else
      echo "Aborted."
      exit 0
    fi
  fi
else
  git init -b main
  echo "Initialized Git repository on branch 'main'."
fi

if [ "$BUILD_COMMITS" = true ]; then
  # Set timestamps: Day 1 (yesterday) and Day 2 (today)
  DATE_DAY1=$(date -d "1 day ago" +"%Y-%m-%d")
  DATE_DAY2=$(date +"%Y-%m-%d")
  TZ_OFFSET=$(date +"%z")

  commit_stage() {
    local msg="$1"
    local dt="$2"
    shift 2
    git add "$@"
    GIT_AUTHOR_DATE="$dt" GIT_COMMITTER_DATE="$dt" git commit -m "$msg" > /dev/null
    echo "  [OK] $dt - $msg"
  }

  echo ""
  echo "--> Creating 2-day staged commit history..."
  echo "    Day 1 (Backend & Infrastructure): $DATE_DAY1"
  echo "    Day 2 (Frontend & Layouts):       $DATE_DAY2"
  echo ""

  # ------------------------------------------------------------------------------
  # DAY 1: Backend Architecture & Infrastructure
  # ------------------------------------------------------------------------------

  # Commit 1
  commit_stage "chore: initial project configuration and dependencies" \
    "${DATE_DAY1} 09:30:00 ${TZ_OFFSET}" \
    package.json package-lock.json .gitignore .env.example LICENSE

  # Commit 2
  commit_stage "feat(server): setup express server, drizzle orm and postgres schema" \
    "${DATE_DAY1} 11:15:00 ${TZ_OFFSET}" \
    server/package.json server/package-lock.json server/tsconfig.json server/drizzle.config.ts server/src/db/ server/src/server.ts

  # Commit 3
  commit_stage "feat(server): integrate better-auth, session handlers and auth middleware" \
    "${DATE_DAY1} 13:40:00 ${TZ_OFFSET}" \
    server/src/config/ server/src/middleware/

  # Commit 4
  commit_stage "feat(server): implement portfolio crud, username reservations and content api" \
    "${DATE_DAY1} 15:30:00 ${TZ_OFFSET}" \
    server/src/controllers/ server/src/routes/ server/src/utils/

  # Commit 5
  commit_stage "feat(server): add ssr portfolio renderer, vanity routing and vitest suite" \
    "${DATE_DAY1} 17:50:00 ${TZ_OFFSET}" \
    server/src/services/ server/src/app.ts server/tests/

  # ------------------------------------------------------------------------------
  # DAY 2: Frontend Client, Design System, Templates & Application Views
  # ------------------------------------------------------------------------------

  # Commit 6
  commit_stage "feat(client): bootstrap react vite client with tailwind and oklch tokens" \
    "${DATE_DAY2} 09:20:00 ${TZ_OFFSET}" \
    client/package.json client/package-lock.json client/tsconfig.json client/vite.config.ts client/tailwind.config.js client/postcss.config.js client/index.html client/src/tokens.css client/src/base.css client/src/index.css client/src/main.tsx client/.env.example

  # Commit 7
  commit_stage "feat(client): build ui system, layout components, and auth/theme context" \
    "${DATE_DAY2} 11:10:00 ${TZ_OFFSET}" \
    client/src/context/ client/src/services/ client/src/utils/ client/src/components/layout/ client/src/components/ui/ client/src/components/portfolio/

  # Commit 8
  commit_stage "feat(templates): implement minimalist, terminal, and neo-brutalist templates" \
    "${DATE_DAY2} 13:00:00 ${TZ_OFFSET}" \
    client/src/templates/MinimalTemplate.tsx client/src/templates/TerminalTemplate.tsx client/src/templates/BrutalistTemplate.tsx

  # Commit 9
  commit_stage "feat(templates): implement glassmorphism and luxury templates with registry" \
    "${DATE_DAY2} 14:50:00 ${TZ_OFFSET}" \
    client/src/templates/GlassmorphicTemplate.tsx client/src/templates/LuxuryTemplate.tsx client/src/templates/templateRegistry.ts client/src/templates/TemplateRenderer.tsx client/src/templates/sampleData.ts

  # Commit 10
  commit_stage "feat(client): add live responsive preview frame, editor, and dashboard" \
    "${DATE_DAY2} 16:40:00 ${TZ_OFFSET}" \
    client/src/components/preview/ client/src/pages/editor/ client/src/pages/dashboard/ client/src/pages/settings/ client/src/pages/preview/ client/src/types/

  # Commit 11
  commit_stage "feat(client): implement landing page, public views, and auth flow" \
    "${DATE_DAY2} 18:30:00 ${TZ_OFFSET}" \
    client/src/pages/public/ client/src/pages/auth/ client/src/pages/templates/ client/src/App.tsx client/public/ client/vercel.json

  # Commit 12 (Catch all remaining & documentation)
  git add -A
  commit_stage "docs: add comprehensive readme and project documentation" \
    "${DATE_DAY2} 20:15:00 ${TZ_OFFSET}" \
    README.md

  echo ""
  echo "--> All 12 commits generated across 2 days."
  echo ""
  git log --oneline --graph --decorate
fi

if [ "$DRY_RUN" = true ]; then
  echo ""
  echo "Dry-run mode complete. No commits were pushed to remote."
  exit 0
fi

# ------------------------------------------------------------------------------
# SEQUENTIAL PUSH: Push commits one-by-one to remote
# ------------------------------------------------------------------------------

echo ""
echo "--> Setting up remote origin: $REPO_URL"
git remote remove origin 2>/dev/null || true
git remote add origin "$REPO_URL"

COMMITS=$(git rev-list --reverse HEAD)
TOTAL_COMMITS=$(echo "$COMMITS" | wc -w)
CURRENT=1

echo ""
echo "--> Pushing $TOTAL_COMMITS commits sequentially to GitHub..."
echo ""

for COMMIT in $COMMITS; do
  SHORT_HASH=$(echo "$COMMIT" | cut -c1-7)
  SUBJECT=$(git log -1 --pretty=format:"%s" "$COMMIT")
  COMMIT_DATE=$(git log -1 --pretty=format:"%ad" --date=short "$COMMIT")

  echo "[$CURRENT/$TOTAL_COMMITS] Pushing $SHORT_HASH ($COMMIT_DATE) - $SUBJECT"

  # Push this specific commit to remote main branch
  if ! git push -u origin "$COMMIT:refs/heads/main" 2>/dev/null; then
    # If the remote has default files, force-push the first commit
    if [ "$CURRENT" -eq 1 ]; then
      echo "  [Note] Remote branch has diverged. Force-pushing initial commit..."
      git push -f -u origin "$COMMIT:refs/heads/main"
    else
      echo "  [Error] Failed to push commit $SHORT_HASH. Retrying with force..."
      git push -f origin "$COMMIT:refs/heads/main"
    fi
  fi

  CURRENT=$((CURRENT + 1))
  sleep 1.5
done

# Ensure local main tracks remote main
git branch -u origin/main main >/dev/null 2>&1 || true

echo ""
echo "=========================================================="
echo " Successfully pushed all commits sequentially!"
echo " History displays naturally across 2 days on GitHub."
echo "=========================================================="
echo ""
