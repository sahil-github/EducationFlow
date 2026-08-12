import api from "./api";

export const courseApi = {
    getCourses: (params) => api.get("/api/courses", { params }),
    getCategories: () => api.get("/api/courses/categories"),
    getCourseById: (id) => api.get(`/api/courses/${id}`),
    enrollInCourse: (id) => api.post(`/api/courses/${id}/enroll`),
};

export default courseApi;
