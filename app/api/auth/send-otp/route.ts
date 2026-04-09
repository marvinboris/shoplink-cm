import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generateOtp, formatPhoneCameroon } from '@/lib/utils';

export async function POST(req: NextRequest) {
  try {
    const { phone } = await req.json();

    if (!phone) {
      return NextResponse.json({ success: false, error: 'Téléphone requis' }, { status: 400 });
    }

    const formattedPhone = formatPhoneCameroon(phone);
    const otp = generateOtp();

    const supabase = await createClient();

    await supabase.from('otps').insert({
      phone: formattedPhone,
      code: otp,
      expires_at: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
    });

    // Log OTP for demo
    console.log(`[DEV] OTP for ${formattedPhone}: ${otp}`);

    // Send via Africa's Talking if configured
    if (process.env.AFRICASTALKING_API_KEY) {
      await fetch('https://api.africastalking.com/rest/ussd/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.AFRICASTALKING_API_KEY}`,
        },
        body: JSON.stringify({
          to: formattedPhone,
          message: `Votre code ShopLink: ${otp}`,
          from: 'ShopLink',
        }),
      });
    }

    return NextResponse.json({
      success: true,
      reference_id: formattedPhone,
      dev_code: otp,
    });
  } catch (error) {
    console.error('Send OTP error:', error);
    return NextResponse.json({ success: false, error: 'Erreur serveur' }, { status: 500 });
  }
}
