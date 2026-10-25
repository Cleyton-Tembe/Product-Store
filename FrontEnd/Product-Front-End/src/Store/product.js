import { create } from "zustand";

export const useProductStore = create((set) => ({
  products: [],
  setProducts: (products) => set({ products }),

  createProduct: async (newProduct) => {
    if (
      !newProduct.name?.trim() ||
      !newProduct.image ||
      !Number.isFinite(Number(newProduct.price)) ||
      Number(newProduct.price) <= 0
    ) {
      return {
        sucess: false,
        message: "Fill all fields correctly",
      };
    }

    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newProduct),
      });

      const data = await response.json();

      if (!response.ok || data.sucess === false || !data.data) {
        return {
          sucess: false,
          message: data.message || "Failed to create product",
        };
      }

      set((state) => ({
        products: [...state.products, data.data],
      }));

      return {
        sucess: true,
        message: data.message || "Product created successfully",
      };
    } catch (error) {
      return {
        sucess: false,
        message: error.message,
      };
    }
  },

  fetchProducts: async () => {
    const response = await fetch("/api/products/All", {
      method: "get",
      headers: {
        "content-type": "application/json",
      },
    });

    const data = await response.json();
    set({ products: data.data });
  },
  deleteProduct: async (id) => {
    const response = await fetch(`/api/products/delete/${id}`, {
      method: "delete",
      headers: {
        "content-type": "application/json",
      },
    });

    const data = await response.json();

    if (!data.sucess) return { sucess: false, message: data.message };

    set((prev) => ({
      products: prev.products.filter((prd) => prd._id !== id),
    }));

    return { sucess: true, message: data.message };
  },

  updateProduct: async (id, updated) => {
    const response = await fetch(`/api/products/update/${id}`, {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(updated),
    });

    const updatedData = await response.json();

    if (!updatedData && !updatedData.sucess)
      return { sucess: false, message: updatedData.message };

    set((prev) => ({
      products: prev.products.map((p) => {
        if (p._id === id) {
          return (p = updatedData.data);
        } else {
          return p;
        }
      }),
    }));

    return { sucess: true, message: updatedData.message };
  },
}));
