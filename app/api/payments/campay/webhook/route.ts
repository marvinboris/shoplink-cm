import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getCampayTransactionStatus } from '@/lib/payments/campay';

// Campay webhook handler
export async function POST(req: NextRequest) {
  try {
    const { transaction_id, status, merchant_reference } = await req.json();

    if (!transaction_id) {
      return NextResponse.json({ received: false }, { status: 400 });
    }

    const supabase = await createClient();

    // Check idempotency - already processed
    const { data: existingEvent } = await supabase
      .from('payment_events')
      .select('id')
      .eq('provider_ref', transaction_id)
      .single();

    if (existingEvent) {
      return NextResponse.json({ received: true, duplicate: true });
    }

    // Record the event
    await supabase.from('payment_events').insert({
      provider: 'campay',
      provider_ref: transaction_id,
      payload: { status, merchant_reference },
      processed_at: new Date().toISOString(),
    });

    // Get transaction status from Campay
    const transaction = await getCampayTransactionStatus(transaction_id);

    // Find order by payment reference
    const { data: order } = await supabase
      .from('orders')
      .select('id, vendor_id, status')
      .eq('payment_reference', transaction_id)
      .single();

    if (order && transaction.status === 'SUCCESS') {
      // Update order to paid
      await supabase
        .from('orders')
        .update({
          status: 'paid',
          payment_confirmed_at: new Date().toISOString(),
        })
        .eq('id', order.id);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Campay webhook error:', error);
    return NextResponse.json({ received: false, error: 'Server error' }, { status: 500 });
  }
}

// Campay redirect handler (after payment)
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const transactionId = searchParams.get('transaction_id');
  const status = searchParams.get('status');
  const reference = searchParams.get('reference');

  if (status === 'SUCCESS' && transactionId) {
    return NextResponse.redirect(
      new URL(`/checkout/success?transaction_id=${transactionId}&reference=${reference}`, req.url)
    );
  }

  return NextResponse.redirect(new URL('/checkout?payment=cancelled', req.url));
}
