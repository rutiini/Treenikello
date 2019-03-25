import * as React from "react";
import { IExercise, ISection } from "./DataInterfaces";
import { exercises } from "./Store";

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
    SaveExercises = "SAVE_EXERCISES",
    UpdateAllExercises = "UPDATE_EXERCISES",
    UpdateStartTime = "UPDATE_START_TIME",
    SetToastMessage = "SET_TOAST_MESSAGE"
}

/** All possible actions */
type IAction = {type: ActionType.AddExercise, payload: IExercise}
| {type: ActionType.UpdateExercise, payload: IExercise}
| {type: ActionType.DeleteExercise, payload: IExercise}
| {type: ActionType.SetEditExercise, payload?: IExercise}
| {type: ActionType.SetActiveExercise, payload: IExercise}
| {type: ActionType.AddSection, payload: ISection}
| {type: ActionType.UpdateSection, payload: ISection}
| {type: ActionType.DeleteSection, payload: ISection}
| {type: ActionType.SetActiveSection, payload?: ISection} 
| {type: ActionType.SetEditSection, payload?: ISection}
| {type: ActionType.UpdateAllSections, payload: ReadonlyArray<ISection>}
| {type: ActionType.UpdateAllExercises, payload: ReadonlyArray<IExercise>}
| {type: ActionType.UpdateStartTime, payload: Date}
| {type: ActionType.SetToastMessage, payload: string}
| {type: ActionType.SaveExercises}

/** Application state */
interface IAppState {
    readonly activeSection: ISection | null, // -> currentSection
    readonly confirmOpen: boolean,
    readonly editExercise: IExercise | null,
    readonly editSection: ISection | null, 
    readonly exercises: ReadonlyArray<IExercise>, 
    readonly activeExercise: IExercise,
    readonly selectedSection: ISection | null, // -> activeSection / unnecessary due to editSection?
    readonly snackBarOpen: boolean,
}


export const ExerciseReducer: React.Reducer<IAppState, IAction> = (state: IAppState, action: IAction) => {
    // "middleware" can be implemented here
    switch(action.type) {
        case ActionType.AddExercise: {
            return {
                ...state,
                exercises: [...state.exercises, action.payload]
            }
        }
        case ActionType.UpdateExercise: {
            return state;
        }
        case ActionType.DeleteExercise: {
            return state;
        }
        case ActionType.SetActiveExercise: {
            return {
                ...state,
                activeExercise: action.payload
            };
        }
        case ActionType.SetEditExercise: {
            return state;
        }
        case ActionType.AddSection: {
            return {
                ...state,
                // TODO: modify all that needs to be modified!
            }
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
        case ActionType.UpdateStartTime: {
            return {
                ...state,
                activeExercise: {
                    ...state.activeExercise,
                    startTime: action.payload
                }
            }
        }
        default: {
            // if nothing gets returned we fall through to here
            logError(action);
            return state;
        }
    }
}

function logError(action: IAction): void {
    console.warn(`unsupported payolad type ${action.type} : ${"payload" in action && action.payload}`)
}


export const DefaultAppState: IAppState = { 
    activeExercise: exercises[0],
    activeSection: null, 
    confirmOpen: false,
    editExercise: null, // set to null to be falsy and get rid of separate bits for the dialogs?!
    editSection: null,
    exercises: [...exercises], 
    selectedSection: null,
    snackBarOpen: false
}