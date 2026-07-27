export const getCurrentUser = () => {
    return JSON.parse(sessionStorage.getItem("current_user")) || {};
};

export const saveCurrentUser = (users) => {
    sessionStorage.setItem("current_user", JSON.stringify(users));
};

export const getUsers = () => {
    return JSON.parse(localStorage.getItem("users")) || [];
};

export const saveUsers = (users) => {
    localStorage.setItem("users", JSON.stringify(users));
};