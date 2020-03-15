import {IExercise, ISection} from "../DataInterfaces";

/**
 * function returns the sum of all sections setup times and durations (in minutes).
 * @param IExercise target exercise
 * @param exercise
 */
export function getExerciseDuration(exercise: IExercise): number {
    if (exercise.defaultSections.length) {
        let duration = 0;
        exercise.defaultSections.forEach((section) => {
            duration += section.setupTime + section.duration;
        });
        return duration;
    }

    return 0;
}

/** empty exercise for creating new instances */
export const emptyExercise: IExercise = {
    defaultSections: [],
    name: "",
    preset: false,
    startTime: new Date(),
};

/** empty section for creating new instances */
export const emptySection: ISection = {
    color: "",
    description: "",
    duration: 0,
    key: "",
    name: "",
    setupTime: 0,
};
