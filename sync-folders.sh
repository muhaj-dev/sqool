

#!/bin/bash
set -e

# ===== CONFIG =====
ORIGINAL_REMOTE="https://github.com/sqoolify/fe-sqoolify.git"
TEMP_REMOTE="https://github.com/ajibadeabd/sqoolify-fe.git"
BRANCH="main"  # change this if you're working on a different branch
# ==================

echo "🚀 Starting sync process..."

# Ensure inside a Git repo
if [ ! -d .git ]; then
  echo "❌ Not a Git repository. Run this script inside your project folder."
  exit 1
fi

# Step 1: Ensure current remote is original
CURRENT_REMOTE=$(git remote get-url origin)
echo "🔗 Current remote: $CURRENT_REMOTE"

if [ "$CURRENT_REMOTE" != "$ORIGINAL_REMOTE" ]; then
  echo "⚠️ Remote does not match original, switching to $ORIGINAL_REMOTE..."
  git remote set-url origin "$ORIGINAL_REMOTE"
fi

# Step 2: Pull latest from original repo
echo "📥 Pulling latest changes from original repo..."
git pull origin "$BRANCH" --no-ff --rebase || echo "ℹ️ Nothing new to pull."

# Step 3: Temporarily switch to personal remote
echo "🔄 Switching remote to personal: $TEMP_REMOTE"
git remote set-url origin "$TEMP_REMOTE"

# Step 4: Push to personal repo
echo "📤 Pushing code to personal repo..."
git push origin "$BRANCH"

# Step 5: Restore original remote
echo "🔁 Restoring remote back to original..."
git remote set-url origin "$ORIGINAL_REMOTE"

# Step 6: Verify
NEW_REMOTE=$(git remote get-url origin)
echo "✅ Remote restored to: $NEW_REMOTE"
echo "🎉 Sync complete! Code successfully pulled from original and pushed to personal repo."
# dns1.p04.nsone.net