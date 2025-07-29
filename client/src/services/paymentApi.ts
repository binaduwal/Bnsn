import { api, errorHandler } from "./api";

interface CheckoutSessionResponse {
  sessionId: string;
  url: string;
}

interface ConfirmPaymentResponse {
  message: string;
  wordsAdded: number;
  newTotalWords: number;
  newWordsLeft: number;
}

export const createCheckoutSessionApi = async (amount: number): Promise<{ success: boolean; data: CheckoutSessionResponse }> => {
  try {
    const res = await api.post('/payments/create-checkout-session', { amount });
    return res.data;
  } catch (error) {
    throw errorHandler(error);
  }
};

export const confirmPaymentApi = async (paymentIntentId: string): Promise<{ success: boolean; data: ConfirmPaymentResponse }> => {
  try {
    const res = await api.post('/payments/confirm-payment', { paymentIntentId });
    return res.data;
  } catch (error) {
    throw errorHandler(error);
  }
}; 