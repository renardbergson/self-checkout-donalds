import { cookies } from "next/headers";

import { database } from "@/lib/prisma";

import { isValidCpf, removeCpfPunctuation } from "../menu/helpers/cpf";
import NoCpf from "./components/NoCpf";
import Orders from "./components/Orders";

const OrdersPage = async () => {
  const cpf = (await cookies()).get("cpf")?.value;

  if (!cpf) {
    return <NoCpf />;
  }

  if (!isValidCpf(cpf)) {
    return <NoCpf />;
  }

  const orders = await database.order.findMany({
    orderBy: {
      createdAt: "desc",
    },
    where: {
      customerCpf: removeCpfPunctuation(cpf),
    },
    include: {
      restaurant: {
        select: {
          name: true,
          avatarImageUrl: true,
          slug: true,
        },
      },
      orderProducts: {
        include: {
          product: true,
        },
      },
    },
  });

  return (
    <div>
      <Orders orders={orders} />
    </div>
  );
};

export default OrdersPage;
