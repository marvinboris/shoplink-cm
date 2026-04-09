import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const vendorId = searchParams.get('vendor_id');
  const status = searchParams.get('status');

  const supabase = await createClient();

  let query = supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });

  if (vendorId) {
    query = query.eq('vendor_id', vendorId);
  }

  if (status) {
    query = query.eq('status', status);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, data });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const supabase = await createClient();

    const order = {
      vendor_id: body.vendor_id,
      customer_name: body.customer_name,
      customer_phone: body.customer_phone,
      customer_city: body.customer_city,
      delivery_note: body.delivery_note || null,
      items: body.items,
      subtotal: body.subtotal,
      delivery_fee: body.delivery_fee,
      total: body.total,
      status: 'pending',
      payment_method: body.payment_method,
      payment_reference: body.payment_reference || null,
    };

    const { data, error } = await supabase
      .from('orders')
      .insert(order)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Create order error:', error);
    return NextResponse.json({ success: false, error: 'Erreur serveur' }, { status: 500 });
  }
}
