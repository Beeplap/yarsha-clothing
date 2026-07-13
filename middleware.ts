import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh the auth token on every request
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Auth protection: redirect unauthenticated users away from protected routes
  const { pathname } = request.nextUrl;

  const isAuthPage = pathname.startsWith("/auth");
  const isAdminPage = pathname.startsWith("/admin");
  const isAccountPage = pathname.startsWith("/account");

  // If user is not logged in and tries to access protected routes
  if (!user && (isAdminPage || isAccountPage)) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  // If user is logged in and tries to access auth pages, redirect them
  if (user && isAuthPage) {
    const url = request.nextUrl.clone();
    // Check user role for redirect target
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    url.pathname =
      profile?.role === "admin" || profile?.role === "manager"
        ? "/admin"
        : "/";
    return NextResponse.redirect(url);
  }

  // Admin route protection: only admin/manager roles
  if (user && isAdminPage) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "admin" && profile?.role !== "manager") {
      const url = request.nextUrl.clone();
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
