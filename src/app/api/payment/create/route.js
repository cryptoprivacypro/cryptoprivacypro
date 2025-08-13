import { NextResponse } from 'next/server'

export async function POST(req) {
  try {
    const body = await req.json()
    console.log('🔍 Incoming payment request body:', body)

    const {
      product_id,
      email,
      wallet_address,
      amount,
      currency, // ETH ili MATIC (POL u UI pretvaramo u MATIC)
    } = body

    if (!product_id || !email || !wallet_address || !amount || !currency) {
      console.warn('❌ Missing required fields')
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const finalCurrency = currency === 'POL' ? 'MATIC' : currency
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL

    const paymentPayload = {
      price_amount: amount,
      price_currency: finalCurrency,
      pay_currency: finalCurrency, // FIX: 'any' je odbijen od NOWPayments
      ipn_callback_url: `${baseUrl}/api/webhook/nowpayments`,
      order_id: `${product_id}_${Date.now()}`,
      order_description: `Mint access to: ${product_id}`,
      // FIX: vraćamo product_id u app kroz query param
      success_url: `${baseUrl}/status/success?product_id=${product_id}`,
      cancel_url: `${baseUrl}/status/cancel?product_id=${product_id}`,
      customer_email: email,
    }

    console.log('➡️ Sending to NOWPayments:', paymentPayload)

    const paymentRes = await fetch('https://api.nowpayments.io/v1/payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.NOWPAYMENTS_API_KEY,
      },
      body: JSON.stringify(paymentPayload),
    })

    const responseBody = await paymentRes.json()
    console.log('✅ NOWPayments response:', responseBody)

    if (!paymentRes.ok) {
      return NextResponse.json(
        { error: responseBody.message || 'NOWPayments API error' },
        { status: 500 }
      )
    }

    return NextResponse.json({ payment_url: responseBody.invoice_url })
  } catch (error) {
    console.error('🔥 Server error in /api/payment/create:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

