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

    // Notes APIs
    getCourseNotes: (id) => api.get(`/api/courses/${id}/notes`),
    addCourseNote: (id, data) => api.post(`/api/courses/${id}/notes`, data),
    deleteCourseNote: (id, noteId) => api.delete(`/api/courses/${id}/notes/${noteId}`),

    // Q&A APIs
    getCourseQnA: (id) => api.get(`/api/courses/${id}/qna`),
    fetchQnA: (id) => api.get(`/api/courses/${id}/qna`),
    addCourseQuestion: (id, data) => api.post(`/api/courses/${id}/qna`, data),
    addQnA: (id, data) => api.post(`/api/courses/${id}/qna`, data),
    replyToQuestion: (id, questionId, data) =>
        api.post(`/api/courses/${id}/qna/${questionId}/reply`, data),
    upvoteQuestion: (id, questionId) =>
        api.post(`/api/courses/${id}/qna/${questionId}/upvote`),

    // Resources APIs
    getCourseResources: (id) => api.get(`/api/courses/${id}/resources`),
    fetchResource: (id) => api.get(`/api/courses/${id}/resources`),
    downloadCourseResource: (id, resourceId) =>
        api.get(`/api/courses/${id}/resources/${resourceId}/download`, {
            responseType: "blob",
        }),
    fetchResourceDownload: (id, resourceId) =>
        api.get(`/api/courses/${id}/resources/${resourceId}/download`, {
            responseType: "blob",
        }),

    // Lesson Switching API
    getLessonById: (courseId, lessonId) =>
        api.get(`/api/courses/${courseId}/lessons/${lessonId}`),

    // Video Progress API
    saveLessonProgress: (courseId, lessonId, data) =>
        api.post(`/api/courses/${courseId}/lessons/${lessonId}/progress`, data),
};

export default courseApi;
