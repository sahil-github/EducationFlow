import api from "./api";

export const courseApi = {
    getCourses: (params) => api.get("/api/courses", { params }),
    getCategories: () => api.get("/api/courses/categories"),
    getCourseById: (id) => api.get(`/api/courses/${id}`),
    enrollInCourse: (id) => api.post(`/api/courses/${id}/enroll`),
    getMyLearning: () => api.get("/api/courses/my-learning"),
    saveCourse: (id) => api.post(`/api/courses/${id}/save`),
    completeLesson: (id, lessonId) =>
        api.post(`/api/courses/${id}/complete-lesson`, { lessonId }),
};

export default courseApi;

