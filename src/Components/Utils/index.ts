import {IExercise} from "../../DataInterfaces";

/**
 * function returns the sum of all sections setup times and durations.
 * @param IExercise target exercise
 * @param exercise 
 */
export function getExerciseDuration(exercise: IExercise): number {
    if(exercise.defaultSections.length) {
        let duration = 0;
        exercise.defaultSections.map(section => {
            duration += section.setupTime + section.duration;
        });
        return duration;
    }

    return 0;
}