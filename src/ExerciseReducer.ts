import * as React from "react";
import { IExercise, ISection } from "./DataInterfaces";

/** Exercise reducer action types */
export enum ActionType {
    AddExercise = "ADD_EXERCISE",
    UpdateExercise = "UPDATE_EXERCISE",
    DeleteExercise = "DELETE_EXERCISE",
    SetEditExercise = "SET_EDIT_EXERCISE",
    SetActiveExercise = "SET_ACTIVE_EXERCISE",
    AddSection = "ADD_SECTION",
    UpdateSection = "UPDATE_SECTION",
    DeleteSection = "DELETE_SECTION",
    SetActiveSection = "SET_ACTIVE_SECTION",
    SetEditSection = "SET_EDIT_SECTION",
    UpdateAllSections = "UPDATE_SECTIONS",
    SaveExercises = "SAVE_EXERCISES"
}
export interface IAction {
    readonly type: ActionType,
    readonly payload: object
}

/** Application state */
interface IAppState {
    readonly exercises: ReadonlyArray<IExercise>,
    readonly activeSectionIndex: number,
    readonly selectedExerciseIndex: number,
    readonly editSectionOpen: boolean,
    readonly selectedSectionIndex: number,
    readonly editExerciseOpen: boolean,
    readonly editExerciseIndex: number,
    readonly confirmationDialogOpen: boolean,
    readonly deleteExerciseIndex: number,
    readonly snackBarOpen: boolean,
}

export const ExerciseReducer: React.Reducer<IAppState, IAction> = (state: IAppState, action: IAction) => {
    // "middleware" can be implemented here
    switch(action.type) {
        case ActionType.AddExercise: {
            if(isIExercise(action.payload)){
                return {
                    ...state,
                    exercises: [...state.exercises, action.payload]
                }
            } else {
                console.warn(`unsupported payolad type ${action.type} : ${action.payload}`)
                return state;
            }
        }
        case ActionType.UpdateExercise: {
            return state;
        }
        case ActionType.DeleteExercise: {
            return state;
        }
        case ActionType.SetActiveExercise: {
            return state;
        }
        case ActionType.SetEditExercise: {
            return state;
        }
        case ActionType.AddSection: {
            if(isISection(action.payload)) {
                return {
                    ...state,
                    // TODO: modify all that needs to be modified!
                }
            } else {
                console.warn(`unsupported payolad type ${action.type} : ${action.payload}`)
                return state;
            }
            break;
        }
        case ActionType.UpdateSection: {
            return state;
        }
        case ActionType.DeleteSection: {
            return state;
        }
        case ActionType.UpdateAllSections: {
            return state;
        }
        case ActionType.SetActiveSection: {
            return state;
        }
        case ActionType.SetEditSection: {
            return state;
        }
        case ActionType.SaveExercises: {
            return state;
        }
        default: {
            return state;
        }
    }
}

function isIExercise(payload: object): payload is IExercise {
    return (payload !== null)
    && (typeof payload === "object")
    && ("defaultSections" in payload);
}

function isISection(payload: object): payload is ISection {
    return (payload !== null)
    && (typeof payload === "object")
    && ("setupTime" in payload);
}