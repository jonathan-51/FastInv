import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(request) {
    let supabaseResponse = NextResponse.next({
        request,
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options}) => {
                        supabaseResponse.cookies.set(name,value,options)
                    })
                }
            }
        }
    )
    // Check if user is authenticated
    const {data: { session },} = await supabase.auth.getSession()

    // Protect dashboard routes
    const isAuthPage = request.nextUrl.pathname === '/(auth)/login' ||
        request.nextUrl.pathname === '/(auth)/signup' ||
        request.nextUrl.pathname === '/login' ||
        request.nextUrl.pathname === '/signup'

    if (!isAuthPage && (request.nextUrl.pathname.startsWith('/(dashboard)') ||
        request.nextUrl.pathname.startsWith('/dashboard') ||
        request.nextUrl.pathname.startsWith('/') ||
        request.nextUrl.pathname.startsWith('/organization') ||
        request.nextUrl.pathname.startsWith('/customers') ||
        request.nextUrl.pathname.startsWith('/jobs') ||
        request.nextUrl.pathname.startsWith('/entry'))) {

        if (!session) {
        // No session, redirect to login
        return NextResponse.redirect(new URL('/login', request.url))
        }
    }

    // Redirect authenticated users away from login/signup
    if (request.nextUrl.pathname === '/(auth)/login' ||
        request.nextUrl.pathname === '/(auth)/signup' ||
        request.nextUrl.pathname === '/login' ||
        request.nextUrl.pathname === '/signup') {

        if (session) {
        // User is logged in, redirect to dashboard
        return NextResponse.redirect(new URL('/', request.url))
        }
    }

    const { data: {user} } = await supabase.auth.getUser()

    if (user) {
        // Check if user has membership (don't use .single() to avoid errors)
        const { data: memberships, error } = await supabase
            .from('memberships')
            .select('user_id')
            .eq('user_id', user.id)
            .limit(1)

        const hasMembership = memberships && memberships.length > 0

        console.log('User ID:', user.id)
        console.log('Has membership:', hasMembership)
        console.log('Memberships data:', memberships)

        if (!hasMembership && request.nextUrl.pathname !== '/organization') {
            // User has no membership, redirect to organization page
            return NextResponse.redirect(new URL('/organization', request.url))
        }

        if (hasMembership && request.nextUrl.pathname === '/organization') {
            // User already has membership, redirect to jobs
            return NextResponse.redirect(new URL('/jobs', request.url))
        }
    }

    return supabaseResponse
    }

    // Specify which routes to run middleware on
    export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],

}
