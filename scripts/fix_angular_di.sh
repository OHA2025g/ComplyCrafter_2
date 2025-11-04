#!/bin/bash

# Script to fix Angular DI error by clearing all caches
set -e

echo "╔══════════════════════════════════════════════════════════════════╗"
echo "║                                                                  ║"
echo "║           🔧 Fixing Angular DI Error (NG0202) 🔧                 ║"
echo "║                                                                  ║"
echo "╚══════════════════════════════════════════════════════════════════╝"
echo ""

cd "$(dirname "$0")/../frontend"

echo "📦 Step 1: Clearing Angular build cache..."
rm -rf .angular 2>/dev/null || true
echo "   ✅ .angular directory cleared"

echo ""
echo "📦 Step 2: Clearing Node.js cache..."
rm -rf node_modules/.cache 2>/dev/null || true
echo "   ✅ node_modules/.cache cleared"

echo ""
echo "📦 Step 3: Clearing dist directory..."
rm -rf dist 2>/dev/null || true
echo "   ✅ dist directory cleared"

echo ""
echo "📦 Step 4: Clearing NX cache..."
rm -rf .nx 2>/dev/null || true
npx nx reset 2>/dev/null || true
echo "   ✅ NX cache cleared"

echo ""
echo "╔══════════════════════════════════════════════════════════════════╗"
echo "║                                                                  ║"
echo "║                  ✅ Cache Cleared Successfully!                  ║"
echo "║                                                                  ║"
echo "╚══════════════════════════════════════════════════════════════════╝"
echo ""
echo "🔧 CODE FIXES APPLIED:"
echo "   ✅ CompaniesService updated to use inject() function"
echo "   ✅ CompanyMasterComponent updated to use inject() function"
echo ""
echo "🚀 NEXT STEPS:"
echo ""
echo "   1. Make sure your dev server is stopped (Ctrl+C)"
echo ""
echo "   2. Start the dev server again:"
echo "      cd frontend"
echo "      npm start"
echo "      (or: npx nx serve portal)"
echo ""
echo "   3. Wait for compilation to complete"
echo ""
echo "   4. Open browser and navigate to:"
echo "      http://localhost:4200/masters/company"
echo ""
echo "   5. Hard refresh in browser (Ctrl+Shift+R or Cmd+Shift+R)"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "💡 If you still see the error after these steps:"
echo ""
echo "   Run a full reinstall:"
echo "   cd frontend"
echo "   rm -rf node_modules package-lock.json"
echo "   npm install"
echo "   npm start"
echo ""

