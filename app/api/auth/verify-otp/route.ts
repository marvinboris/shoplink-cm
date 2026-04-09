import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { formatPhoneCameroon } from '@/lib/utils';

export async function POST(req: NextRequest) {
  try {
    const { phone, otp, createAccount } = await req.json();

    if (!phone || !otp) {
      return NextResponse.json(
        { success: false, error: 'Téléphone et code requis' },
        { status: 400 }
      );
    }

    const formattedPhone = formatPhoneCameroon(phone);
    const supabase = await createClient();

    const { data: otpRecord, error: otpError } = await supabase
      .from('otps')
      .select('*')
      .eq('phone', formattedPhone)
      .eq('code', otp)
      .gte('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (otpError || !otpRecord) {
      return NextResponse.json(
        { success: false, error: 'Code invalide ou expiré' },
        { status: 401 }
      );
    }

    await supabase.from('otps').delete().eq('id', otpRecord.id);

    const { data: vendor, error: vendorError } = await supabase
      .from('vendors')
      .select('*')
      .eq('phone', formattedPhone)
      .single();

    if (vendorError && createAccount) {
      const { data: newVendor, error: createError } = await supabase
        .from('vendors')
        .insert({
          phone: formattedPhone,
          plan: 'free',
          commission_rate: 3,
          shop_slug: null,
        })
        .select()
        .single();

      if (createError) {
        return NextResponse.json(
          { success: false, error: 'Erreur création compte' },
          { status: 500 }
        );
      }

      await supabase.auth.admin.generateLink({
        type: 'magiclink',
        email: `${newVendor.id}@shoplink.cm`,
      });

      return NextResponse.json({
        success: true,
        vendor: newVendor,
        needsOnboarding: true,
      });
    }

    if (!vendor) {
      return NextResponse.json(
        { success: false, error: 'Compte non trouvé' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      vendor,
      needsOnboarding: !vendor.shop_slug,
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    return NextResponse.json({ success: false, error: 'Erreur serveur' }, { status: 500 });
  }
}
