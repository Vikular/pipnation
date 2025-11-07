// (unused backup) Minimal Edge Function implementation using native Deno HTTP routing
// Provides: health, user signup, user profile fetch
// To deploy: replace existing index.ts with this file's contents or rename this to index.ts
// Dependencies resolved via direct URL imports (no Hono, no npm/jsr bundling issues)

import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.8';

// Environment variables expected (set in Supabase dashboard):
// SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY

const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY');
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('Missing required env vars SUPABASE_URL or SUPABASE_ANON_KEY');
}

const anonClient = SUPABASE_URL && SUPABASE_ANON_KEY
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

const serviceClient = SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY
  ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
  : null;

function jsonResponse(body: any, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  });
}

async function handleHealth(): Promise<Response> {
  return jsonResponse({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    config: {
      hasUrl: !!SUPABASE_URL,
      hasAnonKey: !!SUPABASE_ANON_KEY,
      hasServiceRole: !!SUPABASE_SERVICE_ROLE_KEY,
      ready: !!SUPABASE_URL && !!SUPABASE_ANON_KEY
    }
  });
}

interface SignupPayload {
  email: string;
  password: string;
  firstName?: string;
  country?: string;
  signupData?: Record<string, any>;
}

async function handleSignup(req: Request): Promise<Response> {
  if (req.method !== 'POST') return jsonResponse({ error: 'Method not allowed' }, 405);
  if (!serviceClient) return jsonResponse({ error: 'Server configuration error' }, 500);

  let payload: SignupPayload;
  try {
    payload = await req.json();
  } catch {
    return jsonResponse({ error: 'Invalid JSON body' }, 400);
  }

  const email = payload.email?.trim().toLowerCase();
  const { password, firstName, country, signupData } = payload;

  if (!email || !password || !firstName) {
    return jsonResponse({ error: 'email, password, and firstName are required' }, 400);
  }
  if (password.length < 6) {
    return jsonResponse({ error: 'Password must be at least 6 characters long' }, 400);
  }

  // Create auth user
  const { data: authData, error: authError } = await serviceClient.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      firstName,
      country: country || 'US',
      ...signupData
    }
  });

  if (authError) {
    return jsonResponse({ error: authError.message }, 400);
  }
  const userId = authData.user?.id;
  if (!userId) {
    return jsonResponse({ error: 'Failed to create user' }, 500);
  }

  // Store profile in KV table
  const profile = {
    userId,
    email,
    firstName,
    country: country || 'US',
    role: 'lead',
    badge: 'none',
    enrolledCourses: [],
    coursesCompleted: [],
    completedLessons: [],
    progress: {
      foundation: { completed: 0, total: 0 },
      advanced: { completed: 0, total: 0 },
      beginners: { completed: 0, total: 0 },
      strategy: { completed: 0, total: 0 }
    },
    quizScores: {},
    paymentHistory: [],
    createdAt: new Date().toISOString()
  };

  const { error: upsertError } = await serviceClient.from('kv_store_0991178c').upsert({
    key: `user:${userId}`,
    value: profile
  });

  if (upsertError) {
    return jsonResponse({ error: 'User created but profile store failed', details: upsertError.message }, 500);
  }

  return jsonResponse({ userId, email, message: 'Signup successful' }, 201);
}

async function handleGetProfile(pathParts: string[], req: Request): Promise<Response> {
  if (req.method !== 'GET') return jsonResponse({ error: 'Method not allowed' }, 405);
  if (!anonClient || !serviceClient) return jsonResponse({ error: 'Server configuration error' }, 500);

  const userId = pathParts[3]; // /make-server-0991178c/user/:userId
  if (!userId) return jsonResponse({ error: 'Missing userId' }, 400);

  const authHeader = req.headers.get('Authorization');
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!token) return jsonResponse({ error: 'Missing auth token' }, 401);

  const { data: userResult, error: userError } = await anonClient.auth.getUser(token);
  if (userError || !userResult.user) {
    return jsonResponse({ error: 'Invalid or expired token' }, 401);
  }

  // Allow self or admin (role in metadata)
  const requesterId = userResult.user.id;
  const requesterRole = (userResult.user.user_metadata as any)?.role || 'lead';
  if (requesterId !== userId && requesterRole !== 'admin') {
    return jsonResponse({ error: 'Forbidden' }, 403);
  }

  const { data, error } = await serviceClient
    .from('kv_store_0991178c')
    .select('value')
    .eq('key', `user:${userId}`)
    .maybeSingle();

  if (error) return jsonResponse({ error: error.message }, 500);
  if (!data) return jsonResponse({ error: 'Profile not found' }, 404);

  return jsonResponse(data.value);
}

function matchRoute(url: URL): { handler: (req: Request) => Promise<Response> | Response } | null {
  const pathname = url.pathname;
  if (pathname === '/make-server-0991178c/health') return { handler: handleHealth };
  if (pathname === '/make-server-0991178c/user/signup') return { handler: handleSignup };
  if (pathname.startsWith('/make-server-0991178c/user/')) return { handler: (req) => handleGetProfile(pathname.split('/'), req) };
  return null;
}

serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      }
    });
  }

  const url = new URL(req.url);
  const route = matchRoute(url);
  if (!route) return jsonResponse({ error: 'Not found' }, 404);

  try {
    return await route.handler(req);
  } catch (err) {
    console.error('Unhandled error:', err);
    return jsonResponse({ error: 'Internal server error' }, 500);
  }
});
