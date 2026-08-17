import api from "./api";

export const myLearningApi = {
    /** GET /api/courses/my-learning */
    getMyLearning: () => api.get("/api/courses/my-learning"),

    /** POST /api/courses/save/:id */
    saveCourse: (id) => api.post(`/api/courses/save/${id}`),

    /** POST /api/courses/complete-lesson/:id */
    completeLesson: (id, lessonId) =>
        api.post(`/api/courses/complete-lesson/${id}`, { lessonId }),
};

export default myLearningApi;
