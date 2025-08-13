import { NextResponse } from 'next/server'

export async function POST(req) {
  const body = await req.json()

  const {
    product_id,
    wallet_address,
    chain,
    amount,
    email,
  } = body

  const supabaseRes = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/transactions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
      Prefer: 'return=representation',
    },
    body: JSON.stringify({
      product_id,
      wallet_address,
      chain,
      amount,
      email,
      status: 'pending',
    }),
  })

  if (!supabaseRes.ok) {
    return NextResponse.json({ error: 'Failed to save transaction' }, { status: 500 })
  }

  const data = await supabaseRes.json()
  return NextResponse.json(data[0])
}

