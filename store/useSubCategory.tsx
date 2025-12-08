import { create } from "zustand";
import axios from "axios";

interface SubCategory {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  parentCategory: string;
}

interface SubCategoryStore {
  subCategories: SubCategory[];
  loading: boolean;

  fetchSubCategories: () => Promise<void>;
  fetchSubCategoriesByParent: (categoryId: string) => Promise<void>;
  
  addSubCategory: (newSub: SubCategory) => void;
}

export const useSubCategoryStore = create<SubCategoryStore>((set) => ({
  subCategories: [],
  loading: false,

  // Fetch ALL subcategories
  fetchSubCategories: async () => {
    try {
      set({ loading: true });

      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_ADDRESS}/api/v1/sub-category/get-all-sub-categories`
      );

      set({ subCategories: data.subCategories, loading: false });
    } catch (error) {
      console.log("Fetch sub-category error:", error);
      set({ loading: false });
    }
  },

  // Fetch subcategories for a specific parent
  fetchSubCategoriesByParent: async (categoryId: string) => {
    try {
      set({ loading: true });

      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_ADDRESS}/api/v1/sub-category/by-parent/${categoryId}`
      );

      set({ subCategories: data.subCategories, loading: false });
    } catch (error) {
      console.log("Fetch sub-category error:", error);
      set({ loading: false });
    }
  },

  // Add new sub-category locally
  addSubCategory: (newSub) =>
    set((state) => ({
      subCategories: [...state.subCategories, newSub],
    })),
}));
