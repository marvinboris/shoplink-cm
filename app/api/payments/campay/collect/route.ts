import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createCampayPayment } from '@/lib/payments/campay';

export async function POST(req: NextRequest) {
  try {
    const { order_id, amount, description } = await req.json();

    if (!order_id || !amount) {
      return NextResponse.json(
        { success: false, error: 'Paramètres manquants' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Get order details
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', order_id)
      .single();

    if (orderError || !order) {
      return NextResponse.json(
        { success: false, error: 'Commande non trouvée' },
        { status: 404 }
      );
    }

    const merchantReference = `ORD-${order.id.slice(0, 8).toUpperCase()}`;
    const redirectUrl = `${process.env.NEXT_PUBLIC_APP_URL || req.nextUrl.origin}/boutique/${order.vendor_id}/success`;

    const campayResult = await createCampayPayment(
      amount,
      description || `Paiement commande ${merchantReference}`,
      merchantReference,
      redirectUrl
    );

    if (campayResult.status === 'SUCCESS') {
      // Update order with payment reference
      await supabase
        .from('orders')
        .update({ payment_reference: campayResult.transaction_id })
        .eq('id', order_id);
    }

    return NextResponse.json({
      success: true,
      status: campayResult.status,
      transaction_id: campayResult.transaction_id,
      redirect_url: campayResult.redirect_url,
    });
  } catch (error) {
    console.error('Campay collect error:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur paiement' },
      { status: 500 }
    );
  }
}
