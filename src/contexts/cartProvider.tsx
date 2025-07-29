"use client";

import { Product } from "@prisma/client";
import { createContext, useState } from "react";

interface CartProduct
  extends Pick<Product, "id" | "name" | "price" | "imageUrl"> {
  // we extend Product (only the fields we need) because
  // it doesn't have the property below
  quantity: number;
}

export interface ICartContext {
  // I = interface
  isOpen: boolean;
  products: CartProduct[];
  toggleCart: () => void;
  addProduct: (product: CartProduct) => void;
}

export const CartContext = createContext<ICartContext>({
  // here we declare the default values for the context
  // this is useful to avoid errors when using the context
  // before the provider is mounted
  isOpen: false,
  products: [],
  toggleCart: () => {},
  addProduct: () => {},
});

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [products, setProducts] = useState<CartProduct[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  function toggleCart() {
    setIsOpen((prev) => !prev);
  }
  function addProduct(product: CartProduct) {
    const productIsAlreadyInTheCart = products.some(
      (cartProduct) => cartProduct.id === product.id,
    );
    // product is being added for the first time
    if (!productIsAlreadyInTheCart) {
      return setProducts((prevProducts) => [...prevProducts, product]);
    }
    // product is already in the cart
    setProducts((prevProducts) => {
      return prevProducts.map((cartProduct) => {
        if (cartProduct.id === product.id) {
          return {
            ...cartProduct,
            quantity: cartProduct.quantity + product.quantity,
          };
        } else {
          return cartProduct;
        }
      });
    });
  }

  return (
    <CartContext.Provider
      /* real values that will be provided to children components */
      value={{
        isOpen: isOpen,
        products: products,
        toggleCart: toggleCart,
        addProduct: addProduct,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
