import { IExercise, ISection } from "../../DataInterfaces";
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

export function deleteStateActiveExercise(state: IAppState, updatedExercise: IExercise): IAppState {
    return {
        ...state,
        exercises: [...state.exercises].filter(e => e !== updatedExercise)
    };
}

export function addSectionToStateActiveExercise(state: IAppState, newSection: ISection): IAppState {
    const newSections: ReadonlyArray<ISection> = [...state.activeExercise.defaultSections, newSection];
    return {
        ...state,
        activeExercise: {
            ...state.activeExercise,
            defaultSections: newSections
        }
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