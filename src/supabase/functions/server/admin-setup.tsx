/**
 * Admin Setup Instructions
 * 
 * To create an admin user, you can use the signup endpoint and then manually
 * update the user's role to 'admin' using the KV store.
 * 
 * Steps:
 * 1. Sign up normally through the UI with your admin email
 * 2. Use the Supabase dashboard or API to update the role to 'admin'
 * 
 * Or, you can create a one-time endpoint to bootstrap an admin user:
 * 
 * POST /make-server-0991178c/bootstrap-admin
 * Body: { email, password, firstName, country }
 * 
 * This endpoint should be removed or secured after initial setup.
 */

import { Hono } from "npm:hono@4";
import { createClient } from "jsr:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";

export function setupAdminRoutes(app: Hono) {
  // CAUTION: This endpoint should be removed or secured in production
  app.post("/make-server-0991178c/bootstrap-admin", async (c) => {
    try {
      const { email, password, firstName, country } = await c.req.json();
      
      const supabase = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      );
      
      // Create user with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { firstName, country },
      });

      if (authError) {
        return c.json({ error: authError.message }, 400);
      }

      const userId = authData.user?.id;
      
      // Create admin profile
      const userProfile = {
        userId,
        email,
        firstName,
        country,
        role: 'admin', // Set as admin
        createdAt: new Date().toISOString(),
        progress: {
          foundation: { completed: 0, total: 12 },
          advanced: { completed: 0, total: 15 },
        },
        completedLessons: [],
        quizScores: {},
      };

      await kv.set(`user:${userId}`, userProfile);
      
      return c.json({ 
        message: "Admin user created successfully",
        userId,
        email,
        role: 'admin'
      });
    } catch (error) {
      console.log(`Error creating admin: ${error}`);
      return c.json({ error: String(error) }, 500);
    }
  });
}
