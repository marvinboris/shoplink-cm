import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generateOtp, formatPhoneCameroon } from '@/lib/utils';
import { sendOTP } from '@/lib/sms/africas-talking';

export async function POST(req: NextRequest) {
  try {
    const { phone } = await req.json();

    if (!phone) {
      return NextResponse.json({ success: false, error: 'Téléphone requis' }, { status: 400 });
    }

    const formattedPhone = formatPhoneCameroon(phone);
    const otp = generateOtp();

    const supabase = await createClient();

    // Store OTP in database
    await supabase.from('otps').insert({
      phone: formattedPhone,
      code: otp,
      expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
    });

    // Send via Africa's Talking
    if (process.env.AFRICASTALKING_API_KEY && process.env.AFRICASTALKING_USERNAME) {
      await sendOTP(formattedPhone, otp);
    } else {
      // Dev mode: log OTP
      console.log(`[DEV] OTP for ${formattedPhone}: ${otp}`);
    }

    return NextResponse.json({
      success: true,
      reference: formattedPhone,
      dev_code: process.env.NODE_ENV === 'development' ? otp : undefined,
    });
  } catch (error) {
    console.error('Send OTP error:', error);
    return NextResponse.json({ success: false, error: 'Erreur serveur' }, { status: 500 });
  }
}
