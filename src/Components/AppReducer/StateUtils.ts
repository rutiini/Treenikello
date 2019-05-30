import { IExercise, ISection } from "../../DataInterfaces";
import { exercises } from "../../Store";
import { IAppState } from "./ExerciseReducer";

// TODO: redo to more exact methods instead of manipulating the whole state to optimize logic and improve reusability
export function updateStateActiveExercise(state: IAppState, updatedExercise: IExercise): IAppState {
    if(updatedExercise && state.editExercise){
        const replaceIndex = state.exercises.indexOf(state.editExercise);
        const updatedExercises = [...state.exercises];
        // use splice to simplify? => not really simpler for replacing 1 exercise.
        // updatedExercises.splice(replaceIndex,1, action.payload);
        updatedExercises[replaceIndex] = updatedExercise;
        return {
            ...state,
            activeExercise: updatedExercise,
            editExercise: null,
            exercises: updatedExercises
        };
    } else {
        // we shouldn't be able to get here?
        return state;
    }
}

export function deleteStateActiveExercise(state: IAppState, deleteTarget: IExercise): IAppState {
    // set another active exercise if it is the one that is being deleted.
    let activeExercise = state.activeExercise;
    if(state.activeExercise === deleteTarget){
        activeExercise = exercises[0];
    }
    return {
        ...state,
        activeExercise,
        exercises: [...state.exercises].filter(e => e !== deleteTarget)
    };
}

export function addSectionToStateActiveExercise(state: IAppState, newSection: ISection): IAppState {
    const newSections: ReadonlyArray<ISection> = [...state.activeExercise.defaultSections, newSection];
    const activeExercise: IExercise = {
        ...state.activeExercise,
        defaultSections: newSections
    };
    const stateExercises = [...state.exercises];
    stateExercises[exercises.indexOf(state.activeExercise)] = activeExercise;

    return {
        ...state,
        activeExercise,
        // update applies to the corresponding exercise in the array as well
        exercises: stateExercises
    }
}

export function updateSectionInStateActiveExercise(state: IAppState, updatedSection: ISection): IAppState {
    if(state.editSection){
        const sectionIndex = state.activeExercise.defaultSections.indexOf(state.editSection);
        const newSections = [...state.activeExercise.defaultSections]
        newSections[sectionIndex] = updatedSection;
        
        const updatedExercise: IExercise = {
            ...state.activeExercise,
            defaultSections: newSections
        };
        return {
            ...state,
            activeExercise: updatedExercise
        };
    } else {
        return state;
    }
}

export function deleteSectionFromStateActiveExercise(state: IAppState, deleteSection: ISection): IAppState {
    const updatedExercise = {
        ...state.activeExercise,
        defaultSections: state.activeExercise.defaultSections.filter(s => s !== deleteSection)
    };
    return {
        ...state,
        activeExercise: updatedExercise
    };
}

export function updateSectionsInStateActiveExercise(state: IAppState, sections: ReadonlyArray<ISection>): IAppState {
    return {
        ...state,
        activeExercise: {
            ...state.activeExercise,
            defaultSections: sections
        }
    };
}