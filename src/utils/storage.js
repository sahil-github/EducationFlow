// Storage utilities — localStorage and sessionStorage helpers.
// This file was previously named 'utils/store.js'.
// All new imports should reference this file.

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

export const getUsers = () => {
    return JSON.parse(localStorage.getItem("users")) || [];
};

export const saveUsers = (users) => {
    localStorage.setItem("users", JSON.stringify(users));
};

// ---------------------------------------------------------------------------
// upsertUser
// Insert-or-update a user in the persistent users[] array by email.
// Every onboarding step that saves progress should call this so that
// data is never silently lost when the user is not yet in the array.
// ---------------------------------------------------------------------------
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

// ---------------------------------------------------------------------------
// mergeLocalOnboardingData
// After a successful backend login the server returns a user object that
// has NO onboarding fields (because we have no backend onboarding API yet).
// This function looks up the same email in the local users[] array and
// merges any locally-stored onboarding fields back onto the backend user so
// that onboardingCompleted, interests, learningGoal, skills, bio and location
// are never lost across logout → login cycles.
// ---------------------------------------------------------------------------
const ONBOARDING_FIELDS = [
    "onboardingCompleted",
    "interests",
    "learningGoal",
    "skills",
    "bio",
    "location",
];

export const mergeLocalOnboardingData = (backendUser) => {
    if (!backendUser?.email) return backendUser;
    const localUser = getUsers().find((u) => u.email === backendUser.email);
    if (!localUser) return backendUser;

    const onboardingPatch = {};
    ONBOARDING_FIELDS.forEach((field) => {
        if (localUser[field] !== undefined) {
            onboardingPatch[field] = localUser[field];
        }
    });

    return { ...backendUser, ...onboardingPatch };
};

