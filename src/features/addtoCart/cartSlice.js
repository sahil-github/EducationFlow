import { createSlice } from "@reduxjs/toolkit";

const CART_STORAGE_KEY = "ef_cart";

/**
 * Safely load cart items from localStorage.
 * Handles missing, null, or corrupted data gracefully without crashing.
 */
const loadCartFromStorage = () => {
    try {
        const serialized = localStorage.getItem(CART_STORAGE_KEY);
        if (!serialized) return [];
        const parsed = JSON.parse(serialized);
        return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
        console.error("Failed to load cart from localStorage:", error);
        return [];
    }
};

/**
 * Safely persist cart items to localStorage.
 */
const saveCartToStorage = (items) => {
    try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
        console.error("Failed to save cart to localStorage:", error);
    }
};

/**
 * Extract a stable identifier from a course item.
 */
export const getCourseId = (course) => {
    if (!course) return null;
    return course.id || course._id || course.courseId || null;
};

const initialState = {
    items: loadCartFromStorage(),
};

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const course = action.payload;
            if (!course) return;

            const courseId = getCourseId(course);
            if (!courseId) return;

            const alreadyExists = state.items.some(
                (item) => getCourseId(item) === courseId
            );

            if (!alreadyExists) {
                state.items.push(course);
                saveCartToStorage(state.items);
            }
        },

        removeFromCart: (state, action) => {
            const targetId =
                typeof action.payload === "object"
                    ? getCourseId(action.payload)
                    : action.payload;

            if (!targetId) return;

            state.items = state.items.filter(
                (item) => getCourseId(item) !== targetId
            );
            saveCartToStorage(state.items);
        },

        clearCart: (state) => {
            state.items = [];
            saveCartToStorage([]);
        },
    },
});

export const {
    addToCart,
    removeFromCart,
    clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;