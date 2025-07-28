import { notFound } from "next/navigation";

import { database } from "@/lib/prisma";

import ProductContent from "./components/ProductContent";
import ProductHeader from "./components/ProductHeader";

interface ProductPageProps {
  params: Promise<{ slug: string; productID: string }>;
}

const ProductPage = async ({ params }: ProductPageProps) => {
  const { slug, productID } = await params;
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
  // If this product > restaurant/slug is different of slug from url, return notFound()
  // For example, that means: this product does not belong to the restaurant (slug) in
  // the URL
  if (product.restaurant.slug.toLocaleLowerCase() !== slug.toLowerCase()) {
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
