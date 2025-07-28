"use client"; // so we can use "useRouter" to go back

import { Product } from "@prisma/client";
import { ChevronLeftIcon, ShoppingCart } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

interface ProductHeaderProps {
  product: Pick<Product, "name" | "imageUrl">;
  // TypeScript's Pick utility lets us create a new type with only the fields we need.
  // Here, we extract just "name" and "imageUrl" from the full Product type.
}

const ProductHeader = ({ product }: ProductHeaderProps) => {
  const router = useRouter();

  return (
    <div className="relative min-h-[300px] w-full">
      <Button
        variant="secondary"
        size="icon"
        className="absolute left-5 top-5 z-50 rounded-full"
        onClick={() => router.back()} // This will navigate back to the previous page
      >
        <ChevronLeftIcon />
      </Button>

      <Image
        src={product.imageUrl}
        alt={product.name}
        fill
        className="object-cover"
      />

      <Button
        variant="secondary"
        size="icon"
        className="absolute right-5 top-5 z-50 rounded-full"
      >
        <ShoppingCart />
      </Button>
    </div>
  );
};

export default ProductHeader;
