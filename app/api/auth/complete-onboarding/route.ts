import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { vendorId, name, businessName, city, slug, firstProduct } = body;

    if (!vendorId) {
      return NextResponse.json({ success: false, error: 'vendorId requis' }, { status: 400 });
    }

    const supabase = await createClient();

    // Update vendor with onboarding data
    const { data: updatedVendor, error: vendorError } = await supabase
      .from('vendors')
      .update({
        name: name || businessName,
        business_name: businessName,
        city,
        shop_slug: slug,
      })
      .eq('id', vendorId)
      .select()
      .single();

    if (vendorError) {
      console.error('Vendor update error:', vendorError);
      return NextResponse.json({ success: false, error: 'Erreur mise à jour vendor' }, { status: 500 });
    }

    // Create first product if provided
    if (firstProduct?.name && firstProduct?.price) {
      await supabase.from('products').insert({
        vendor_id: vendorId,
        name: firstProduct.name,
        price: firstProduct.price,
        is_available: true,
      });
    }

    return NextResponse.json({
      success: true,
      vendor: updatedVendor,
    });
  } catch (error) {
    console.error('Complete onboarding error:', error);
    return NextResponse.json({ success: false, error: 'Erreur serveur' }, { status: 500 });
  }
}
