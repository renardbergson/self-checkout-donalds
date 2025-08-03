import { ConsumptionMethod } from "@prisma/client";
import { notFound } from "next/navigation";

import { database } from "@/lib/prisma";

import ProductContent from "./components/ProductContent";
import ProductHeader from "./components/ProductHeader";

interface ProductPageProps {
  params: Promise<{ slug: string; productID: string }>;
  searchParams?: Record<string, string | undefined>;
  // with Record we're saying: the key is string and the
  // value can be string or undefined
}

const ProductPage = async ({ params, searchParams }: ProductPageProps) => {
  // When we're in a server component, Next automatically invokes it's function Page()
  // with an object containing:
  // - params: route parameters (like [slug] and [productID])
  // - searchParams: query parameters (like ?consumptionMethod=...)

  const { slug, productID } = await params;
  const rawConsumptionMethod = searchParams?.consumptionMethod?.toUpperCase();
  const validConsumptionMethods = Object.values(ConsumptionMethod);

  // We check if the consumptionMethod is valid before proceeding to fetch the product
  if (
    !rawConsumptionMethod ||
    !validConsumptionMethods.includes(rawConsumptionMethod as ConsumptionMethod)
  ) {
    return notFound();
  }

  const product = await database.product.findUnique({
    where: { id: productID },
    include: {
      restaurant: {
        /* 
          Instead of selecting all fields from Restaurant, we can
          select only the fields we need in this case!
        */
        select: {
          name: true,
          avatarImageUrl: true,
          slug: true,
        },
      },
    },
  });

  if (!product) {
    return notFound();
  }

  if (product.restaurant.slug.toLowerCase() !== slug.toLowerCase()) {
    // If the found product and it's restaurant/slug is different of slug
    // from url, return notFound()
    // For example, that means: this product does not belong to the restaurant
    // (slug) provided in the URL
    return notFound();
  }

  return (
    <div className="flex h-screen flex-auto flex-col">
      <ProductHeader product={product} />
      <ProductContent product={product} />
    </div>
  );
};

export default ProductPage;
