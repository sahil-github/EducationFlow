import { createSlice } from "@reduxjs/toolkit";
import { loginUser, registerUser, socialLoginUser } from "../auth/authThunks";

/**
 * Extract the unique identifier for the current active user.
 * Prioritizes _id, id, userId, or email. Falls back to "guest" if unauthenticated.
 */
export const getActiveUserId = (userObj) => {
    if (userObj) {
        const id = userObj._id || userObj.id || userObj.userId || userObj.email;
        if (id) return String(id);
    }
    try {
        const sessionUser = sessionStorage.getItem("current_user");
        if (sessionUser) {
            const parsed = JSON.parse(sessionUser);
            const id = parsed?._id || parsed?.id || parsed?.userId || parsed?.email;
            if (id) return String(id);
        }
        const localUser = localStorage.getItem("user");
        if (localUser) {
            const parsed = JSON.parse(localUser);
            const id = parsed?._id || parsed?.id || parsed?.userId || parsed?.email;
            if (id) return String(id);
        }
    } catch (e) {
        console.warn("Failed to retrieve active user id for cart:", e);
    }
    return "guest";
};

/**
 * Build the user-specific localStorage key.
 * Example: "eduflow_cart_64b2f1..." or "eduflow_cart_guest"
 */
export const getCartStorageKey = (userId) => {
    const uid = userId || getActiveUserId();
    return `eduflow_cart_${uid}`;
};

/**
 * Safely load cart items for a specific user from localStorage.
 * Handles missing, null, or corrupted data gracefully without crashing.
 */
export const loadCartFromStorage = (userId) => {
    try {
        const key = getCartStorageKey(userId);
        const serialized = localStorage.getItem(key);
        if (!serialized) return [];
        const parsed = JSON.parse(serialized);
        return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
        console.error("Failed to load cart from localStorage:", error);
        return [];
    }
};

/**
 * Safely persist cart items for a specific user to localStorage.
 */
export const saveCartToStorage = (items, userId) => {
    try {
        const key = getCartStorageKey(userId);
        localStorage.setItem(key, JSON.stringify(items));
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

// Initial state hydrated for the currently logged-in user (or guest)
const initialUserId = getActiveUserId();

const initialState = {
    userId: initialUserId,
    items: loadCartFromStorage(initialUserId),
};

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        syncUserCart: (state, action) => {
            const user = action.payload;
            const uid = getActiveUserId(user);
            state.userId = uid;
            state.items = loadCartFromStorage(uid);
        },

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
                const uid = state.userId || getActiveUserId();
                saveCartToStorage(state.items, uid);
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
            const uid = state.userId || getActiveUserId();
            saveCartToStorage(state.items, uid);
        },

        clearCart: (state) => {
            state.items = [];
            const uid = state.userId || getActiveUserId();
            saveCartToStorage([], uid);
        },
    },
    extraReducers: (builder) => {
        builder
            // When user logs in, switch in-memory cart to that specific user's cart
            .addCase(loginUser.fulfilled, (state, action) => {
                const user = action.payload?.user;
                const uid = getActiveUserId(user);
                state.userId = uid;
                state.items = loadCartFromStorage(uid);
            })
            // When user registers, initialize/hydrate that specific user's cart
            .addCase(registerUser.fulfilled, (state, action) => {
                const user = action.payload?.user;
                const uid = getActiveUserId(user);
                state.userId = uid;
                state.items = loadCartFromStorage(uid);
            })
            // When social login succeeds, hydrate that specific user's cart
            .addCase(socialLoginUser.fulfilled, (state, action) => {
                const user = action.payload?.user;
                const uid = getActiveUserId(user);
                state.userId = uid;
                state.items = loadCartFromStorage(uid);
            })
            // When logging out, immediately clear Redux in-memory cart
            .addCase("auth/logout", (state) => {
                state.userId = "guest";
                state.items = [];
            })
            // When profile is fetched/updated, ensure user ID matches and cart is aligned
            .addCase("profile/getProfile/fulfilled", (state, action) => {
                const user = action.payload;
                const uid = getActiveUserId(user);
                if (uid && uid !== "guest" && state.userId !== uid) {
                    state.userId = uid;
                    state.items = loadCartFromStorage(uid);
                }
            });
    },
});

export const {
    syncUserCart,
    addToCart,
    removeFromCart,
    clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;