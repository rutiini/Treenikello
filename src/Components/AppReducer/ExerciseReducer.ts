import * as React from "react";
import { IExercise, ISection } from "../../DataInterfaces";
import Store, { exercises } from "../../Store";
import {
    addSectionToActiveExercise,
    deleteExercise,
    deleteSectionFromActiveExercise,
    updateActiveExercise,
    updateSectionInActiveExercise,
    updateSectionsInActiveExercise
} from "./StateUtils";
import { GetActiveSectionIndex } from "../Utils/ClockUtilities";

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
    SetToastMessage = "SET_TOAST_MESSAGE",
    UpdateActiveSection = "UPDATE_ACTIVE_SECTION",
    CloseSnackbar = "CLOSE_SNACKBAR"
}

/** All possible actions */
export type IAction =
    | { type: ActionType.AddExercise; payload: IExercise }
    | { type: ActionType.UpdateExercise; payload: {updatedExercise: IExercise, targetExercise: IExercise} }
    | { type: ActionType.DeleteExercise; payload: IExercise }
    | { type: ActionType.SetEditExercise; payload: IExercise | null }
    | { type: ActionType.SetActiveExercise; payload: IExercise }
    | { type: ActionType.AddSection; payload: ISection }
    | { type: ActionType.UpdateSection; payload: ISection }
    | { type: ActionType.DeleteSection; payload: ISection }
    | { type: ActionType.SetActiveSection; payload: ISection | null }
    | { type: ActionType.SetEditSection; payload: ISection | null }
    | { type: ActionType.UpdateAllSections; payload: ReadonlyArray<ISection> }
    | { type: ActionType.UpdateAllExercises; payload: ReadonlyArray<IExercise> }
    | { type: ActionType.UpdateStartTime; payload: Date }
    | { type: ActionType.SetToastMessage; payload: string }
    | { type: ActionType.SaveExercises }
    | { type: ActionType.UpdateActiveSection; payload: Date }
    | { type: ActionType.CloseSnackbar };

/** Application state */
export interface IAppState {
    readonly activeSection: ISection | null; // -> currentSection
    readonly confirmOpen: boolean;
    readonly editExercise: IExercise | null;
    readonly editSection: ISection | null;
    readonly exercises: ReadonlyArray<IExercise>;
    readonly activeExercise: IExercise;
    readonly selectedSection: ISection | null; // -> activeSection / unnecessary due to editSection?
    readonly snackBarOpen: boolean;
}

export const DefaultAppState: IAppState = {
    activeExercise: exercises[0],
    activeSection: null,
    confirmOpen: false,
    editExercise: null,
    editSection: null,
    exercises: [...exercises, ...Store.getSavedExercises()],
    selectedSection: null,
    snackBarOpen: false
};

/** reducer for app state */
export const ExerciseReducer: React.Reducer<IAppState, IAction> = (state: IAppState, action: IAction) => {
    // "middleware" can be implemented here
    // console.debug('action dispatched:', action);
    const updatedState = stateController(state, action);
    // console.debug(updatedState);

    return updatedState;
};

function stateController(state: IAppState, action: IAction): IAppState {
    switch (action.type) {
        case ActionType.AddExercise: {
            return {
                ...state,
                activeExercise: action.payload,
                exercises: [...state.exercises, action.payload]
            };
        }
        case ActionType.UpdateExercise: {
            return updateActiveExercise(state, action.payload.updatedExercise, action.payload.targetExercise);
        }
        case ActionType.DeleteExercise: {
            return deleteExercise(state, action.payload);
        }
        case ActionType.SetActiveExercise: {
            return {
                ...state,
                activeExercise: action.payload
            };
        }
        case ActionType.SetEditExercise: {
            return {
                ...state,
                editExercise: action.payload
            };
        }
        case ActionType.AddSection: {
            return addSectionToActiveExercise(state, action.payload);
        }
        case ActionType.UpdateSection: {
            return updateSectionInActiveExercise(state, action.payload);
        }
        case ActionType.DeleteSection: {
            return deleteSectionFromActiveExercise(state, action.payload);
        }
        case ActionType.UpdateAllSections: {
            return updateSectionsInActiveExercise(state, action.payload);
        }
        case ActionType.SetActiveSection: {
            return {
                ...state,
                activeSection: action.payload
            };
        }
        case ActionType.SetEditSection: {
            return {
                ...state,
                editSection: action.payload
            };
        }
        case ActionType.SaveExercises: {
            // store.save? does this belong here at all?
            Store.saveExercises(state.exercises);
            return { ...state, snackBarOpen: true };
        }
        case ActionType.UpdateStartTime: {
            return {
                ...state,
                activeExercise: {
                    ...state.activeExercise,
                    startTime: action.payload
                }
            };
        }
        case ActionType.UpdateActiveSection: {
            const activeIndex = GetActiveSectionIndex(state.activeExercise, action.payload);
            const currentActive = state.activeSection
                ? state.activeExercise.defaultSections.indexOf(state.activeSection)
                : -1;
            if (currentActive !== activeIndex && activeIndex !== state.activeExercise.defaultSections.length) {
                return {
                    ...state,
                    activeSection: state.activeExercise.defaultSections[activeIndex]
                };
            }
            return state;
        }
        case ActionType.CloseSnackbar: {
            return {
                ...state,
                snackBarOpen: false
            };
        }
        default: {
            // if nothing gets returned we fall through to here
            logError(action);
            return state;
        }
    }
}

function logError(action: IAction): void {
    console.warn(`unsupported payolad type ${action.type} : ${"payload" in action && action.payload}`);
}
