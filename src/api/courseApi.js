import api from "./api";

export const courseApi = {
    getCourses: (params) => api.get("/api/courses", { params }),
    createCourse: (data) => api.post("/api/courses/create", data),
    getCategories: () => api.get("/api/courses/categories"),
    getCourseById: (id) => api.get(`/api/courses/details/${id}`),
    getCoursePlayer: (id) => api.get(`/api/courses/learn/${id}`),
    enrollInCourse: (id) => api.post(`/api/courses/enroll/${id}`),
    getMyLearning: () => api.get("/api/courses/my-learning"),
    saveCourse: (id) => api.post(`/api/courses/save/${id}`),
    completeLesson: (id, lessonId) =>
        api.post(`/api/courses/complete-lesson/${id}`, { lessonId }),
    getCourseNotes: (id) => api.get(`/api/courses/${id}/notes`),
    addCourseNote: (id, data) => api.post(`/api/courses/${id}/notes`, data),
};

export default courseApi;   