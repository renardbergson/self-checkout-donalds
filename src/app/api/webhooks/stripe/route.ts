// An web hook is an endpoint from our application that will be
// called (POST) by an external service when a specific event happens.
// We need them so our application can react automatically to these events.
// for example: update order status when payment is finished, without depending
// on the user returning to our site after payment.

import { OrderStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import Stripe from "stripe";

import { database } from "@/lib/prisma";

function verifyEnvVar(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}

async function handleOrderStatus(
  event: Stripe.CheckoutSessionCompletedEvent | Stripe.ChargeFailedEvent,
  status: OrderStatus,
) {
  const orderId = event.data.object.metadata?.orderId;
  if (!orderId) {
    // 📌 "orderId" is passed as metadata within "createStripeCheckout" action
    return new Response("Order ID not found in metadata", {
      status: 400,
    });
  }

  const order = await database.order.update({
    where: { id: Number(orderId) }, // 📌 id is type Int in the database
    data: { status: status },
    include: {
      restaurant: {
        select: {
          slug: true,
        },
      },
    },
  });

  revalidatePath(`/${order.restaurant.slug}/orders`);
  // 📌 It's advisable to use revalidatePath() when a server action changes data
  // that is used in an specific page and we want to make sure that page will
  // reflect the latest data after the action is done.
  // Without it, the user will be redirected to the page and it might not show
  // the new order yet...
}

export async function POST(request: Request) {
  // The webhook will call this endpoint with a POST request
  const STRIPE_SECRET_KEY = verifyEnvVar("STRIPE_SECRET_KEY");
  const STRIPE_WEBHOOK_SECRET_KEY = verifyEnvVar("STRIPE_WEBHOOK_SECRET_KEY");

  const stripe = new Stripe(STRIPE_SECRET_KEY, {
    apiVersion: "2025-02-24.acacia",
  });

  const signature = request.headers.get("stripe-signature");
  if (!signature)
    return new Response("Missing Stripe signature", { status: 400 });

  const text = await request.text();
  const event = stripe.webhooks.constructEvent(
    text,
    signature,
    STRIPE_WEBHOOK_SECRET_KEY,
  );

  switch (event.type) {
    case "checkout.session.completed":
      {
        const status: OrderStatus = "PAYMENT_CONFIRMED";
        await handleOrderStatus(event, status);
      }
      break;

    case "charge.failed":
      {
        const status: OrderStatus = "PAYMENT_FAILED";
        await handleOrderStatus(event, status);
      }
      break;

    default:
      break;
  }

  // This response will be sent in both successful and failed events...
  return NextResponse.json({ received: true }, { status: 200 });
}
