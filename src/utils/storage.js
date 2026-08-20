// Storage utilities — localStorage and sessionStorage helpers.

export const getCurrentUser = () => {
    const sessionUser = sessionStorage.getItem("current_user");
    if (sessionUser) {
        try { return JSON.parse(sessionUser); } catch { }
    }
    const localUser = localStorage.getItem("user");
    if (localUser) {
        try { return JSON.parse(localUser); } catch { }
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

// ── Settings persistence ─────────────────────────────────────────────────────
const SETTINGS_KEY = "ef_settings";

export const getSettings = () => {
    try {
        const raw = localStorage.getItem(SETTINGS_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
};

export const saveSettings = (settingsData) => {
    if (settingsData) {
        try {
            localStorage.setItem(SETTINGS_KEY, JSON.stringify(settingsData));
        } catch {
            // ignore storage quota errors
        }
    }
};

export const clearSettings = () => {
    localStorage.removeItem(SETTINGS_KEY);
};

export const getUsers = () => {
    return JSON.parse(localStorage.getItem("users")) || [];
};

export const saveUsers = (users) => {
    localStorage.setItem("users", JSON.stringify(users));
};

export const upsertUser = (updatedUser) => {
    if (!updatedUser?.email) return;
    const users = getUsers();
    const idx = users.findIndex((u) => u.email === updatedUser.email);
    if (idx !== -1) {
        users[idx] = { ...users[idx], ...updatedUser };
    } else {
        users.push(updatedUser);
    }
    saveUsers(users);
};
