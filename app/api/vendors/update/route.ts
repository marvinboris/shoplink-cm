import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';

export async function PATCH(req: Request) {
  try {
    const { updates } = await req.json();

    const cookieStore = await cookies();
    const vendorId = cookieStore.get('shoplink_vendor_id')?.value;

    if (!vendorId) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const supabase = await createClient();

    const { data, error } = await supabase
      .from('vendors')
      .update(updates)
      .eq('id', vendorId)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Update vendor error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
