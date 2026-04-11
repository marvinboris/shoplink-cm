import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createServiceClient() {
  const cookieStore = await cookies();

  // Use service role key if available, otherwise fall back to anon key
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    serviceKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Server Components - ignore
          }
        },
      },
    }
  );
}
