// SERVER ACTIONS
// Server actions are functions that can be executed on the Server
// but can be called from Client Components.
// They are useful for handling form submissions, data fetching, etc.
// In this case, we are using it to create an order.

"use server"; // Server actions must use this directive

import { ConsumptionMethod } from "@prisma/client";

import { database } from "@/lib/prisma";

import { removeCpfPunctuation } from "../helpers/cpf";

interface OrderData {
  customerName: string;
  customerCpf: string;
  slug: string;
  products: Array<{
    id: string;
    quantity: number;
    // It's not safe to receive the price explicitly,
    // so we're gonna look for it through the id
  }>;
  consumptionMethod: ConsumptionMethod;
}

export async function createOrder(data: OrderData) {
  const restaurant = await database.restaurant.findUnique({
    where: {
      slug: data.slug,
    },
  });

  if (!restaurant) {
    throw new Error("Restaurant not found");
  }

  const productsWithPrices = await database.product.findMany({
    where: {
      id: {
        in: data.products.map((product) => product.id),
        // We're saying: prisma, find the products which
        // id matches any of the ids we're receiving IN
        // data.products
        // That way we also get the price directly from
        // the database without trusting only the client
        // to send it correctly
      },
    },
  });

  const productsWithPricesAndQuantities = data.products.map((product) => ({
    productId: product.id,
    quantity: product.quantity,
    price: productsWithPrices.find((p) => p.id === product.id)!.price,
  }));

  await database.order.create({
    // 📌 Every field that doesn't have "data." is obtained inside this server action
    // 📌 The other ones are obtained in the client component (FinishOrder.tsx)
    data: {
      status: "PENDING",
      customerName: data.customerName,
      customerCpf: removeCpfPunctuation(data.customerCpf),
      restaurantId: restaurant.id,
      total: productsWithPricesAndQuantities.reduce((sum, product) => {
        return sum + product.price! * product.quantity;
      }, 0),
      consumptionMethod: data.consumptionMethod,
      // we also need to create a register of orderProduct
      // for each product we received in "data.products"
      orderProducts: {
        createMany: {
          data: productsWithPricesAndQuantities,
          // To get total, we need to know product price, quantity and price,
          // Because of that we put "productsWithPricesAndQuantities" outside
          // the "createMany" method
        },
      },
    },
  });
}
