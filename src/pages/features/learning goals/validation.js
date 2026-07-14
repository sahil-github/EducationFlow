export const validateLearningGoals = (fields, learningGoal) => {
    const unfilledFields = fields.filter(
        (field) => !learningGoal[field.id]
    );

    return {
        isValid: unfilledFields.length === 0,
        unfilledFields,
    };
};