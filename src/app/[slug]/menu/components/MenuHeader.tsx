"use client"; // so we can use "useRouter" to go back

import { Restaurant } from "@prisma/client";
import { ChevronLeftIcon, ScrollText } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

interface MenuHeaderProps {
  restaurant: Pick<Restaurant, "name" | "coverImageUrl" | "slug">;
  // TypeScript's Pick utility lets us create a new type with only the fields we need.
  // Here, we extract just "name" and "coverImageUrl" from the full Restaurant type.
}

const MenuHeader = ({ restaurant }: MenuHeaderProps) => {
  const router = useRouter();
  function handleGoToOrders() {
    router.push(`/${restaurant.slug}/orders`);
  }

  return (
    <div className="relative h-[250px] w-full">
      <Button
        variant="secondary"
        size="icon"
        className="absolute left-5 top-5 z-50 rounded-full"
        onClick={() => router.back()} // This will navigate back to the previous page
      >
        <ChevronLeftIcon />
      </Button>

      <Image
        src={restaurant.coverImageUrl}
        alt={restaurant.name}
        fill
        className="object-cover"
      />

      <Button
        variant="secondary"
        size="icon"
        className="absolute right-5 top-5 z-50 rounded-full"
        onClick={handleGoToOrders}
      >
        <ScrollText />
      </Button>
    </div>
  );
};

export default MenuHeader;
