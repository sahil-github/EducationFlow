import api from "./api";

export const myLearningApi = {
    /** GET /api/courses/my-learning */
    getMyLearning: () => api.get("/api/courses/my-learning"),

    /** POST /api/courses/:id/save */
    saveCourse: (id) => api.post(`/api/courses/${id}/save`),

    /** POST /api/courses/:id/complete-lesson */
    completeLesson: (id, lessonId) =>
        api.post(`/api/courses/${id}/complete-lesson`, { lessonId }),
};

export default myLearningApi;
