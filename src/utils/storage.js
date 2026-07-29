// Storage utilities — localStorage and sessionStorage helpers.
// This file was previously named 'utils/store.js'.
// All new imports should reference this file.

export const getCurrentUser = () => {
    const sessionUser = sessionStorage.getItem("current_user");
    if (sessionUser) {
        try { return JSON.parse(sessionUser); } catch(e) {}
    }
    const localUser = localStorage.getItem("user");
    if (localUser) {
        try { return JSON.parse(localUser); } catch(e) {}
    }
    return {};
};

export const saveCurrentUser = (user) => {
    if (user) {
        sessionStorage.setItem("current_user", JSON.stringify(user));
        localStorage.setItem("user", JSON.stringify(user));
        window.dispatchEvent(new Event("currentUserUpdate"));
    }
};

export const clearCurrentUser = () => {
    sessionStorage.removeItem("current_user");
    localStorage.removeItem("current_user");
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.dispatchEvent(new Event("currentUserUpdate"));
};

export const getUsers = () => {
    return JSON.parse(localStorage.getItem("users")) || [];
};

export const saveUsers = (users) => {
    localStorage.setItem("users", JSON.stringify(users));
};
