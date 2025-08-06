"use client";

import { Prisma } from "@prisma/client";
import { ClockIcon } from "lucide-react";
import Image from "next/image";
import { useContext, useState } from "react";

import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { CartContext } from "@/contexts/cartContext";
import { formatCurrency } from "@/helpers/formatCurrency";

import CartSheet from "../[productID]/components/CartSheet";
import MenuProducts from "./MenuProducts";

interface MenuContentProps {
  restaurant: Prisma.RestaurantGetPayload<{
    include: {
      menuCategories: {
        // join menu categories
        include: { products: true }; // join products
      };
    };
  }>;
}

type MenuCategoryWithProducts = Prisma.MenuCategoryGetPayload<{
  // join products
  include: { products: true };
}>;

const MenuContent = ({ restaurant }: MenuContentProps) => {
  const { products, totalPrice, totalQuantity, toggleCart } =
    useContext(CartContext);

  const [selectedCategory, setSelectedCategory] =
    useState<MenuCategoryWithProducts>(restaurant.menuCategories[0]);

  function handleMenuCategoryClick(category: MenuCategoryWithProducts) {
    setSelectedCategory(category);
  }
  function handleSelectedCategory(category: MenuCategoryWithProducts) {
    return category.id === selectedCategory.id ? "default" : "secondary";
  }

  return (
    <div className="relative z-50 mt-[-1.5rem] rounded-t-3xl bg-white">
      <div className="p-5">
        <div className="flex items-center gap-3">
          <Image
            src={restaurant.avatarImageUrl}
            alt={restaurant.name}
            width={45}
            height={45}
          />
          <div>
            <h2 className="text-lg font-semibold">{restaurant.name}</h2>
            <p className="text-xs opacity-55">{restaurant.description}</p>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-1 text-xs text-green-500">
          <ClockIcon size={12} />
          <p>Aberto</p>
        </div>
      </div>

      <ScrollArea className="w-full">
        <div className="flex w-max gap-4 p-5 pt-0">
          {restaurant.menuCategories.map((category) => (
            <Button
              key={category.id}
              variant={handleSelectedCategory(category)}
              className="rounded-full"
              onClick={() => handleMenuCategoryClick(category)}
            >
              {category.name}
            </Button>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      <h3 className="px-5 py-2 font-semibold">{selectedCategory.name}</h3>

      <MenuProducts products={selectedCategory.products} />

      {products.length > 0 && (
        <div className="fixed bottom-0 left-0 flex w-full items-center justify-between border-t bg-white px-5 py-3">
          <div>
            <p className="text-xs text-muted-foreground">Total dos pedidos</p>
            <p className="text-sm font-semibold">
              {formatCurrency(totalPrice)}
              <span className="text-xs font-normal text-muted-foreground">
                / {totalQuantity}
                {totalQuantity > 1 ? " itens" : " item"}
              </span>
            </p>
          </div>

          <Button className="px-6 py-2" onClick={toggleCart}>
            Ver Sacola
          </Button>

          <CartSheet />
        </div>
      )}
    </div>
  );
};

export default MenuContent;
