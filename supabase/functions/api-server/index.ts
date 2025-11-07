// @ts-nocheck
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY');
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

let anonClient = null;
let serviceClient = null;

try {
  if (SUPABASE_URL && SUPABASE_ANON_KEY) {
    anonClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
  if (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
    serviceClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  }
} catch (e) {
  console.error('Failed to create Supabase clients:', e);
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

async function health() {
  return json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    config: {
      hasUrl: !!SUPABASE_URL,
      hasAnonKey: !!SUPABASE_ANON_KEY,
      hasServiceRole: !!SUPABASE_SERVICE_ROLE_KEY,
      ready: !!SUPABASE_URL && !!SUPABASE_ANON_KEY,
    },
  });
}

async function signup(req: Request) {
  if (!serviceClient) return json({ error: 'Server misconfigured' }, 500);
  let body: any; try { body = await req.json(); } catch { return json({ error: 'Invalid JSON' }, 400); }
  const email = body.email?.trim().toLowerCase();
  const { password, firstName, country, signupData } = body;
  if (!email || !password || !firstName) return json({ error: 'email, password, firstName required' }, 400);
  if (password.length < 6) return json({ error: 'Password >= 6 chars required' }, 400);

  const { data, error } = await serviceClient.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { firstName, country: country || 'US', ...signupData },
  });
  if (error) return json({ error: error.message }, 400);
  const userId = data.user?.id; if (!userId) return json({ error: 'User creation failed' }, 500);

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
      strategy: { completed: 0, total: 0 },
    },
    quizScores: {},
    paymentHistory: [],
    createdAt: new Date().toISOString(),
  };

  const { error: upsertError } = await serviceClient.from('kv_store_0991178c').upsert({ key: `user:${userId}`, value: profile });
  if (upsertError) return json({ error: 'Profile store failed', details: upsertError.message }, 500);
  return json({ userId, email, message: 'Signup successful' }, 201);
}

async function getProfile(urlParts: string[], req: Request) {
  if (!anonClient || !serviceClient) return json({ error: 'Server misconfigured' }, 500);
  
  const userId = urlParts[3];
  if (!userId) {
    console.error('❌ Missing userId in URL');
    return json({ error: 'Missing userId' }, 400);
  }
  
  const authHeader = req.headers.get('Authorization');
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!token) {
    console.error('❌ Missing auth token');
    return json({ error: 'Missing auth token' }, 401);
  }
  
  // Validate token
  console.log(`🔍 Validating token for user: ${userId}`);
  const { data, error } = await anonClient.auth.getUser(token);
  
  if (error) {
    console.error('❌ Token validation error:', error.message);
    return json({ error: 'Invalid or expired token', details: error.message }, 401);
  }
  
  if (!data.user) {
    console.error('❌ No user data from token');
    return json({ error: 'Invalid token' }, 401);
  }
  
  const requesterId = data.user.id;
  console.log(`✅ Token valid for user: ${requesterId}`);
  
  // Check authorization
  const requesterRole = (data.user.user_metadata as any)?.role || 'lead';
  if (requesterId !== userId && requesterRole !== 'admin') {
    console.error(`❌ Forbidden: ${requesterId} trying to access ${userId}`);
    return json({ error: 'Forbidden' }, 403);
  }
  
  // Fetch profile
  console.log(`🔍 Fetching profile for: ${userId}`);
  const { data: row, error: rowErr } = await serviceClient
    .from('kv_store_0991178c')
    .select('value')
    .eq('key', `user:${userId}`)
    .maybeSingle();
    
  if (rowErr) {
    console.error('❌ Database error:', rowErr.message);
    return json({ error: rowErr.message }, 500);
  }
  
  if (!row) {
    console.error(`❌ Profile not found for user: ${userId}`);
    return json({ error: 'Profile not found' }, 404);
  }
  
  console.log(`✅ Profile found for: ${userId}`);
  return json(row.value);
}

function match(url: URL) {
  const p = url.pathname;
  if (p === '/health' || p.endsWith('/health')) return health;
  if (p === '/user/signup' || p.endsWith('/user/signup')) return signup;
  if (p.includes('/user/') && !p.endsWith('/signup')) return (req: Request) => getProfile(p.split('/'), req);
  return null;
}

Deno.serve((req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    }});
  }
  const url = new URL(req.url);
  const handler = match(url);
  if (!handler) return json({ error: 'Not found' }, 404);
  return handler(req);
});