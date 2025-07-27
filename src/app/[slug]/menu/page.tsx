import { notFound } from "next/navigation";

import { database } from "@/lib/prisma";

import Content from "./components/Content";
import Header from "./components/Header";

interface RestaurantMenuPageProps {
  params: Promise<{ slug: string }>; // route parameter
  searchParams: Promise<{ consumptionMethod: string }>; // query parameter
}

const consumptionMethodIsValid = (consumptionMethod: string) => {
  const result = ["dine_in", "takeaway"].includes(
    consumptionMethod.toLocaleLowerCase(),
  );
  return result;
};

const restaurantMenuPage = async ({
  params,
  searchParams,
}: RestaurantMenuPageProps) => {
  const { slug } = await params;
  const { consumptionMethod } = await searchParams;
  const restaurant = await database.restaurant.findUnique({
    where: { slug },
    include: {
      menuCategories: {
        // join menu categories from payload
        include: { products: true }, // join products from payload
      },
    },
  });

  // URL error handling
  if (!consumptionMethodIsValid(consumptionMethod)) {
    return notFound();
  }
  if (!restaurant) {
    return notFound();
  }

  return (
    <div>
      <Header restaurant={restaurant} />
      <Content restaurant={restaurant} />
    </div>
  );
};

export default restaurantMenuPage;
