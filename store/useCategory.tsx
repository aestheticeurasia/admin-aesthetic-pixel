import { create } from "zustand";
import axios from "axios";

interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
}

interface CategoryStore {
  categories: Category[];
  loading: boolean;
  fetchCategories: () => Promise<void>;
  addCategory: (newCategory: Category) => void;
}

export const useCategoryStore = create<CategoryStore>((set) => ({
  categories: [],
  loading: false,

  fetchCategories: async () => {
    try {
      set({ loading: true });

      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_ADDRESS}/api/v1/category/get-all-categories`
      );

      set({ categories: data.categories, loading: false });
    } catch (error) {
      console.log("Fetch category error:", error);
      set({ loading: false });
    }
  },

  addCategory: (newCategory) =>
    set((state) => ({
      categories: [...state.categories, newCategory],
    })),
}));