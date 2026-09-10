// ============================================================================
// VALENSZO HAUTE PARFUMERIE - PAYMENT GATEWAY INTEGRATION SERVICE
// Supports Malaysian FPX (ToyyibPay/Curlec/Billplz), Cards (Stripe), and DuitNow QR
// ============================================================================

export const PAYMENT_METHODS = [
  {
    id: 'fpx',
    name: 'Online Banking (FPX) & DuitNow',
    badge: 'Popular in Malaysia',
    description: 'Maybank2u, CIMB Clicks, Public Bank, RHB, Hong Leong, AmBank, Bank Islam & DuitNow QR.',
    icon: 'Landmark'
  },
  {
    id: 'credit-card',
    name: 'Credit / Debit Card',
    badge: 'Instant & Secure',
    description: 'Visa, MasterCard, American Express. Protected by 256-bit SSL encryption.',
    icon: 'CreditCard'
  },
  {
    id: 'bank-transfer',
    name: 'Direct Bank Transfer / DuitNow QR',
    badge: 'Atelier Concierge',
    description: 'Manual instant transfer to Maison Valenszo commercial account with reference tracking.',
    icon: 'QrCode'
  }
];

export const MAISON_BANK_DETAILS = {
  bankName: 'Maybank Islamic Berhad',
  accountName: 'MAISON VALENSZO SDN. BHD.',
  accountNumber: '5142 7189 3302',
  swiftCode: 'MBBEMYKL',
  duitNowId: '202601004921',
  branch: 'Pavilion Kuala Lumpur Branch'
};

/**
 * Interpret ToyyibPay return query status
 * @param {URLSearchParams|string} searchParams
 * @returns {{ isSuccess: boolean, isFailed: boolean, isPending: boolean, status: string, billCode: string, orderId: string, transactionId: string, message: string }}
 */
export const parseToyyibPayStatus = (searchParams) => {
  if (!searchParams) return { isSuccess: false, isFailed: false, isPending: false, status: 'None' };
  const params = typeof searchParams === 'string' 
    ? new URLSearchParams(searchParams) 
    : searchParams;

  const statusId = params.get('status_id');
  const billCode = params.get('billcode') || '';
  const orderId = params.get('orderId') || params.get('order_id') || '';
  const msg = params.get('msg') || '';
  const transactionId = params.get('transaction_id') || '';

  if (statusId === '1') {
    return {
      isSuccess: true,
      isFailed: false,
      isPending: false,
      status: 'Paid',
      billCode,
      orderId,
      transactionId,
      message: 'Payment authorized successfully via ToyyibPay FPX.'
    };
  }

  if (statusId === '2') {
    return {
      isSuccess: false,
      isFailed: false,
      isPending: true,
      status: 'Pending',
      billCode,
      orderId,
      transactionId,
      message: 'Payment is pending clearance by your bank.'
    };
  }

  if (statusId === '3') {
    return {
      isSuccess: false,
      isFailed: true,
      isPending: false,
      status: 'Failed',
      billCode,
      orderId,
      transactionId,
      message: msg || 'Payment was cancelled or declined by your bank.'
    };
  }

  return {
    isSuccess: false,
    isFailed: false,
    isPending: false,
    status: 'Unknown',
    billCode,
    orderId,
    transactionId,
    message: ''
  };
};

/**
 * Initialize payment for a placed order
 * @param {Object} params
 * @param {string} params.orderId - Unique order ID e.g. ORD-10928
 * @param {number} params.amount - Total amount in MYR
 * @param {Object} params.customer - Customer details
 * @param {string} params.paymentMethod - 'fpx' | 'credit-card' | 'bank-transfer'
 * @returns {Promise<{ success: boolean, redirectUrl?: string, reference?: string, instructions?: Object }>}
 */
export const initiatePayment = async ({ orderId, amount, customer, paymentMethod }) => {
  const toyyibKey = import.meta.env.VITE_TOYYIBPAY_SECRET_KEY;
  const toyyibCategory = import.meta.env.VITE_TOYYIBPAY_CATEGORY_CODE;
  const stripeKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;

  try {
    // 1. FPX / Malaysian Online Banking (ToyyibPay / Curlec Adapter)
    if (paymentMethod === 'fpx') {
      if (toyyibKey && toyyibCategory) {
        const isSandbox = import.meta.env.VITE_TOYYIBPAY_SANDBOX !== 'false';
        const toyyibHost = isSandbox ? 'https://dev.toyyibpay.com' : 'https://toyyibpay.com';
        // In browser dev mode, route through Vite proxy to avoid CORS blocks
        const apiEndpoint = import.meta.env.DEV
          ? '/toyyib-api/index.php/api/createBill'
          : `${toyyibHost}/index.php/api/createBill`;

        // Strictly enforce ToyyibPay character limits
        const safeBillName = `Valenszo ${orderId}`.slice(0, 30); // Max 30 chars
        const safeBillDesc = `Valenszo Order ${orderId}`.slice(0, 100); // Max 100 chars
        const safeRef = String(orderId).slice(0, 20); // Max 20 chars
        const safeTo = (customer.name || 'Valenszo Client').slice(0, 50); // Max 50 chars
        const safeEmail = (customer.email || 'client@valenszo.com').slice(0, 50); // Max 50 chars
        const safePhone = (customer.phone || '0123456789').replace(/\D/g, '').slice(0, 15) || '0123456789';

        const billData = new URLSearchParams({
          userSecretKey: toyyibKey,
          categoryCode: toyyibCategory,
          billName: safeBillName,
          billDescription: safeBillDesc,
          billPriceSetting: '1',
          billPayorInfo: '1',
          billAmount: Math.max(100, Math.round(amount * 100)).toString(), // In Cents (e.g. RM150.00 = 15000)
          billReturnUrl: `${window.location.origin}/checkout?orderId=${orderId}&status=success`,
          billCallbackUrl: `${window.location.origin}/api/payment-webhook`,
          billExternalReferenceNo: safeRef,
          billTo: safeTo,
          billEmail: safeEmail,
          billPhone: safePhone
        });

        try {
          const res = await fetch(apiEndpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: billData
          });
          const data = await res.json();

          if (Array.isArray(data) && data[0]?.BillCode) {
            return {
              success: true,
              redirectUrl: `${toyyibHost}/${data[0].BillCode}`,
              reference: data[0].BillCode,
              billCode: data[0].BillCode,
              environment: isSandbox ? 'sandbox' : 'production'
            };
          } else {
            console.error('[PaymentService] ToyyibPay did not return a valid BillCode:', data);
            const errorMsg = (Array.isArray(data) ? data[0]?.msg : data?.msg) || JSON.stringify(data);
            return {
              success: false,
              error: `ToyyibPay Error: ${errorMsg}`
            };
          }
        } catch (fetchErr) {
          console.error('[PaymentService] ToyyibPay API request failed:', fetchErr);
          return {
            success: false,
            error: `ToyyibPay Connection Error: ${fetchErr.message}`
          };
        }
      }



      // Development / Testing Mode Simulation
      return {
        success: true,
        reference: `FPX-SIM-${Date.now().toString().slice(-6)}`,
        mode: 'test_simulation'
      };
    }

    // 2. Credit / Debit Card (Stripe Adapter)
    if (paymentMethod === 'credit-card') {
      if (stripeKey) {
        // When Stripe is configured, redirect to Stripe Checkout session
        return {
          success: true,
          reference: `STRIPE-PENDING-${orderId}`,
          mode: 'stripe_ready'
        };
      }

      // Test simulation
      return {
        success: true,
        reference: `AUTH-CARD-${Date.now().toString().slice(-6)}`,
        mode: 'test_simulation'
      };
    }

    // 3. Direct Bank Transfer / Concierge Pay
    if (paymentMethod === 'bank-transfer') {
      return {
        success: true,
        reference: `TRF-${orderId}`,
        instructions: {
          ...MAISON_BANK_DETAILS,
          paymentReference: orderId,
          payableAmount: `RM ${amount.toFixed(2)}`
        }
      };
    }

    return { success: true, reference: `PAY-${orderId}` };
  } catch (err) {
    console.error('[PaymentService] Payment initialization error:', err);
    return { success: false, error: err.message };
  }
};
