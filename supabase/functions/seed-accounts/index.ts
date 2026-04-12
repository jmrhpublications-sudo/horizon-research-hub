import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    const accounts = [
      { email: "admin@jmrh.in", password: "Admin@123", name: "Super Admin", role: "admin" },
      { email: "professor@jmrh.in", password: "Prof@123", name: "Dr. Sarah Wilson", role: "professor" },
    ];

    const results = [];

    for (const acct of accounts) {
      // Check if user already exists
      const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
      const existing = existingUsers?.users?.find((u: any) => u.email === acct.email);
      
      if (existing) {
        results.push({ email: acct.email, status: "already_exists", id: existing.id });
        continue;
      }

      // Create user
      const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email: acct.email,
        password: acct.password,
        email_confirm: true,
        user_metadata: { full_name: acct.name },
      });

      if (createError) {
        results.push({ email: acct.email, status: "error", error: createError.message });
        continue;
      }

      if (newUser?.user) {
        // The trigger handles profile + default 'user' role
        // Update role to correct one
        await supabaseAdmin.from("user_roles").update({ role: acct.role }).eq("user_id", newUser.user.id);
        
        // Also update profile name
        await supabaseAdmin.from("profiles").update({ name: acct.name, email: acct.email }).eq("id", newUser.user.id);
        
        results.push({ email: acct.email, status: "created", id: newUser.user.id, role: acct.role });
      }
    }

    return new Response(JSON.stringify({ success: true, results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
