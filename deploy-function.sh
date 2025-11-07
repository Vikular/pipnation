#!/bin/bash

echo "🚀 Deploying Supabase Edge Function..."
echo ""
echo "First, you need to login to Supabase CLI:"
echo "1. Go to: https://app.supabase.com/account/tokens"
echo "2. Click 'Generate New Token'"
echo "3. Name it 'CLI Access'"
echo "4. Copy the token (starts with sbp_)"
echo ""
echo "Then run: supabase login"
echo "And paste your token when prompted."
echo ""
echo "After logging in, run this script again to deploy."
echo ""

# Check if logged in
if ! supabase projects list &>/dev/null; then
    echo "❌ Not logged in to Supabase CLI"
    echo "Please run: supabase login"
    exit 1
fi

echo "✅ Logged in to Supabase"
echo ""

# Link project
echo "🔗 Linking project..."
supabase link --project-ref oexhltmmtcplmzxeymio

# Deploy function
echo "📦 Deploying Edge Function..."
cd supabase/functions
supabase functions deploy make-server-0991178c --no-verify-jwt

echo ""
echo "✅ Deployment complete!"
echo ""
echo "Test the health endpoint:"
echo "curl 'https://oexhltmmtcplmzxeymio.supabase.co/functions/v1/make-server-0991178c/make-server-0991178c/health'"
