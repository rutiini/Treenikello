import { IExercise, ISection } from "../../DataInterfaces";
import { exercises } from "../../Store";
import { IAppState } from "./ExerciseReducer";

// TODO: redo to more exact methods instead of manipulating the whole state to optimize logic and improve reusability
export function updateActiveExercise(state: IAppState, updatedExercise: IExercise, targetExercise: IExercise): IAppState {
    if(updatedExercise){
        const replaceIndex = state.exercises.indexOf(targetExercise);
        const updatedExercises = [...state.exercises];
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

/** replace targetExercise with given replacement in exercises array */
export function replaceExercise(exerciseArray: ReadonlyArray<IExercise>, targetExercise: IExercise, replacementExercise: IExercise): ReadonlyArray<IExercise>{
    const replaceIndex = exerciseArray.indexOf(targetExercise);
    const updatedExercises = [...exerciseArray];
    updatedExercises[replaceIndex] = replacementExercise;
    return updatedExercises;
}

export function deleteExercise(state: IAppState, deleteTarget: IExercise): IAppState {
    // set another active exercise if it is the one that is being deleted.
    // TODO: disallow preset deletion?
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

export function addSectionToActiveExercise(state: IAppState, newSection: ISection): IAppState {
    const activeExercise: IExercise = {
        ...state.activeExercise,
        defaultSections: [...state.activeExercise.defaultSections, newSection]
    };
    
    return {
        ...state,
        activeExercise,
        // update applies to the corresponding exercise in the array as well
        exercises: replaceExercise(state.exercises, state.activeExercise, activeExercise)
    }
}

export function updateSectionInActiveExercise(state: IAppState, updatedSection: ISection): IAppState {
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
            activeExercise: updatedExercise,
            // in exercises as well
            exercises: replaceExercise(state.exercises, state.activeExercise, updatedExercise)
        };
    } else {
        return state;
    }
}

export function deleteSectionFromActiveExercise(state: IAppState, deleteSection: ISection): IAppState {
    const updatedExercise = {
        ...state.activeExercise,
        defaultSections: state.activeExercise.defaultSections.filter(s => s !== deleteSection)
    };
    return {
        ...state,
        activeExercise: updatedExercise
    };
}

export function updateSectionsInActiveExercise(state: IAppState, sections: ReadonlyArray<ISection>): IAppState {
    return {
        ...state,
        activeExercise: {
            ...state.activeExercise,
            defaultSections: sections
        }
    };
}