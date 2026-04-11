import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';

const PLAN_CONFIG: Record<string, { products_limit: number | null; commission: number; orders_limit: number | null }> = {
  free: { products_limit: 10, commission: 0.03, orders_limit: 30 },
  starter: { products_limit: 50, commission: 0.015, orders_limit: null },
  pro: { products_limit: null, commission: 0, orders_limit: null },
};

export async function POST(req: Request) {
  try {
    const { plan } = await req.json();

    if (!PLAN_CONFIG[plan]) {
      return NextResponse.json({ error: 'Plan invalide' }, { status: 400 });
    }

    const cookieStore = await cookies();
    const vendorId = cookieStore.get('shoplink_vendor_id')?.value;

    if (!vendorId) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const supabase = await createClient();

    // Calculate expiration (30 days from now)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    const { data, error } = await supabase
      .from('vendors')
      .update({
        plan,
        plan_expires_at: expiresAt.toISOString(),
      })
      .eq('id', vendorId)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, plan, data });
  } catch (error) {
    console.error('Plan upgrade error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
