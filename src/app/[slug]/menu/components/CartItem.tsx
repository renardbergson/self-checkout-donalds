import { ChevronLeftIcon, ChevronRightIcon, Trash2Icon } from "lucide-react";
import Image from "next/image";
import { useContext } from "react";

import { Button } from "@/components/ui/button";
import { CartContext } from "@/contexts/cartContext";
import { CartProduct } from "@/contexts/cartContext";
import { formatCurrency } from "@/helpers/formatCurrency";

interface CartItemProps {
  product: CartProduct;
}

const CartItem = ({ product }: CartItemProps) => {
  const { decreaseProductQuantity, increaseProductQuantity, removeProduct } =
    useContext(CartContext);

  return (
    <>
      <div className="flex items-center justify-between">
        {/* Esquerda - Produto */}
        <div className="flex items-center gap-3">
          {/* Foto Produto */}
          <div className="relative min-h-20 min-w-20 rounded-lg bg-gray-200">
            <Image src={product.imageUrl} alt={product.name} fill />
          </div>
          {/* Nome, preço e quantidade */}
          <div className="space-y-1">
            <p className="line-clamp-1 max-w-[90%] text-xs">{product.name}</p>
            <p className="text-sm font-semibold">
              {formatCurrency(product.price)}
            </p>
            <div className="flex items-center gap-1 text-center">
              <Button
                className="h-7 w-7 rounded-lg"
                variant={"outline"}
                onClick={() => decreaseProductQuantity(product.id)}
              >
                <ChevronLeftIcon />
              </Button>
              <p className="w-7 text-sm">{product.quantity}</p>
              <Button
                className="h-7 w-7 rounded-lg"
                variant={"destructive"}
                onClick={() => increaseProductQuantity(product.id)}
              >
                <ChevronRightIcon />
              </Button>
            </div>
          </div>
        </div>
        {/* Direita - botão excluir */}
        <Button
          variant={"outline"}
          className="h-7 w-7 rounded-lg"
          onClick={() => removeProduct(product.id)}
        >
          <Trash2Icon />
        </Button>
      </div>

      <hr className="my-5" />
    </>
  );
};

export default CartItem;
