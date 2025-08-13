"use server";

import { ConsumptionMethod } from "@prisma/client";
import { headers } from "next/headers";
import Stripe from "stripe";

import { CartProduct } from "@/contexts/cartContext";
import { database } from "@/lib/prisma";

interface CreateStripeCheckoutData {
  // Here we say which products users will pay for
  products: CartProduct[];
  orderId: number;
  slug: string;
  consumptionMethod: ConsumptionMethod;
}

export async function createStripeCheckout({
  products,
  orderId,
  slug,
  consumptionMethod,
}: CreateStripeCheckoutData) {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("Stripe secret key is not defined");
  }

  const productsWithPrices = await database.product.findMany({
    where: {
      id: {
        in: products.map((product) => product.id),
        // We're saying: prisma, find the products which
        // id matches any of the ids we're receiving IN
        // data.products
        // That way we also get the price directly from
        // the database without trusting only the client
        // to send it correctly
      },
    },
  });

  const reqHeaders = await headers();
  const origin = reqHeaders.get("origin")!;
  const url = `${origin}/${slug}/menu?consumptionMethod=${consumptionMethod}`;

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2025-02-24.acacia",
  });

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment", // pay once
    line_items: products.map((product) => ({
      price_data: {
        currency: "brl",
        product_data: {
          name: product.name,
          images: [product.imageUrl],
        },
        unit_amount:
          (productsWithPrices.find((p) => p.id === product.id)?.price ?? 0) *
          100,
        // 📌 if price is not found, the amount will be 0
        // Stripe expects the amount in cents
      },
      quantity: product.quantity,
    })),
    success_url: url, // URL to redirect after successful payment
    cancel_url: url, // URL to redirect if payment is canceled
    metadata: { orderId }, // we pass the orderId here so the webhook knows which order to update
  });

  return { sessionId: session.id };
}
