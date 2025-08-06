"use client";

import { Product } from "@prisma/client";
import { createContext, useState } from "react";

export interface CartProduct
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
  decreaseProductQuantity: (productID: string) => void;
  increaseProductQuantity: (productID: string) => void;
  removeProduct: (productID: string) => void;
  clearCart: () => void;
  totalPrice: number;
  totalQuantity: number;
}

export const CartContext = createContext<ICartContext>({
  // here we declare the default values for the context
  // this is useful to avoid errors when using the context
  // before the provider is mounted
  isOpen: false,
  products: [],
  toggleCart: () => {},
  addProduct: () => {},
  decreaseProductQuantity: () => {},
  increaseProductQuantity: () => {},
  removeProduct: () => {},
  clearCart: () => {},
  totalPrice: 0,
  totalQuantity: 0,
});

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [products, setProducts] = useState<CartProduct[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const totalPrice = products.reduce((sum, product) => {
    return sum + product.price * product.quantity;
  }, 0);
  const totalQuantity = products.reduce((sum, product) => {
    return sum + product.quantity;
  }, 0);

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

  function decreaseProductQuantity(productID: string) {
    setProducts((prevProducts) => {
      return prevProducts.map((cartProduct) => {
        // it's not the product we're interested in
        if (cartProduct.id !== productID) {
          return cartProduct;
        }
        // this is the product we might want to decrease quantity
        if (cartProduct.quantity === 1) {
          return cartProduct;
        } else {
          return { ...cartProduct, quantity: cartProduct.quantity - 1 };
        }
      });
    });
  }

  function increaseProductQuantity(productID: string) {
    setProducts((prevProducts) => {
      return prevProducts.map((cartProduct) => {
        if (cartProduct.id !== productID) {
          return cartProduct;
        } else {
          return {
            ...cartProduct,
            quantity: cartProduct.quantity + 1,
          };
        }
      });
    });
  }

  function removeProduct(productID: string) {
    setProducts((prevProducts) =>
      prevProducts.filter((cartProduct) => cartProduct.id !== productID),
    );
  }

  function clearCart() {
    toggleCart();
    setProducts([]);
  }

  return (
    <CartContext.Provider
      /* real values that will be provided to children components */
      value={{
        isOpen,
        products,
        toggleCart,
        addProduct,
        decreaseProductQuantity,
        increaseProductQuantity,
        removeProduct,
        totalPrice,
        totalQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
