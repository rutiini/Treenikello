import * as React from "react";
import { ExerciseReducer, DefaultAppState, ActionType, IAction } from "../AppReducer/ExerciseReducer";
import { emptySection } from "../Utils";

const initialState = DefaultAppState;
const reducer = ExerciseReducer;

test("Setting active section mutates state correctly",() => {
    const SetActiveSection: IAction = { type: ActionType.SetActiveSection, payload: emptySection };
    expect(reducer(initialState, SetActiveSection)).toEqual({
        ...initialState,
        activeSection: emptySection
    });
});
