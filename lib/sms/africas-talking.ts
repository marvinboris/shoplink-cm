import AfricasTalking from 'africastalking';

let atInstance: ReturnType<typeof AfricasTalking> | null = null;

function getInstance() {
  if (!atInstance && process.env.AFRICASTALKING_API_KEY && process.env.AFRICASTALKING_USERNAME) {
    atInstance = AfricasTalking({
      apiKey: process.env.AFRICASTALKING_API_KEY,
      username: process.env.AFRICASTALKING_USERNAME,
    });
  }
  return atInstance;
}

export async function sendSMS(to: string, message: string) {
  const at = getInstance();
  if (!at) {
    console.log('[DEV] SMS not configured, would send to:', to, message);
    return { success: true, data: null };
  }

  try {
    const result = await at.SMS.send({ to, message });
    return { success: true, data: result };
  } catch (error) {
    console.error('Africastalking SMS error:', error);
    return { success: false, error };
  }
}

export async function sendOTP(phone: string, otp: string) {
  const message = `Votre code ShopLink CM: ${otp}. Expire dans 10 minutes.`;
  return sendSMS(phone, message);
}
