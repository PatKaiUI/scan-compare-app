import create from "zustand";

export const useFavoriteStore = create((set) => ({
  favorites: [],
  addFavorite: (product) =>
    set((state) => ({
      favorites: [...state.favorites, product],
    })),
  removeFavorites: (barcode) =>
    set((state) => ({
      favorites: state.favorites.filter((p) => p.barcode !== barcode),
    })),
}));
