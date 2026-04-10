import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const vendorId = searchParams.get('vendor_id');
  const category = searchParams.get('category');
  const available = searchParams.get('available');

  const supabase = await createClient();

  let query = supabase
    .from('products')
    .select('*')
    .order('order_index');

  if (vendorId) {
    query = query.eq('vendor_id', vendorId);
  }

  if (category) {
    query = query.eq('category', category);
  }

  if (available === 'true') {
    query = query.eq('is_available', true);
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

    // Vendor_id comes from the vendors table (not Supabase Auth user)
    // The frontend sends vendor_id in the request body
    if (!body.vendor_id) {
      return NextResponse.json({ success: false, error: 'vendor_id requis' }, { status: 400 });
    }

    const product = {
      vendor_id: body.vendor_id,
      name: body.name,
      description: body.description || null,
      price: body.price,
      compare_price: body.compare_price || null,
      images: body.images || [],
      category: body.category || null,
      tags: body.tags || [],
      stock_count: body.stock_count || null,
      track_stock: body.track_stock || false,
      is_available: body.is_available ?? true,
      is_featured: body.is_featured || false,
      order_index: body.order_index || 0,
    };

    const { data, error } = await supabase
      .from('products')
      .insert(product)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Create product error:', error);
    return NextResponse.json({ success: false, error: 'Erreur serveur' }, { status: 500 });
  }
}
