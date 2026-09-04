import { createSlice, createSelector } from "@reduxjs/toolkit";

const initialState = {
  items: [],
};

export const itemSlice = createSlice({
  name: "item",
  initialState,
  reducers: {
    increaseItemCount: (state, action) => {
      state.items = [...state.items, action.payload];
    },
    decreaseItemCount: (state, action) => {
      const index = state.items.findIndex(
        (item) => item.id === action.payload.id
      );
      let newCart = [...state.items];

      if (index >= 0) {
        newCart.splice(index, 1);
      } else {
        console.warn(
          `Cant remove item (id: ${action.payload.id}) from cart as it is not in the cart!`
        );
      }

      state.items = newCart;
    },
    setItemQuantity: (state, action) => {
      const { id, quantity, lineId } = action.payload;
      const matches = state.items.filter((i) => i.id === id);
      const currentQty = matches.length;
      if (quantity > currentQty) {
        const extras = quantity - currentQty;
        const template = matches[0] || { id, name: "Item", price: 0 };
        const additions = Array.from({ length: extras }).map(() => ({
          ...template,
          lineId: lineId || template.lineId,
        }));
        state.items = [...state.items, ...additions];
      } else if (quantity < currentQty) {
        const toRemove = currentQty - quantity;
        let removed = 0;
        state.items = state.items.filter((i) => {
          if (i.id === id && removed < toRemove) {
            removed += 1;
            return false;
          }
          return true;
        });
      }
    },
    removeItemLine: (state, action) => {
      const lineId = action.payload;
      state.items = state.items.filter((i) => i.lineId !== lineId);
    },
    clearCart: (state) => {
      state.items = [];
    },
    seedCart: (state, action) => {
      const items = action.payload || [];
      state.items = [...state.items, ...items];
    },
  },
});

export const {
  increaseItemCount,
  decreaseItemCount,
  setItemQuantity,
  removeItemLine,
  clearCart,
  seedCart,
} = itemSlice.actions;

export const selectItems = (state) => state.item.items;

export const selectItemsWithId = (state, id) =>
  state.item.items.filter((object) => object.id === id);

export const selectItemsTotal = createSelector([selectItems], (items) =>
  items.reduce((total, item) => (total += item.price || 0), 0)
);

export const selectItemCount = (state) => state.item.items.length;

export const selectCartLines = createSelector([selectItems], (items) => {
  const map = new Map();
  for (const item of items) {
    const key = item.lineId || item.id;
    if (!map.has(key)) {
      map.set(key, {
        lineId: key,
        id: item.id,
        name: item.name,
        image: item.image,
        description: item.description,
        price: item.price,
        quantity: 0,
        items: [],
      });
    }
    const line = map.get(key);
    line.quantity += 1;
    line.price = item.price || line.price;
    line.items.push(item);
  }
  return Array.from(map.values());
});

export default itemSlice.reducer;