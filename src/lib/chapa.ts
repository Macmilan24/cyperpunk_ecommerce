export const CHAPA_API_URL = "https://api.chapa.co/v1";

export async function initializePayment(data: {
  amount: string;
  currency: string;
  email: string;
  first_name: string;
  last_name: string;
  tx_ref: string;
  callback_url?: string;
  return_url?: string;
  customization?: {
    title?: string;
    description?: string;
  };
}) {
  const response = await fetch(`${CHAPA_API_URL}/transaction/initialize`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Chapa initialization failed: ${error}`);
  }

  return response.json();
}

export async function verifyPayment(tx_ref: string) {
  const response = await fetch(
    `${CHAPA_API_URL}/transaction/verify/${tx_ref}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
      },
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Chapa verification failed: ${error}`);
  }

  return response.json();
}
