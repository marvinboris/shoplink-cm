const CAMPAY_API_URL = 'https://www.campay.net/api';

interface CampayPaymentRequest {
  amount: string;
  currency: string;
  description: string;
  merchant_reference: string;
  redirect_url?: string;
  webhook_url?: string;
}

interface CampayPaymentResponse {
  status: 'SUCCESS' | 'PENDING' | 'FAILED';
  transaction_id: string;
  redirect_url?: string;
  message?: string;
}

interface CampayTransactionStatus {
  status: 'SUCCESS' | 'PENDING' | 'FAILED';
  transaction_id: string;
  amount: string;
  currency: string;
  merchant_reference: string;
  payment_method?: string;
  client_number?: string;
  date?: string;
}

export async function createCampayPayment(
  amount: number,
  description: string,
  merchantReference: string,
  redirectUrl?: string
): Promise<CampayPaymentResponse> {
  const username = process.env.CAMPAY_USERNAME!;
  const password = process.env.CAMPAY_PASSWORD!;
  const token = Buffer.from(`${username}:${password}`).toString('base64');

  const response = await fetch(`${CAMPAY_API_URL}/collect/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${token}`,
    },
    body: JSON.stringify({
      amount: amount.toString(),
      currency: 'XAF',
      description,
      merchant_reference: merchantReference,
      redirect_url: redirectUrl,
    } as CampayPaymentRequest),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Campay API error: ${response.status} - ${error}`);
  }

  return response.json();
}

export async function getCampayTransactionStatus(
  transactionId: string
): Promise<CampayTransactionStatus> {
  const username = process.env.CAMPAY_USERNAME!;
  const password = process.env.CAMPAY_PASSWORD!;
  const token = Buffer.from(`${username}:${password}`).toString('base64');

  const response = await fetch(`${CAMPAY_API_URL}/transaction/${transactionId}/`, {
    headers: {
      Authorization: `Basic ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Campay API error: ${response.status} - ${error}`);
  }

  return response.json();
}

export async function withdrawCampayFunds(amount: number, phone: string): Promise<{ status: string; reference: string }> {
  const username = process.env.CAMPAY_USERNAME!;
  const password = process.env.CAMPAY_PASSWORD!;
  const token = Buffer.from(`${username}:${password}`).toString('base64');

  const response = await fetch(`${CAMPAY_API_URL}/transfer/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${token}`,
    },
    body: JSON.stringify({
      amount: amount.toString(),
      currency: 'XAF',
      to: phone,
      merchant_reference: `WITHDRAW_${Date.now()}`,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Campay withdrawal error: ${response.status} - ${error}`);
  }

  return response.json();
}
