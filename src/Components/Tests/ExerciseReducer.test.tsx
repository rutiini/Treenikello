import { ExerciseReducer, DefaultAppState, ActionType, IAction } from "../AppReducer/ExerciseReducer";
import { emptySection, emptyExercise } from "../Utils";

const initialState = DefaultAppState;
const reducer = ExerciseReducer;

test("Setting active section mutates state correctly", () => {
    const SetActiveSection: IAction = { type: ActionType.SetActiveSection, payload: emptySection };
    expect(reducer(initialState, SetActiveSection)).toEqual({
        ...initialState,
        activeSection: emptySection,
    });
});

test("Setting edit section mutates state correctly", () => {
    const SetActiveSection: IAction = { type: ActionType.SetEditSection, payload: emptySection };
    expect(reducer(initialState, SetActiveSection)).toEqual({
        ...initialState,
        editSection: emptySection,
    });
});

test("Setting edit Exercise mutates state correctly", () => {
    const SetActiveExercise: IAction = { type: ActionType.SetEditExercise, payload: emptyExercise };
    expect(reducer(initialState, SetActiveExercise)).toEqual({
        ...initialState,
        editExercise: emptyExercise,
    });
});

test("Setting active Exercise mutates state correctly", () => {
    const SetActiveExercise: IAction = { type: ActionType.SetActiveExercise, payload: emptyExercise };
    expect(reducer(initialState, SetActiveExercise)).toEqual({
        ...initialState,
        activeExercise: emptyExercise,
    });
});
