import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Validate Razorpay webhook signature here
    // const crypto = require('crypto');
    // const expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET).update(JSON.stringify(body)).digest('hex');

    // if (req.headers.get('x-razorpay-signature') !== expectedSignature) {
    //   return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    // }

    // Handle 'payment.captured' event
    // Update invoice status in Supabase
    
    return NextResponse.json({ status: 'success' });
  } catch (error) {
    return NextResponse.json({ error: 'Webhook error' }, { status: 500 });
  }
}
