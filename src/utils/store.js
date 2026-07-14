export const getCurrentUser = () => {
    return JSON.parse(localStorage.getItem("current_user")) || {};
};

export const saveCurrentUser = (user) => {
    localStorage.setItem("current_user", JSON.stringify(user));
};

export const getUsers = () => {
    return JSON.parse(localStorage.getItem("users")) || [];
};

export const saveUsers = (users) => {
    localStorage.setItem("users", JSON.stringify(users));
};