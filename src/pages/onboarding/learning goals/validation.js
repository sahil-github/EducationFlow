export const validateLearningGoals = (fields, learningGoal) => {
    const unfilledFields = fields.filter(
        (field) => !learningGoal.find(item => item.id === field.id)?.value
    );

    return {
        isValid: unfilledFields.length === 0,
        unfilledFields,
    };
};