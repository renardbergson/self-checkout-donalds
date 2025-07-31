"use client";

import { Prisma } from "@prisma/client";
import {
  ChefHatIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  NotebookPen,
} from "lucide-react";
import Image from "next/image";
import { useContext, useState } from "react";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CartContext } from "@/contexts/cartContext";
import { formatCurrency } from "@/helpers/formatCurrency";

import CartSheet from "./CartSheet";

interface ProductContentProps {
  /* 
    If we want to specify only the fields we need, it's
    necessary to do it here as well
  */
  product: Prisma.ProductGetPayload<{
    include: {
      restaurant: {
        select: {
          name: true;
          avatarImageUrl: true;
        };
      };
    };
  }>;
}

const ProductContent = ({ product }: ProductContentProps) => {
  const { toggleCart, addProduct } = useContext(CartContext);
  const [quantity, setQuantity] = useState(1);

  function handleDecreaseQuantity() {
    return setQuantity((prev) => (prev > 1 ? prev - 1 : prev));
  }
  function handleIncreaseQuantity() {
    return setQuantity((prev) => prev + 1);
  }
  function handleAddToCart() {
    addProduct({
      ...product,
      quantity: quantity,
    });
    toggleCart();
  }

  return (
    <div className="relative z-50 mt-[-1.5rem] flex flex-auto flex-col overflow-hidden rounded-t-3xl bg-slate-50 p-5">
      {/* Conteúdo Central */}
      <div className="flex-auto overflow-hidden">
        {/* Restaurante */}
        <div className="flex items-center gap-2">
          <Image
            src={product.restaurant.avatarImageUrl}
            alt={product.restaurant.name}
            width={18}
            height={18}
            className="rounded-full"
          />
          <p className="text-xs text-muted-foreground">
            {product.restaurant.name}
          </p>
        </div>

        {/* Nome do produto */}
        <h2 className="mt-1 text-base font-semibold">{product.name}</h2>

        {/* Preço e quantidade */}
        <div className="mt-4 flex items-center justify-between">
          <h3 className="text-xl font-semibold">
            {formatCurrency(product.price)}
          </h3>
          <div className="flex items-center gap-3 text-center">
            <Button
              variant={"outline"}
              className="h-8 w-8 rounded-xl"
              onClick={handleDecreaseQuantity}
            >
              <ChevronLeftIcon />
            </Button>
            <p className="w-4">{quantity}</p>
            <Button
              variant={"destructive"}
              className="h-8 w-8 rounded-xl"
              onClick={handleIncreaseQuantity}
            >
              <ChevronRightIcon />
            </Button>
          </div>
        </div>

        {/* Área de Scroll */}
        <ScrollArea className="h-4/5">
          {/* Descrição do produto */}
          <div className="mt-6 space-y-3">
            <div className="flex items-center gap-2">
              <NotebookPen size={18} />
              <h4 className="font-semibold">Descrição</h4>
            </div>
            <p className="text-sm text-muted-foreground">
              {product.description}
            </p>
          </div>

          {/* Ingredientes */}
          <div className="mt-6 space-y-3">
            <div className="flex items-center gap-2">
              <ChefHatIcon size={18} />
              <h4 className="font-semibold">Ingredientes</h4>
            </div>
            <ul className="list-disc">
              {product.ingredients.map((ingredient, index) => (
                <li key={index} className="ml-4 text-sm text-muted-foreground">
                  {ingredient}
                </li>
              ))}
            </ul>
          </div>
        </ScrollArea>
      </div>

      {/* Adicionar à sacola */}
      <Button className="mt-6 w-full rounded-full" onClick={handleAddToCart}>
        Adicionar à sacola
      </Button>

      {/* Cart Sheet */}
      <CartSheet />
    </div>
  );
};

export default ProductContent;
