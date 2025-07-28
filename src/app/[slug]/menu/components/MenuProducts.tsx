import { Product } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";

interface MenuProductsProps {
  products: Product[];
}

const MenuProducts = ({ products }: MenuProductsProps) => {
  /**
   * This component is **implicitly a Client Component**
   * because it's rendered inside another component
   * that contains `"use client"` at the top.
   *
   * ✅ Even though this file does not include `"use client"`,
   *    it will still be bundled and executed on the client side,
   *    even because it's not allowed to render a server component
   *    inside a client component!
   *
   * 🧠 In Next.js (App Router), once a component is marked as
   *    a Client Component, all components it renders (directly or indirectly)
   *    are also treated as client components.
   *
   *    Example of the chain:
   *    → Content (with "use client")
   *    → Products (inherits client behavior)
   */

  // So, here we can use hooks...
  const { slug } = useParams<{ slug: string }>();

  return (
    <div className="flex flex-col gap-6 px-5">
      {products.map((product) => (
        <Link
          href={`/${slug}/menu/${product.id}`}
          key={product.id}
          className="flex w-full items-center justify-between gap-5 border-b py-3"
        >
          {/* LEFT */}
          <div>
            <h3 className="text-sm font-medium">{product.name}</h3>
            <p className="line-clamp-2 text-sm text-muted-foreground">
              {product.description}
            </p>
            <p className="pt-3 text-sm font-semibold">
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(product.price)}
            </p>
          </div>
          {/* RIGHT */}
          <div className="relative min-h-[82px] min-w-[120px]">
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="rounded-lg object-contain"
            />
          </div>
        </Link>
      ))}
    </div>
  );
};

export default MenuProducts;
