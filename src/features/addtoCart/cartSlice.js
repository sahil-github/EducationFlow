import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    items: [],
};

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const course = action.payload;

            const alreadyExists = state.items.some(
                (item) => item.id === course.id
            );

            if (!alreadyExists) {
                state.items.push(course);
            }
        },

        removeFromCart: (state, action) => {
            state.items = state.items.filter(
                (item) => item.id !== action.payload
            );
        },

        clearCart: (state) => {
            state.items = [];
        },
    },
});

export const {
    addToCart,
    removeFromCart,
    clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;