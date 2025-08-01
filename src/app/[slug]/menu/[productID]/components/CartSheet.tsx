import { useContext } from "react";

import { Card, CardContent } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { CartContext } from "@/contexts/cartContext";
import { formatCurrency } from "@/helpers/formatCurrency";

import CartItem from "../../components/CartItem";
import FinishOrder from "./FinishOrder";

const CartSheet = () => {
  const { isOpen, toggleCart, products, total } = useContext(CartContext);

  return (
    <Sheet open={isOpen} onOpenChange={toggleCart}>
      <SheetContent className="w-[80%]">
        <SheetHeader>
          <SheetTitle className="text-left">Sacola</SheetTitle>
        </SheetHeader>

        <div className="flex h-full flex-col py-5">
          <div className="flex-auto">
            {products.map((product) => (
              <CartItem key={product.id} product={product} />
            ))}
          </div>
          <Card className="mb-6">
            <CardContent className="flex justify-between p-5 text-sm">
              <p className="text-muted-foreground">Total</p>
              <p className="font-semibold">{formatCurrency(total)}</p>
            </CardContent>
          </Card>

          {/* Button, Drawer, Form and it's controls */}
          <FinishOrder />
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CartSheet;
