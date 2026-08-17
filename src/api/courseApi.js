import api from "./api";

export const courseApi = {
    getCourses: (params) => api.get("/api/courses", { params }),
    createCourse: (data) => api.post("/api/courses/create", data),
    getCategories: () => api.get("/api/courses/categories"),
    getCourseById: (id) => api.get(`/api/courses/details/${id}`),
    enrollInCourse: (id) => api.post(`/api/courses/enroll/${id}`),
    getMyLearning: () => api.get("/api/courses/my-learning"),
    saveCourse: (id) => api.post(`/api/courses/save/${id}`),
    completeLesson: (id, lessonId) =>
        api.post(`/api/courses/complete-lesson/${id}`, { lessonId }),
};

export default courseApi;

