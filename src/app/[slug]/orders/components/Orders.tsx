import { OrderStatus, Prisma } from "@prisma/client";
import { ChevronLeftIcon } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/helpers/formatCurrency";

interface OrdersProps {
  orders: Array<
    Prisma.OrderGetPayload<{
      include: {
        restaurant: {
          select: {
            name: true;
            avatarImageUrl: true;
          };
        };
        orderProducts: {
          include: {
            product: true;
          };
        };
      };
    }>
  >;
}

const Orders = ({ orders }: OrdersProps) => {
  const orderLabels: Record<OrderStatus, string> = {
    PENDING: "Pendente",
    IN_PREPARATION: "Em Preparação",
    CANCELED: "Cancelado",
    FINISHED: "Finalizado",
  };

  function getOrderTime(time: Date) {
    const date = new Date(time);
    const formattedDate = new Intl.DateTimeFormat("pt-BR", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(date);
    return formattedDate;
  }

  return (
    <div className="space-y-8 p-6">
      <Button size="icon" variant="secondary" className="rounded-full">
        <ChevronLeftIcon className="" />
      </Button>

      <h2 className="text-lg font-semibold">Meus Pedidos</h2>

      {orders.map((order) => (
        <Card key={order.id}>
          <CardContent className="space-y-4 p-5">
            <div
              className={`w-fit rounded-full px-2 py-1 text-xs font-semibold text-white ${order.status === OrderStatus.FINISHED ? "bg-green-500" : "bg-gray-400"}`}
            >
              {orderLabels[order.status]}
            </div>
            <div className="flex items-center gap-2">
              <div className="relative h-5 w-5">
                <Image
                  src={order.restaurant.avatarImageUrl}
                  alt={order.restaurant.name}
                  fill
                  className="rounded-sm"
                />
              </div>
              <p className="text-sm font-semibold">{order.restaurant.name}</p>
            </div>

            <Separator />

            {order.orderProducts.map((orderProduct) => (
              <div key={orderProduct.id} className="flex items-center gap-2">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-400 text-xs font-semibold text-white">
                  {orderProduct.quantity}
                </div>
                <p className="text-sm">{orderProduct.product.name}</p>
              </div>
            ))}

            <p className="text-xs text-muted-foreground">
              {getOrderTime(order.createdAt)}
            </p>

            <Separator />

            <p className="text-sm font-medium">{formatCurrency(order.total)}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default Orders;
