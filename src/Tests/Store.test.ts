import Store from "../Store";
import { IExercise } from "../DataInterfaces";

test("no locally stored exercises", () => {
    expect(Store.getSavedExercises()).toEqual([]);
});

test("save exercise to localStorage", () => {
    const newExercise: IExercise = {
        name: "new",
        startTime: new Date(),
        defaultSections: [],
        preset: false,
    };
    Store.saveExercises([newExercise]);
    expect(Store.getSavedExercises()).toEqual([newExercise]);
});
