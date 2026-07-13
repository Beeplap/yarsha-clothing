import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Determine redirect based on user role
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();

        const redirectPath =
          profile?.role === "admin" || profile?.role === "manager"
            ? "/admin"
            : next;

        const forwardedHost = request.headers.get("x-forwarded-host");
        const isLocalEnv = process.env.NODE_ENV === "development";

        if (isLocalEnv) {
          return NextResponse.redirect(`${origin}${redirectPath}`);
        } else if (forwardedHost) {
          return NextResponse.redirect(
            `https://${forwardedHost}${redirectPath}`
          );
        } else {
          return NextResponse.redirect(`${origin}${redirectPath}`);
        }
      }
    }
  }

  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
