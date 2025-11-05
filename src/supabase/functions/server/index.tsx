import { Hono } from "npm:hono@4";
import { cors } from "npm:hono@4/cors";
import { logger } from "npm:hono@4/logger";
import { createClient } from "jsr:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Enable logger for debugging
app.use('*', logger(console.log));

// Enable CORS for all routes
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Create Supabase client for auth operations (using anon key)
const getSupabaseClient = () => {
  const url = Deno.env.get('SUPABASE_URL');
  const key = Deno.env.get('SUPABASE_ANON_KEY');
  
  if (!url || !key) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_ANON_KEY');
  }
  
  return createClient(url, key);
};

// Note: KV store operations use SUPABASE_SERVICE_ROLE_KEY automatically
// This is defined in kv_store.tsx and is necessary for database writes

// Verify user token and return user
const verifyUser = async (accessToken: string) => {
  if (!accessToken) {
    throw new Error('No access token provided');
  }
  
  const supabase = getSupabaseClient();
  const { data: { user }, error } = await supabase.auth.getUser(accessToken);
  
  if (error || !user) {
    throw new Error('Invalid or expired token');
  }
  
  return user;
};

// ==================== PUBLIC ENDPOINTS ====================

// Health check endpoint
app.get("/make-server-0991178c/health", async (c) => {
  const hasUrl = !!Deno.env.get('SUPABASE_URL');
  const hasAnonKey = !!Deno.env.get('SUPABASE_ANON_KEY');
  
  return c.json({ 
    status: "healthy",
    timestamp: new Date().toISOString(),
    config: {
      hasUrl,
      hasAnonKey,
      ready: hasUrl && hasAnonKey,
    }
  });
});

// Create user with auto-confirmed email (called from frontend during signup)
app.post("/make-server-0991178c/user/signup", async (c) => {
  try {
    const { email: rawEmail, password, firstName, country, signupData } = await c.req.json();
    
    // Normalize email (trim and lowercase)
    const email = rawEmail?.trim().toLowerCase();
    
    console.log('📝 Signup request:', { email, firstName });
    
    // Validation
    if (!email || !password || !firstName) {
      return c.json({ error: "email, password, and firstName are required" }, 400);
    }
    
    // Validate password strength
    if (password.length < 6) {
      return c.json({ error: "Password must be at least 6 characters long" }, 400);
    }

    // Create Supabase client with SERVICE ROLE for admin operations
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('❌ Missing Supabase credentials');
      return c.json({ error: "Server configuration error" }, 500);
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Create user with auto-confirmed email
    // Note: If user already exists, Supabase will return an error
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email since we don't have email server configured
      user_metadata: {
        firstName,
        country: country || 'US',
        fullName: signupData?.fullName,
        tradingExperience: signupData?.tradingExperience,
        tradingGoals: signupData?.tradingGoals,
        tradingGoalsOther: signupData?.tradingGoalsOther,
        currentKnowledge: signupData?.currentKnowledge,
        phoneNumber: signupData?.phoneNumber,
        whatsappNumber: signupData?.whatsappNumber,
        tradingPreferences: signupData?.tradingPreferences,
        tradingPreferencesOther: signupData?.tradingPreferencesOther,
      }
    });

    if (authError) {
      console.error('❌ Supabase auth error:', authError);
      // Check for duplicate user error
      if (authError.message?.includes('already') || authError.message?.includes('duplicate') || authError.message?.includes('exists')) {
        return c.json({ error: 'User with this email already exists. Please log in instead.' }, 400);
      }
      return c.json({ error: authError.message }, 400);
    }

    if (!authData.user?.id) {
      console.error('❌ No user created');
      return c.json({ error: "User creation failed" }, 500);
    }

    console.log('✅ User created in Supabase Auth:', authData.user.id);

    // Check if profile already exists
    let existingProfile;
    try {
      existingProfile = await kv.get(`user:${authData.user.id}`);
    } catch (kvError) {
      console.error('❌ KV get error:', kvError);
    }
    
    if (!existingProfile) {
      // Create user profile in KV store
      const userProfile = {
        userId: authData.user.id,
        email,
        firstName,
        country: country || 'US',
        role: 'lead',
        badge: 'free-trial',
        createdAt: new Date().toISOString(),
        progress: {
          foundation: { completed: 0, total: 12 },
          advanced: { completed: 0, total: 15 },
          beginners: { completed: 0, total: 12 },
          strategy: { completed: 0, total: 17 },
        },
        completedLessons: [],
        quizScores: {},
        enrolledCourses: [],
        coursesCompleted: [],
        paymentHistory: [],
        signupData: signupData || {},
      };

      try {
        await kv.set(`user:${authData.user.id}`, userProfile);
        console.log('✅ Profile created in KV store');
      } catch (kvError) {
        console.error('❌ KV set error:', kvError);
        return c.json({ 
          error: "Database error while creating profile",
          details: kvError instanceof Error ? kvError.message : String(kvError)
        }, 500);
      }
    } else {
      console.log('⚠️ Profile already exists');
    }
    
    return c.json({ 
      message: "User created successfully",
      userId: authData.user.id,
      email: authData.user.email,
      role: 'lead'
    });
  } catch (error) {
    console.error('❌ Signup exception:', error);
    return c.json({ 
      error: error instanceof Error ? error.message : String(error)
    }, 500);
  }
});

// Create user profile (called after Supabase signup from frontend) - LEGACY, kept for compatibility
app.post("/make-server-0991178c/user/create", async (c) => {
  try {
    const { userId, email, firstName, country, signupData } = await c.req.json();
    
    console.log('📝 Create profile request:', { userId, email, firstName });
    
    // Validation
    if (!userId || !email || !firstName) {
      return c.json({ error: "userId, email, and firstName are required" }, 400);
    }

    // Check if profile already exists
    let existingProfile;
    try {
      existingProfile = await kv.get(`user:${userId}`);
    } catch (kvError) {
      console.error('❌ KV get error:', kvError);
      return c.json({ 
        error: "Database error while checking existing profile",
        details: kvError instanceof Error ? kvError.message : String(kvError)
      }, 500);
    }
    
    if (existingProfile) {
      console.log('⚠️ Profile already exists:', userId);
      return c.json({ 
        message: "Profile already exists",
        userId,
        role: existingProfile.role
      });
    }
    
    // Create user profile in KV store
    const userProfile = {
      userId,
      email,
      firstName,
      country: country || 'US',
      role: 'lead',
      badge: 'free-trial',
      createdAt: new Date().toISOString(),
      progress: {
        foundation: { completed: 0, total: 12 },
        advanced: { completed: 0, total: 15 },
        beginners: { completed: 0, total: 12 },
        strategy: { completed: 0, total: 17 },
      },
      completedLessons: [],
      quizScores: {},
      enrolledCourses: [],
      coursesCompleted: [],
      paymentHistory: [],
      signupData: signupData || {},
    };

    try {
      await kv.set(`user:${userId}`, userProfile);
      console.log('✅ Profile created in KV store');
    } catch (kvError) {
      console.error('❌ KV set error:', kvError);
      return c.json({ 
        error: "Database error while creating profile",
        details: kvError instanceof Error ? kvError.message : String(kvError)
      }, 500);
    }
    
    return c.json({ 
      message: "Profile created successfully",
      userId,
      role: 'lead'
    });
  } catch (error) {
    console.error('❌ Create profile exception:', error);
    return c.json({ 
      error: error instanceof Error ? error.message : String(error)
    }, 500);
  }
});

// Note: Sign in is now handled directly from frontend using Supabase client
// This keeps auth simple and avoids CORS/token issues

// ==================== AUTHENTICATED ENDPOINTS ====================

// Get user profile
app.get("/make-server-0991178c/user/:userId", async (c) => {
  try {
    const userId = c.req.param('userId');
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: "No authorization token" }, 401);
    }

    // Verify the token
    const user = await verifyUser(accessToken);
    
    // Users can only access their own profile (unless admin)
    if (user.id !== userId) {
      const requesterProfile = await kv.get(`user:${user.id}`);
      if (!requesterProfile || requesterProfile.role !== 'admin') {
        return c.json({ error: "Unauthorized" }, 403);
      }
    }

    const profile = await kv.get(`user:${userId}`);
    
    if (!profile) {
      return c.json({ error: "User profile not found" }, 404);
    }

    return c.json(profile);
  } catch (error) {
    console.error('❌ Get profile error:', error);
    return c.json({ 
      error: error instanceof Error ? error.message : "Unauthorized"
    }, 401);
  }
});

// Update user role
app.post("/make-server-0991178c/user/:userId/role", async (c) => {
  try {
    const userId = c.req.param('userId');
    const { newRole } = await c.req.json();
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: "No authorization token" }, 401);
    }

    const user = await verifyUser(accessToken);

    const profile = await kv.get(`user:${userId}`);
    
    if (!profile) {
      return c.json({ error: "User not found" }, 404);
    }

    profile.role = newRole;
    profile.roleUpdatedAt = new Date().toISOString();
    
    await kv.set(`user:${userId}`, profile);
    
    return c.json({ message: "Role updated successfully", role: newRole });
  } catch (error) {
    console.error('❌ Update role error:', error);
    return c.json({ error: error instanceof Error ? error.message : "Unauthorized" }, 401);
  }
});

// Mark lesson as complete
app.post("/make-server-0991178c/progress/lesson", async (c) => {
  try {
    const { userId, courseLevel, lessonId } = await c.req.json();
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: "No authorization token" }, 401);
    }

    const user = await verifyUser(accessToken);
    
    if (user.id !== userId) {
      return c.json({ error: "Unauthorized" }, 403);
    }

    const profile = await kv.get(`user:${userId}`);
    
    if (!profile) {
      return c.json({ error: "User not found" }, 404);
    }

    // Add lesson to completed list if not already there
    if (!profile.completedLessons.includes(lessonId)) {
      profile.completedLessons.push(lessonId);
      
      // Update progress count for paid courses
      if (courseLevel === 'beginners') {
        profile.progress.beginners.completed = Math.min(
          profile.progress.beginners.completed + 1,
          profile.progress.beginners.total
        );
      } else if (courseLevel === 'strategy') {
        profile.progress.strategy.completed = Math.min(
          profile.progress.strategy.completed + 1,
          profile.progress.strategy.total
        );
      } else if (courseLevel === 'foundation') {
        profile.progress.foundation.completed = Math.min(
          profile.progress.foundation.completed + 1,
          profile.progress.foundation.total
        );
      } else if (courseLevel === 'advanced') {
        profile.progress.advanced.completed = Math.min(
          profile.progress.advanced.completed + 1,
          profile.progress.advanced.total
        );
      }
      
      await kv.set(`user:${userId}`, profile);
    }
    
    return c.json({ 
      message: "Progress updated",
      progress: profile.progress
    });
  } catch (error) {
    console.error('❌ Update lesson error:', error);
    return c.json({ error: error instanceof Error ? error.message : "Unauthorized" }, 401);
  }
});

// Submit quiz score
app.post("/make-server-0991178c/quiz/submit", async (c) => {
  try {
    const { userId, quizId, score, courseLevel } = await c.req.json();
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: "No authorization token" }, 401);
    }

    const user = await verifyUser(accessToken);
    
    if (user.id !== userId) {
      return c.json({ error: "Unauthorized" }, 403);
    }

    const profile = await kv.get(`user:${userId}`);
    
    if (!profile) {
      return c.json({ error: "User not found" }, 404);
    }

    profile.quizScores[quizId] = {
      score,
      date: new Date().toISOString(),
      passed: score >= 80
    };

    // Check if foundation final exam passed - unlock advanced
    if (quizId === 'f12' && score >= 80 && profile.progress.foundation.completed === profile.progress.foundation.total) {
      profile.advancedUnlocked = true;
    }
    
    await kv.set(`user:${userId}`, profile);
    
    return c.json({ 
      message: "Quiz submitted",
      passed: score >= 80,
      advancedUnlocked: profile.advancedUnlocked || false
    });
  } catch (error) {
    console.error('❌ Submit quiz error:', error);
    return c.json({ error: error instanceof Error ? error.message : "Unauthorized" }, 401);
  }
});

// Submit FTMO proof
app.post("/make-server-0991178c/ftmo/submit", async (c) => {
  try {
    const { userId, proofUrl, notes } = await c.req.json();
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: "No authorization token" }, 401);
    }

    const user = await verifyUser(accessToken);
    
    if (user.id !== userId) {
      return c.json({ error: "Unauthorized" }, 403);
    }

    const submissionId = `ftmo:${userId}:${Date.now()}`;
    const submission = {
      submissionId,
      userId,
      proofUrl,
      notes,
      status: 'pending',
      submittedAt: new Date().toISOString(),
    };

    await kv.set(submissionId, submission);
    
    return c.json({ 
      message: "FTMO proof submitted successfully",
      submissionId
    });
  } catch (error) {
    console.error('❌ Submit FTMO error:', error);
    return c.json({ error: error instanceof Error ? error.message : "Unauthorized" }, 401);
  }
});

// ==================== ADMIN ENDPOINTS ====================

// Get all users (admin only)
app.get("/make-server-0991178c/admin/users", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: "No authorization token" }, 401);
    }

    const user = await verifyUser(accessToken);
    const profile = await kv.get(`user:${user.id}`);
    
    if (!profile || profile.role !== 'admin') {
      return c.json({ error: "Admin access required" }, 403);
    }

    const users = await kv.getByPrefix('user:');
    
    return c.json(users);
  } catch (error) {
    console.error('❌ Get users error:', error);
    return c.json({ error: error instanceof Error ? error.message : "Unauthorized" }, 401);
  }
});

// Get comprehensive students data (admin only)
app.get("/make-server-0991178c/admin/students/data", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: "No authorization token" }, 401);
    }

    const user = await verifyUser(accessToken);
    const profile = await kv.get(`user:${user.id}`);
    
    if (!profile || profile.role !== 'admin') {
      return c.json({ error: "Admin access required" }, 403);
    }

    const users = await kv.getByPrefix('user:');
    
    // Enhance student data with additional calculated fields
    const studentsData = users.map(student => ({
      ...student,
      totalProgress: {
        beginners: student.progress?.beginners || { completed: 0, total: 12 },
        strategy: student.progress?.strategy || { completed: 0, total: 17 },
      },
      enrolledCourses: student.enrolledCourses || [],
      coursesCompleted: student.coursesCompleted || [],
      paymentHistory: student.paymentHistory || [],
      signupData: student.signupData || {},
    }));
    
    return c.json(studentsData);
  } catch (error) {
    console.error('❌ Get students data error:', error);
    return c.json({ error: error instanceof Error ? error.message : "Unauthorized" }, 401);
  }
});

// Get pending FTMO submissions (admin only)
app.get("/make-server-0991178c/admin/ftmo/pending", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: "No authorization token" }, 401);
    }

    const user = await verifyUser(accessToken);
    const profile = await kv.get(`user:${user.id}`);
    
    if (!profile || profile.role !== 'admin') {
      return c.json({ error: "Admin access required" }, 403);
    }

    const submissions = await kv.getByPrefix('ftmo:');
    const pendingSubmissions = submissions.filter(s => s.status === 'pending');
    
    return c.json(pendingSubmissions);
  } catch (error) {
    console.error('❌ Get FTMO submissions error:', error);
    return c.json({ error: error instanceof Error ? error.message : "Unauthorized" }, 401);
  }
});

// Verify FTMO submission (admin only)
app.post("/make-server-0991178c/admin/ftmo/verify", async (c) => {
  try {
    const { submissionId, approved } = await c.req.json();
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: "No authorization token" }, 401);
    }

    const user = await verifyUser(accessToken);
    const adminProfile = await kv.get(`user:${user.id}`);
    
    if (!adminProfile || adminProfile.role !== 'admin') {
      return c.json({ error: "Admin access required" }, 403);
    }

    const submission = await kv.get(submissionId);
    if (!submission) {
      return c.json({ error: "Submission not found" }, 404);
    }

    submission.status = approved ? 'approved' : 'rejected';
    submission.verifiedAt = new Date().toISOString();
    submission.verifiedBy = user.id;
    
    await kv.set(submissionId, submission);

    // If approved, upgrade user to Pro Trader
    if (approved) {
      const userProfile = await kv.get(`user:${submission.userId}`);
      if (userProfile) {
        userProfile.role = 'pro-trader';
        userProfile.roleUpdatedAt = new Date().toISOString();
        await kv.set(`user:${submission.userId}`, userProfile);
      }
    }
    
    return c.json({ 
      message: approved ? "User promoted to Pro Trader" : "Submission rejected",
      status: submission.status
    });
  } catch (error) {
    console.error('❌ Verify FTMO error:', error);
    return c.json({ error: error instanceof Error ? error.message : "Unauthorized" }, 401);
  }
});

// Upload course material (admin only)
app.post("/make-server-0991178c/admin/course/upload", async (c) => {
  try {
    const { courseId, lessonId, materialType, title, description, url, order } = await c.req.json();
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: "No authorization token" }, 401);
    }

    const user = await verifyUser(accessToken);
    const profile = await kv.get(`user:${user.id}`);
    
    if (!profile || profile.role !== 'admin') {
      return c.json({ error: "Admin access required" }, 403);
    }

    const materialId = `material:${courseId}:${lessonId}:${Date.now()}`;
    const material = {
      materialId,
      courseId,
      lessonId,
      materialType,
      title,
      description,
      url,
      order: order || 0,
      uploadedBy: user.id,
      uploadedAt: new Date().toISOString(),
    };

    await kv.set(materialId, material);
    
    return c.json({ 
      message: "Course material uploaded successfully",
      materialId,
      material,
    });
  } catch (error) {
    console.error('❌ Upload material error:', error);
    return c.json({ error: error instanceof Error ? error.message : "Unauthorized" }, 401);
  }
});

// Get course materials
app.get("/make-server-0991178c/course/:courseId/materials", async (c) => {
  try {
    const courseId = c.req.param('courseId');
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: "No authorization token" }, 401);
    }

    const user = await verifyUser(accessToken);
    const profile = await kv.get(`user:${user.id}`);
    
    if (!profile) {
      return c.json({ error: "User not found" }, 404);
    }

    // Check if user has access to this course
    if (!profile.enrolledCourses.includes(courseId) && profile.role !== 'admin') {
      return c.json({ error: "Not enrolled in this course" }, 403);
    }

    const materials = await kv.getByPrefix(`material:${courseId}:`);
    const sortedMaterials = materials.sort((a, b) => (a.order || 0) - (b.order || 0));
    
    return c.json(sortedMaterials);
  } catch (error) {
    console.error('❌ Get materials error:', error);
    return c.json({ error: error instanceof Error ? error.message : "Unauthorized" }, 401);
  }
});

// ==================== ADMIN BOOTSTRAP (ONE-TIME USE) ====================

// Bootstrap admin user (ONLY use this ONCE to create your first admin)
app.post("/make-server-0991178c/bootstrap-admin", async (c) => {
  try {
    const { email: rawEmail, password, firstName, country } = await c.req.json();
    
    // Normalize email
    const email = rawEmail?.trim().toLowerCase();
    
    console.log('🔐 Bootstrap admin request:', { email, firstName });
    
    // Validation
    if (!email || !password || !firstName) {
      return c.json({ error: "email, password, and firstName are required" }, 400);
    }
    
    if (password.length < 6) {
      return c.json({ error: "Password must be at least 6 characters" }, 400);
    }

    // Create Supabase client with SERVICE ROLE
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseServiceKey) {
      return c.json({ error: "Server configuration error" }, 500);
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Create admin user with auto-confirmed email
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { firstName, country: country || 'US' }
    });

    if (authError) {
      console.error('❌ Admin creation error:', authError);
      if (authError.message?.includes('already')) {
        return c.json({ error: 'User already exists. Use the /upgrade-to-admin endpoint instead.' }, 400);
      }
      return c.json({ error: authError.message }, 400);
    }

    if (!authData.user?.id) {
      return c.json({ error: "User creation failed" }, 500);
    }

    console.log('✅ Admin user created in Supabase Auth:', authData.user.id);

    // Create ADMIN profile in KV store
    const adminProfile = {
      userId: authData.user.id,
      email,
      firstName,
      country: country || 'US',
      role: 'admin', // 👑 ADMIN ROLE
      badge: 'admin',
      createdAt: new Date().toISOString(),
      progress: {
        foundation: { completed: 0, total: 12 },
        advanced: { completed: 0, total: 15 },
        beginners: { completed: 0, total: 12 },
        strategy: { completed: 0, total: 17 },
      },
      completedLessons: [],
      quizScores: {},
      enrolledCourses: ['beginners', 'strategy'], // Admin has access to all courses
      coursesCompleted: [],
      paymentHistory: [],
    };

    await kv.set(`user:${authData.user.id}`, adminProfile);
    console.log('✅ Admin profile created in KV store');
    
    return c.json({ 
      success: true,
      message: "🎉 Admin user created successfully!",
      email,
      userId: authData.user.id,
      role: 'admin',
      instructions: "You can now log in with this email and password. This bootstrap endpoint should not be used again."
    });
  } catch (error) {
    console.error('❌ Bootstrap admin error:', error);
    return c.json({ 
      error: error instanceof Error ? error.message : String(error)
    }, 500);
  }
});

// Upgrade existing user to admin (use if you already have an account)
app.post("/make-server-0991178c/upgrade-to-admin", async (c) => {
  try {
    const { email: rawEmail, secretKey } = await c.req.json();
    
    const email = rawEmail?.trim().toLowerCase();
    
    // Simple security: require a secret key (you can change this)
    if (secretKey !== 'pip-nation-admin-2024') {
      return c.json({ error: "Invalid secret key" }, 403);
    }
    
    // Find user by email
    const allUsers = await kv.getByPrefix('user:');
    const userProfile = allUsers.find(u => u.email?.toLowerCase() === email);
    
    if (!userProfile) {
      return c.json({ error: "User not found with that email" }, 404);
    }
    
    // Upgrade to admin
    userProfile.role = 'admin';
    userProfile.badge = 'admin';
    userProfile.enrolledCourses = ['beginners', 'strategy']; // Give access to all courses
    userProfile.upgradedToAdminAt = new Date().toISOString();
    
    await kv.set(`user:${userProfile.userId}`, userProfile);
    
    console.log('✅ User upgraded to admin:', email);
    
    return c.json({
      success: true,
      message: "🎉 User upgraded to admin successfully!",
      email,
      userId: userProfile.userId,
      role: 'admin'
    });
  } catch (error) {
    console.error('❌ Upgrade to admin error:', error);
    return c.json({ 
      error: error instanceof Error ? error.message : String(error)
    }, 500);
  }
});

// ==================== ENHANCED ADMIN ENDPOINTS ====================

// Get live user activity (admin only)
app.get("/make-server-0991178c/admin/activity/live", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: "No authorization token" }, 401);
    }

    const user = await verifyUser(accessToken);
    const profile = await kv.get(`user:${user.id}`);
    
    if (!profile || profile.role !== 'admin') {
      return c.json({ error: "Admin access required" }, 403);
    }

    // Get all user sessions from last 24 hours
    const sessions = await kv.getByPrefix('session:');
    const now = Date.now();
    const oneDayAgo = now - (24 * 60 * 60 * 1000);
    
    const recentSessions = sessions.filter(session => {
      const sessionTime = new Date(session.loginTime).getTime();
      return sessionTime > oneDayAgo;
    });

    return c.json({
      activeSessions: recentSessions.filter(s => !s.logoutTime),
      recentLogins: recentSessions.slice(0, 20),
      totalActive: recentSessions.filter(s => !s.logoutTime).length,
    });
  } catch (error) {
    console.error('❌ Get live activity error:', error);
    return c.json({ error: error instanceof Error ? error.message : "Unauthorized" }, 401);
  }
});

// Get user full profile details (admin only)
app.get("/make-server-0991178c/admin/user/:userId/full", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const targetUserId = c.req.param('userId');
    
    if (!accessToken) {
      return c.json({ error: "No authorization token" }, 401);
    }

    const user = await verifyUser(accessToken);
    const adminProfile = await kv.get(`user:${user.id}`);
    
    if (!adminProfile || adminProfile.role !== 'admin') {
      return c.json({ error: "Admin access required" }, 403);
    }

    const targetProfile = await kv.get(`user:${targetUserId}`);
    
    if (!targetProfile) {
      return c.json({ error: "User not found" }, 404);
    }

    // Get user's sessions
    const allSessions = await kv.getByPrefix('session:');
    const userSessions = allSessions.filter(s => s.userId === targetUserId);

    // Get user's FTMO submissions
    const ftmoSubmissions = await kv.getByPrefix('ftmo:');
    const userFTMO = ftmoSubmissions.filter(f => f.userId === targetUserId);

    return c.json({
      ...targetProfile,
      sessions: userSessions.slice(0, 10), // Last 10 sessions
      ftmoSubmissions: userFTMO,
      lastLogin: userSessions[0]?.loginTime || null,
    });
  } catch (error) {
    console.error('❌ Get full profile error:', error);
    return c.json({ error: error instanceof Error ? error.message : "Unauthorized" }, 401);
  }
});

// Bulk user status update (admin only)
app.post("/make-server-0991178c/admin/users/bulk-update", async (c) => {
  try {
    const { userIds, updates } = await c.req.json();
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: "No authorization token" }, 401);
    }

    const user = await verifyUser(accessToken);
    const adminProfile = await kv.get(`user:${user.id}`);
    
    if (!adminProfile || adminProfile.role !== 'admin') {
      return c.json({ error: "Admin access required" }, 403);
    }

    const results = [];
    
    for (const userId of userIds) {
      try {
        const profile = await kv.get(`user:${userId}`);
        
        if (profile) {
          // Apply updates
          Object.assign(profile, updates);
          profile.lastUpdatedBy = user.id;
          profile.lastUpdatedAt = new Date().toISOString();
          
          await kv.set(`user:${userId}`, profile);
          results.push({ userId, success: true });
        } else {
          results.push({ userId, success: false, error: 'User not found' });
        }
      } catch (err) {
        results.push({ userId, success: false, error: err.message });
      }
    }

    return c.json({
      success: true,
      updated: results.filter(r => r.success).length,
      failed: results.filter(r => !r.success).length,
      results,
    });
  } catch (error) {
    console.error('❌ Bulk update error:', error);
    return c.json({ error: error instanceof Error ? error.message : "Unauthorized" }, 401);
  }
});

// Suspend/Activate user account (admin only)
app.post("/make-server-0991178c/admin/user/:userId/status", async (c) => {
  try {
    const { status, reason } = await c.req.json(); // status: 'active' | 'suspended'
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const targetUserId = c.req.param('userId');
    
    if (!accessToken) {
      return c.json({ error: "No authorization token" }, 401);
    }

    const user = await verifyUser(accessToken);
    const adminProfile = await kv.get(`user:${user.id}`);
    
    if (!adminProfile || adminProfile.role !== 'admin') {
      return c.json({ error: "Admin access required" }, 403);
    }

    const targetProfile = await kv.get(`user:${targetUserId}`);
    
    if (!targetProfile) {
      return c.json({ error: "User not found" }, 404);
    }

    targetProfile.accountStatus = status;
    targetProfile.statusReason = reason;
    targetProfile.statusChangedBy = user.id;
    targetProfile.statusChangedAt = new Date().toISOString();
    
    await kv.set(`user:${targetUserId}`, targetProfile);

    return c.json({
      success: true,
      message: `User ${status === 'suspended' ? 'suspended' : 'activated'} successfully`,
      userId: targetUserId,
      status,
    });
  } catch (error) {
    console.error('❌ User status change error:', error);
    return c.json({ error: error instanceof Error ? error.message : "Unauthorized" }, 401);
  }
});

// Delete user (admin only)
app.delete("/make-server-0991178c/admin/user/:userId", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const targetUserId = c.req.param('userId');
    
    if (!accessToken) {
      return c.json({ error: "No authorization token" }, 401);
    }

    const user = await verifyUser(accessToken);
    const adminProfile = await kv.get(`user:${user.id}`);
    
    if (!adminProfile || adminProfile.role !== 'admin') {
      return c.json({ error: "Admin access required" }, 403);
    }

    // Prevent admin from deleting themselves
    if (targetUserId === user.id) {
      return c.json({ error: "Cannot delete your own account" }, 400);
    }

    const targetProfile = await kv.get(`user:${targetUserId}`);
    
    if (!targetProfile) {
      return c.json({ error: "User not found" }, 404);
    }

    console.log(`🗑️ Admin ${user.id} deleting user ${targetUserId}`);

    // Delete user from KV store
    await kv.del(`user:${targetUserId}`);

    // Delete all user sessions
    const allSessions = await kv.getByPrefix('session:');
    const userSessions = allSessions.filter(s => s.userId === targetUserId);
    for (const session of userSessions) {
      const sessionKey = `session:${session.userId}:${new Date(session.loginTime).getTime()}`;
      await kv.del(sessionKey);
    }

    // Delete all payment receipts
    const allReceipts = await kv.getByPrefix('payment_receipt:');
    const userReceipts = allReceipts.filter(r => r.userId === targetUserId);
    for (const receipt of userReceipts) {
      await kv.del(`payment_receipt:${receipt.receiptId}`);
    }

    // Delete user from Supabase Auth
    try {
      const supabaseUrl = Deno.env.get('SUPABASE_URL');
      const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
      
      if (supabaseUrl && supabaseServiceKey) {
        const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
        const { error: deleteAuthError } = await supabaseAdmin.auth.admin.deleteUser(targetUserId);
        
        if (deleteAuthError) {
          console.error('⚠️ Failed to delete user from Supabase Auth:', deleteAuthError);
          // Continue anyway as we've already deleted from KV store
        } else {
          console.log('✅ User deleted from Supabase Auth');
        }
      }
    } catch (authError) {
      console.error('⚠️ Error deleting from Supabase Auth:', authError);
      // Continue anyway
    }

    return c.json({
      success: true,
      message: `User ${targetProfile.email} deleted successfully`,
      deletedUserId: targetUserId,
    });
  } catch (error) {
    console.error('❌ User deletion error:', error);
    return c.json({ error: error instanceof Error ? error.message : "Failed to delete user" }, 500);
  }
});

// Get analytics data (admin only)
app.get("/make-server-0991178c/admin/analytics", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: "No authorization token" }, 401);
    }

    const user = await verifyUser(accessToken);
    const adminProfile = await kv.get(`user:${user.id}`);
    
    if (!adminProfile || adminProfile.role !== 'admin') {
      return c.json({ error: "Admin access required" }, 403);
    }

    const users = await kv.getByPrefix('user:');
    const sessions = await kv.getByPrefix('session:');
    
    // Calculate analytics
    const totalUsers = users.length;
    const totalRevenue = users.reduce((sum, u) => {
      return sum + (u.paymentHistory?.reduce((pSum, p) => pSum + p.amount, 0) || 0);
    }, 0);
    
    const usersByRole = users.reduce((acc, u) => {
      acc[u.role] = (acc[u.role] || 0) + 1;
      return acc;
    }, {});

    const usersByCountry = users.reduce((acc, u) => {
      acc[u.country] = (acc[u.country] || 0) + 1;
      return acc;
    }, {});

    // New signups per day (last 30 days)
    const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
    const recentSignups = users.filter(u => {
      const createdTime = new Date(u.createdAt).getTime();
      return createdTime > thirtyDaysAgo;
    });

    const signupsByDate = recentSignups.reduce((acc, u) => {
      const date = new Date(u.createdAt).toISOString().split('T')[0];
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});

    return c.json({
      totalUsers,
      totalRevenue,
      usersByRole,
      usersByCountry,
      signupsByDate,
      averageRevenuePerUser: totalRevenue / totalUsers || 0,
      conversionRate: (users.filter(u => u.role !== 'lead').length / totalUsers * 100) || 0,
    });
  } catch (error) {
    console.error('❌ Get analytics error:', error);
    return c.json({ error: error instanceof Error ? error.message : "Unauthorized" }, 401);
  }
});

// Broadcast message to users (admin only)
app.post("/make-server-0991178c/admin/broadcast", async (c) => {
  try {
    const { message, targetRole, targetUsers } = await c.req.json();
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: "No authorization token" }, 401);
    }

    const user = await verifyUser(accessToken);
    const adminProfile = await kv.get(`user:${user.id}`);
    
    if (!adminProfile || adminProfile.role !== 'admin') {
      return c.json({ error: "Admin access required" }, 403);
    }

    const broadcast = {
      id: `broadcast:${Date.now()}`,
      message,
      targetRole,
      targetUsers,
      sentBy: user.id,
      sentAt: new Date().toISOString(),
      type: 'admin-broadcast',
    };

    await kv.set(broadcast.id, broadcast);

    return c.json({
      success: true,
      message: 'Broadcast sent successfully',
      broadcastId: broadcast.id,
    });
  } catch (error) {
    console.error('❌ Broadcast error:', error);
    return c.json({ error: error instanceof Error ? error.message : "Unauthorized" }, 401);
  }
});

// Manual payment verification (admin only)
app.post("/make-server-0991178c/admin/payment/verify", async (c) => {
  try {
    const { userId, courseId, amount, notes } = await c.req.json();
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: "No authorization token" }, 401);
    }

    const user = await verifyUser(accessToken);
    const adminProfile = await kv.get(`user:${user.id}`);
    
    if (!adminProfile || adminProfile.role !== 'admin') {
      return c.json({ error: "Admin access required" }, 403);
    }

    const targetProfile = await kv.get(`user:${userId}`);
    
    if (!targetProfile) {
      return c.json({ error: "User not found" }, 404);
    }

    // Manually enroll user in course
    if (!targetProfile.enrolledCourses.includes(courseId)) {
      targetProfile.enrolledCourses.push(courseId);
    }

    // Add payment record
    const payment = {
      amount,
      courseId,
      status: 'verified',
      verifiedBy: user.id,
      verifiedAt: new Date().toISOString(),
      notes,
      method: 'manual-verification',
    };

    if (!targetProfile.paymentHistory) {
      targetProfile.paymentHistory = [];
    }
    targetProfile.paymentHistory.push(payment);

    // Update role if needed
    if (targetProfile.role === 'lead') {
      targetProfile.role = 'student';
      targetProfile.badge = 'beginner';
    }

    await kv.set(`user:${userId}`, targetProfile);

    return c.json({
      success: true,
      message: 'Payment verified and user enrolled',
      userId,
      courseId,
    });
  } catch (error) {
    console.error('❌ Manual payment verification error:', error);
    return c.json({ error: error instanceof Error ? error.message : "Unauthorized" }, 401);
  }
});

// Upgrade user level/badge (admin only)
app.post("/make-server-0991178c/admin/user/:userId/upgrade-level", async (c) => {
  try {
    const { level, badge } = await c.req.json();
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const targetUserId = c.req.param('userId');
    
    if (!accessToken) {
      return c.json({ error: "No authorization token" }, 401);
    }

    const user = await verifyUser(accessToken);
    const adminProfile = await kv.get(`user:${user.id}`);
    
    if (!adminProfile || adminProfile.role !== 'admin') {
      return c.json({ error: "Admin access required" }, 403);
    }

    const targetProfile = await kv.get(`user:${targetUserId}`);
    
    if (!targetProfile) {
      return c.json({ error: "User not found" }, 404);
    }

    // Valid levels and badges
    const validLevels = ['lead', 'student', 'pro-trader', 'funded-trader', 'admin'];
    const validBadges = ['free-trial', 'beginner', 'intermediate', 'advanced', 'pro-trader', 'admin'];

    if (level && !validLevels.includes(level)) {
      return c.json({ error: "Invalid level" }, 400);
    }

    if (badge && !validBadges.includes(badge)) {
      return c.json({ error: "Invalid badge" }, 400);
    }

    // Update level and/or badge
    if (level) {
      targetProfile.role = level;
      console.log(`✅ User ${targetUserId} level upgraded to: ${level}`);
    }
    
    if (badge) {
      targetProfile.badge = badge;
      console.log(`✅ User ${targetUserId} badge upgraded to: ${badge}`);
    }

    targetProfile.levelUpgradedBy = user.id;
    targetProfile.levelUpgradedAt = new Date().toISOString();
    
    await kv.set(`user:${targetUserId}`, targetProfile);

    return c.json({
      success: true,
      message: `User level ${level ? 'upgraded to ' + level : ''} ${badge ? 'badge set to ' + badge : ''}`,
      userId: targetUserId,
      newLevel: targetProfile.role,
      newBadge: targetProfile.badge,
    });
  } catch (error) {
    console.error('❌ User level upgrade error:', error);
    return c.json({ error: error instanceof Error ? error.message : "Unauthorized" }, 401);
  }
});

// Grant course access (admin only)
app.post("/make-server-0991178c/admin/user/:userId/grant-course", async (c) => {
  try {
    const { courseId, reason } = await c.req.json();
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const targetUserId = c.req.param('userId');
    
    if (!accessToken) {
      return c.json({ error: "No authorization token" }, 401);
    }

    const user = await verifyUser(accessToken);
    const adminProfile = await kv.get(`user:${user.id}`);
    
    if (!adminProfile || adminProfile.role !== 'admin') {
      return c.json({ error: "Admin access required" }, 403);
    }

    const targetProfile = await kv.get(`user:${targetUserId}`);
    
    if (!targetProfile) {
      return c.json({ error: "User not found" }, 404);
    }

    // Handle "free-trial" special case - downgrade user and remove paid access
    if (courseId === 'free-trial') {
      // Remove all paid courses
      targetProfile.enrolledCourses = [];
      
      // Downgrade to lead with free-trial badge
      targetProfile.role = 'lead';
      targetProfile.badge = 'free-trial';
      
      // Log the downgrade
      if (!targetProfile.courseAccessGrants) {
        targetProfile.courseAccessGrants = [];
      }
      
      targetProfile.courseAccessGrants.push({
        courseId: 'free-trial',
        grantedBy: user.id,
        grantedAt: new Date().toISOString(),
        reason: reason || 'Downgraded to free trial',
      });
      
      await kv.set(`user:${targetUserId}`, targetProfile);

      console.log(`✅ User ${targetUserId} downgraded to free trial`);

      return c.json({
        success: true,
        message: 'User downgraded to free trial. All paid course access removed.',
        userId: targetUserId,
        role: 'lead',
        badge: 'free-trial',
        enrolledCourses: [],
      });
    }

    // Valid paid courses
    const validCourses = ['beginners', 'strategy'];

    if (!validCourses.includes(courseId)) {
      return c.json({ error: "Invalid course ID. Use 'beginners', 'strategy', or 'free-trial'" }, 400);
    }

    // Grant course access if not already enrolled
    if (!targetProfile.enrolledCourses) {
      targetProfile.enrolledCourses = [];
    }

    if (!targetProfile.enrolledCourses.includes(courseId)) {
      targetProfile.enrolledCourses.push(courseId);
      console.log(`✅ User ${targetUserId} granted access to course: ${courseId}`);
    } else {
      return c.json({ 
        success: true, 
        message: 'User already has access to this course',
        alreadyEnrolled: true,
      });
    }

    // Upgrade role if still a lead
    if (targetProfile.role === 'lead') {
      targetProfile.role = 'student';
      targetProfile.badge = 'beginner';
    }

    // Log the grant
    if (!targetProfile.courseAccessGrants) {
      targetProfile.courseAccessGrants = [];
    }
    
    targetProfile.courseAccessGrants.push({
      courseId,
      grantedBy: user.id,
      grantedAt: new Date().toISOString(),
      reason: reason || 'Admin manual grant',
    });
    
    await kv.set(`user:${targetUserId}`, targetProfile);

    return c.json({
      success: true,
      message: `Access granted to ${courseId} course`,
      userId: targetUserId,
      courseId,
      enrolledCourses: targetProfile.enrolledCourses,
    });
  } catch (error) {
    console.error('❌ Grant course access error:', error);
    return c.json({ error: error instanceof Error ? error.message : "Unauthorized" }, 401);
  }
});

// Revoke course access (admin only)
app.post("/make-server-0991178c/admin/user/:userId/revoke-course", async (c) => {
  try {
    const { courseId, reason } = await c.req.json();
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const targetUserId = c.req.param('userId');
    
    if (!accessToken) {
      return c.json({ error: "No authorization token" }, 401);
    }

    const user = await verifyUser(accessToken);
    const adminProfile = await kv.get(`user:${user.id}`);
    
    if (!adminProfile || adminProfile.role !== 'admin') {
      return c.json({ error: "Admin access required" }, 403);
    }

    const targetProfile = await kv.get(`user:${targetUserId}`);
    
    if (!targetProfile) {
      return c.json({ error: "User not found" }, 404);
    }

    // Remove course from enrolledCourses
    if (targetProfile.enrolledCourses && targetProfile.enrolledCourses.includes(courseId)) {
      targetProfile.enrolledCourses = targetProfile.enrolledCourses.filter((c: string) => c !== courseId);
      console.log(`✅ User ${targetUserId} course access revoked: ${courseId}`);
    } else {
      return c.json({ 
        success: true, 
        message: 'User does not have access to this course',
        notEnrolled: true,
      });
    }

    // Log the revocation
    if (!targetProfile.courseAccessRevocations) {
      targetProfile.courseAccessRevocations = [];
    }
    
    targetProfile.courseAccessRevocations.push({
      courseId,
      revokedBy: user.id,
      revokedAt: new Date().toISOString(),
      reason: reason || 'Admin manual revocation',
    });
    
    await kv.set(`user:${targetUserId}`, targetProfile);

    return c.json({
      success: true,
      message: `Access revoked for ${courseId} course`,
      userId: targetUserId,
      courseId,
      enrolledCourses: targetProfile.enrolledCourses,
    });
  } catch (error) {
    console.error('❌ Revoke course access error:', error);
    return c.json({ error: error instanceof Error ? error.message : "Unauthorized" }, 401);
  }
});

// Submit pending payment (no receipt upload required)
app.post("/make-server-0991178c/payment/submit-pending", async (c) => {
  try {
    const { userId, courseId, amount, paymentMethod } = await c.req.json();
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: "No authorization token" }, 401);
    }

    const user = await verifyUser(accessToken);
    
    if (user.id !== userId) {
      return c.json({ error: "Unauthorized" }, 403);
    }

    // Get user profile
    const userProfile = await kv.get(`user:${userId}`);
    
    if (!userProfile) {
      return c.json({ error: "User not found" }, 404);
    }

    // Create pending payment record
    const paymentId = `payment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const expiresAt = new Date(Date.now() + (24 * 60 * 60 * 1000)).toISOString(); // 24 hours

    const pendingPayment = {
      paymentId,
      receiptId: paymentId, // For compatibility with existing system
      userId,
      courseId,
      amount,
      paymentMethod,
      status: 'pending',
      receiptPath: '', // No receipt
      fileName: 'Pending Verification',
      fileType: 'pending',
      notes: `Payment submitted via ${paymentMethod}. Awaiting admin verification.`,
      submittedAt: new Date().toISOString(),
      expiresAt,
      userEmail: userProfile.email,
      userName: userProfile.firstName,
      userCountry: userProfile.country || 'Unknown',
    };

    await kv.set(`payment_receipt:${paymentId}`, pendingPayment);

    console.log(`✅ Pending payment created: ${paymentId} for user ${userId}`);

    return c.json({
      success: true,
      message: 'Payment submitted successfully. Awaiting admin approval.',
      paymentId,
      expiresAt,
    });
  } catch (error) {
    console.error('❌ Submit pending payment error:', error);
    return c.json({ error: error instanceof Error ? error.message : "Failed to submit payment" }, 500);
  }
});

// Submit payment receipt for verification
app.post("/make-server-0991178c/payment/submit-receipt", async (c) => {
  try {
    const { userId, courseId, amount, receiptData, fileName, fileType, notes } = await c.req.json();
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: "No authorization token" }, 401);
    }

    const user = await verifyUser(accessToken);
    
    if (user.id !== userId) {
      return c.json({ error: "Unauthorized" }, 403);
    }

    // Create Supabase client with service role key for storage operations
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // Create receipts bucket if it doesn't exist
    const bucketName = 'make-0991178c-receipts';
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some(bucket => bucket.name === bucketName);
    
    if (!bucketExists) {
      await supabase.storage.createBucket(bucketName, {
        public: false,
        fileSizeLimit: 5242880 // 5MB
      });
      console.log(`✅ Created receipts bucket: ${bucketName}`);
    }

    // Upload receipt to storage
    const fileExtension = fileName.split('.').pop();
    const timestamp = Date.now();
    const storagePath = `${userId}/${courseId}_${timestamp}.${fileExtension}`;
    
    // Convert base64 to Uint8Array
    const base64Data = receiptData.split(',')[1]; // Remove data:image/png;base64, prefix
    const binaryString = atob(base64Data);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(storagePath, bytes, {
        contentType: fileType,
        upsert: false
      });

    if (uploadError) {
      console.error('❌ Upload error:', uploadError);
      return c.json({ error: 'Failed to upload receipt' }, 500);
    }

    console.log(`✅ Receipt uploaded: ${storagePath}`);

    // Create pending payment record with consistent key format
    const receiptId = `payment_${timestamp}_${Math.random().toString(36).substr(2, 9)}`;
    const paymentId = `payment_receipt:${receiptId}`;
    
    // Get user profile for enriched data
    const userProfile = await kv.get(`user:${userId}`);
    
    const pendingPayment = {
      paymentId,
      receiptId,
      userId,
      courseId,
      amount,
      status: 'pending',
      receiptPath: storagePath,
      fileName,
      fileType,
      notes,
      submittedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
      userEmail: userProfile?.email || 'Unknown',
      userName: userProfile?.firstName || 'Unknown',
      userCountry: userProfile?.country || 'Unknown',
    };

    await kv.set(paymentId, pendingPayment);
    console.log(`✅ Pending payment created: ${paymentId}`);

    return c.json({
      success: true,
      message: 'Receipt submitted successfully. Approval within 24 hours.',
      paymentId,
      receiptId,
      estimatedApproval: pendingPayment.expiresAt,
    });
  } catch (error) {
    console.error('❌ Receipt submission error:', error);
    return c.json({ error: error instanceof Error ? error.message : "Unknown error" }, 500);
  }
});

// Get pending payments for a specific user
app.get("/make-server-0991178c/user/:userId/pending-payments", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const userId = c.req.param('userId');
    
    if (!accessToken) {
      return c.json({ error: "No authorization token" }, 401);
    }

    const user = await verifyUser(accessToken);
    
    // Users can only access their own pending payments
    if (user.id !== userId) {
      return c.json({ error: "Unauthorized" }, 403);
    }

    // Get all payment receipts for this user
    const allPayments = await kv.getByPrefix('payment_receipt:');
    const userPendingPayments = allPayments.filter((p: any) => 
      p.userId === userId && p.status === 'pending'
    );

    return c.json({
      success: true,
      pendingPayments: userPendingPayments,
      count: userPendingPayments.length,
    });
  } catch (error) {
    console.error('❌ Get user pending payments error:', error);
    return c.json({ error: error instanceof Error ? error.message : "Failed to fetch payments" }, 500);
  }
});

// Get all pending payments (admin only)
app.get("/make-server-0991178c/admin/pending-payments", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: "No authorization token" }, 401);
    }

    const user = await verifyUser(accessToken);
    const adminProfile = await kv.get(`user:${user.id}`);
    
    if (!adminProfile || adminProfile.role !== 'admin') {
      return c.json({ error: "Admin access required" }, 403);
    }

    // Get all payment keys
    const paymentKeys = await kv.getByPrefix('payment:');
    const pendingPayments = paymentKeys.filter((p: any) => p.status === 'pending');

    // Enrich with user details
    const enrichedPayments = await Promise.all(
      pendingPayments.map(async (payment: any) => {
        const userProfile = await kv.get(`user:${payment.userId}`);
        return {
          ...payment,
          userEmail: userProfile?.email,
          userName: userProfile?.firstName,
          userCountry: userProfile?.country,
        };
      })
    );

    return c.json({
      success: true,
      pendingPayments: enrichedPayments,
      count: enrichedPayments.length,
    });
  } catch (error) {
    console.error('❌ Get pending payments error:', error);
    return c.json({ error: error instanceof Error ? error.message : "Unauthorized" }, 401);
  }
});

// Get receipt signed URL for viewing (admin only)
app.get("/make-server-0991178c/admin/receipt/:paymentId", async (c) => {
  try {
    const paymentId = c.req.param('paymentId');
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: "No authorization token" }, 401);
    }

    const user = await verifyUser(accessToken);
    const adminProfile = await kv.get(`user:${user.id}`);
    
    if (!adminProfile || adminProfile.role !== 'admin') {
      return c.json({ error: "Admin access required" }, 403);
    }

    const payment = await kv.get(paymentId);
    
    if (!payment) {
      return c.json({ error: "Payment not found" }, 404);
    }

    // Create signed URL for receipt
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const { data, error } = await supabase.storage
      .from('make-0991178c-receipts')
      .createSignedUrl(payment.receiptPath, 3600); // 1 hour expiry

    if (error || !data) {
      console.error('❌ Failed to create signed URL:', error);
      return c.json({ error: 'Failed to get receipt URL' }, 500);
    }

    return c.json({
      success: true,
      receiptUrl: data.signedUrl,
      payment,
    });
  } catch (error) {
    console.error('❌ Get receipt URL error:', error);
    return c.json({ error: error instanceof Error ? error.message : "Unauthorized" }, 401);
  }
});

// Approve payment receipt (admin only)
app.post("/make-server-0991178c/admin/payment/approve-receipt", async (c) => {
  try {
    const { paymentId } = await c.req.json();
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: "No authorization token" }, 401);
    }

    const user = await verifyUser(accessToken);
    const adminProfile = await kv.get(`user:${user.id}`);
    
    if (!adminProfile || adminProfile.role !== 'admin') {
      return c.json({ error: "Admin access required" }, 403);
    }

    const payment = await kv.get(paymentId);
    
    if (!payment) {
      return c.json({ error: "Payment not found" }, 404);
    }

    if (payment.status !== 'pending') {
      return c.json({ error: "Payment already processed" }, 400);
    }

    // Update payment status
    payment.status = 'approved';
    payment.approvedBy = user.id;
    payment.approvedAt = new Date().toISOString();
    await kv.set(paymentId, payment);

    // Enroll user in course
    const userProfile = await kv.get(`user:${payment.userId}`);
    
    if (!userProfile) {
      return c.json({ error: "User not found" }, 404);
    }

    if (!userProfile.enrolledCourses) {
      userProfile.enrolledCourses = [];
    }

    if (!userProfile.enrolledCourses.includes(payment.courseId)) {
      userProfile.enrolledCourses.push(payment.courseId);
    }

    // Add to payment history
    if (!userProfile.paymentHistory) {
      userProfile.paymentHistory = [];
    }

    userProfile.paymentHistory.push({
      amount: payment.amount,
      courseId: payment.courseId,
      status: 'approved',
      method: 'receipt-upload',
      approvedBy: user.id,
      approvedAt: payment.approvedAt,
      submittedAt: payment.submittedAt,
    });

    // Remove from pending payments
    if (userProfile.pendingPayments) {
      userProfile.pendingPayments = userProfile.pendingPayments.filter((p: string) => p !== paymentId);
    }

    // Upgrade role if still a lead
    if (userProfile.role === 'lead') {
      userProfile.role = 'student';
      userProfile.badge = 'beginner';
    }

    await kv.set(`user:${payment.userId}`, userProfile);

    console.log(`✅ Payment approved: ${paymentId} - User ${payment.userId} enrolled in ${payment.courseId}`);

    return c.json({
      success: true,
      message: 'Payment approved and user enrolled',
      userId: payment.userId,
      courseId: payment.courseId,
    });
  } catch (error) {
    console.error('❌ Approve payment error:', error);
    return c.json({ error: error instanceof Error ? error.message : "Unauthorized" }, 401);
  }
});

// Reject payment receipt (admin only)
app.post("/make-server-0991178c/admin/payment/reject-receipt", async (c) => {
  try {
    const { paymentId, reason } = await c.req.json();
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: "No authorization token" }, 401);
    }

    const user = await verifyUser(accessToken);
    const adminProfile = await kv.get(`user:${user.id}`);
    
    if (!adminProfile || adminProfile.role !== 'admin') {
      return c.json({ error: "Admin access required" }, 403);
    }

    const payment = await kv.get(paymentId);
    
    if (!payment) {
      return c.json({ error: "Payment not found" }, 404);
    }

    if (payment.status !== 'pending') {
      return c.json({ error: "Payment already processed" }, 400);
    }

    // Update payment status
    payment.status = 'rejected';
    payment.rejectedBy = user.id;
    payment.rejectedAt = new Date().toISOString();
    payment.rejectionReason = reason || 'Receipt invalid or unclear';
    await kv.set(paymentId, payment);

    // Remove from user's pending payments
    const userProfile = await kv.get(`user:${payment.userId}`);
    if (userProfile && userProfile.pendingPayments) {
      userProfile.pendingPayments = userProfile.pendingPayments.filter((p: string) => p !== paymentId);
      await kv.set(`user:${payment.userId}`, userProfile);
    }

    console.log(`✅ Payment rejected: ${paymentId} - Reason: ${reason}`);

    return c.json({
      success: true,
      message: 'Payment rejected',
      paymentId,
      reason,
    });
  } catch (error) {
    console.error('❌ Reject payment error:', error);
    return c.json({ error: error instanceof Error ? error.message : "Unauthorized" }, 401);
  }
});

// ==================== PAYMENT ENDPOINTS ====================

// Process course enrollment payment
app.post("/make-server-0991178c/payment/enroll", async (c) => {
  try {
    const { userId, courseId, amount, paymentMethod } = await c.req.json();
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: "No authorization token" }, 401);
    }

    const user = await verifyUser(accessToken);
    
    if (user.id !== userId) {
      return c.json({ error: "Unauthorized" }, 403);
    }

    const profile = await kv.get(`user:${userId}`);
    
    if (!profile) {
      return c.json({ error: "User not found" }, 404);
    }

    // Validate course and amount
    const validCourses = {
      'beginners': 50,
      'strategy': 70,
    };

    if (!validCourses[courseId] || validCourses[courseId] !== amount) {
      return c.json({ error: "Invalid course or amount" }, 400);
    }

    // Check if already enrolled
    if (profile.enrolledCourses.includes(courseId)) {
      return c.json({ error: "Already enrolled in this course" }, 400);
    }

    // Record payment
    const payment = {
      courseId,
      amount,
      paymentMethod,
      date: new Date().toISOString(),
      status: 'completed',
    };

    profile.paymentHistory = profile.paymentHistory || [];
    profile.paymentHistory.push(payment);

    // Enroll in course
    profile.enrolledCourses.push(courseId);

    // Upgrade role from lead to student if first payment
    if (profile.role === 'lead') {
      profile.role = 'student';
    }

    // Update badge based on enrollment
    if (courseId === 'beginners' && profile.badge === 'free-trial') {
      profile.badge = 'beginner';
    } else if (courseId === 'strategy' && profile.enrolledCourses.includes('beginners')) {
      profile.badge = 'intermediate';
    }

    await kv.set(`user:${userId}`, profile);
    
    console.log(`✅ User ${userId} enrolled in ${courseId}`);
    
    return c.json({ 
      message: "Payment successful, enrolled in course",
      enrolledCourses: profile.enrolledCourses,
      badge: profile.badge,
      role: profile.role,
    });
  } catch (error) {
    console.error('❌ Payment error:', error);
    return c.json({ error: error instanceof Error ? error.message : "Unauthorized" }, 401);
  }
});

// Mark course as completed
app.post("/make-server-0991178c/course/complete", async (c) => {
  try {
    const { userId, courseId } = await c.req.json();
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: "No authorization token" }, 401);
    }

    const user = await verifyUser(accessToken);
    
    if (user.id !== userId) {
      return c.json({ error: "Unauthorized" }, 403);
    }

    const profile = await kv.get(`user:${userId}`);
    
    if (!profile) {
      return c.json({ error: "User not found" }, 404);
    }

    // Check if enrolled
    if (!profile.enrolledCourses.includes(courseId)) {
      return c.json({ error: "Not enrolled in this course" }, 400);
    }

    // Mark as completed
    profile.coursesCompleted = profile.coursesCompleted || [];
    if (!profile.coursesCompleted.includes(courseId)) {
      profile.coursesCompleted.push(courseId);
    }

    // Update badge based on completion
    if (courseId === 'beginners' && profile.badge === 'beginner') {
      profile.badge = 'intermediate';
    } else if (courseId === 'strategy' && profile.badge === 'intermediate') {
      profile.badge = 'advanced';
    }

    await kv.set(`user:${userId}`, profile);
    
    return c.json({ 
      message: "Course marked as completed",
      coursesCompleted: profile.coursesCompleted,
      badge: profile.badge,
    });
  } catch (error) {
    console.error('❌ Complete course error:', error);
    return c.json({ error: error instanceof Error ? error.message : "Unauthorized" }, 401);
  }
});

// ==================== AUTO-CREATE ADMIN ON STARTUP ====================

async function ensureAdminExists() {
  try {
    console.log('🔍 Checking if admin account exists...');
    
    const adminEmail = 'support@pipnationacademy.com';
    const adminPassword = 'Pipnation12@';
    
    // Check if admin already exists
    const allUsers = await kv.getByPrefix('user:');
    const adminExists = allUsers.find(u => u.email?.toLowerCase() === adminEmail.toLowerCase() && u.role === 'admin');
    
    if (adminExists) {
      console.log('✅ Admin account already exists:', adminEmail);
      return;
    }
    
    console.log('🔐 Creating admin account:', adminEmail);
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('❌ Missing Supabase credentials for admin creation');
      return;
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Check if user exists in Supabase Auth
    const { data: existingUsers } = await supabase.auth.admin.listUsers();
    const existingAuthUser = existingUsers?.users?.find(u => u.email?.toLowerCase() === adminEmail.toLowerCase());
    
    let userId: string;
    
    if (existingAuthUser) {
      console.log('⚠️ User exists in Auth, upgrading to admin...');
      userId = existingAuthUser.id;
    } else {
      // Create new user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: adminEmail,
        password: adminPassword,
        email_confirm: true,
        user_metadata: { firstName: 'Admin', country: 'US' }
      });

      if (authError) {
        console.error('❌ Failed to create admin in Auth:', authError.message);
        return;
      }

      if (!authData.user?.id) {
        console.error('❌ No user ID returned');
        return;
      }
      
      userId = authData.user.id;
      console.log('✅ Admin user created in Supabase Auth');
    }

    // Create or update admin profile in KV store
    const adminProfile = {
      userId,
      email: adminEmail,
      firstName: 'Admin',
      country: 'US',
      role: 'admin', // 👑 ADMIN ROLE
      badge: 'admin',
      createdAt: new Date().toISOString(),
      progress: {
        foundation: { completed: 0, total: 12 },
        advanced: { completed: 0, total: 15 },
        beginners: { completed: 0, total: 12 },
        strategy: { completed: 0, total: 17 },
      },
      completedLessons: [],
      quizScores: {},
      enrolledCourses: ['beginners', 'strategy'], // Admin has access to all courses
      coursesCompleted: [],
      paymentHistory: [],
    };

    await kv.set(`user:${userId}`, adminProfile);
    console.log('✅ Admin profile created in KV store');
    console.log('🎉 Admin account ready! Email: support@pipnationacademy.com');
    
  } catch (error) {
    console.error('❌ Error ensuring admin exists:', error);
  }
}

// Create admin account on server startup
ensureAdminExists().catch(console.error);

// Start the server
Deno.serve(app.fetch);
