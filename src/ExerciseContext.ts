import * as React from 'react';
import { IExercise, IExerciseContext, ISection } from './DataInterfaces';

export const ExerciseContext = React.createContext<IExerciseContext>(getDefaultContext());
function getDefaultContext(): IExerciseContext {
  return(
    {
      acceptDeleteExercise: () => null,
      activeSectionIndex: 0,
      confirmationDialogOpen: true,
      deleteExercise: (deleteIndex: number ) => null,
      deleteExerciseIndex: -1,
      deleteSection: (section: ISection) => null,
      editExerciseIndex: 0,
      editExerciseOpen: true,
      editSectionOpen: false,
      exercises: [],
      saveExercises: () => null,
      selectExercise: (exercise: string) => null,
      selectedExerciseIndex: 0,
      selectedSectionIndex: 0,
      setActiveSection: (sectionIndex: number) => null,
      snackBarOpen: true,
      submitExercise: (oldExercise: IExercise, newExercise: IExercise) => null,
      submitSection: (oldSection: ISection, newSection: ISection) => null,
      toggleExerciseDialog: (section: IExercise) => null,
      toggleSectionDialog: (section: ISection) => null,
      updateSectionOrder: (sections: ISection[]) => null,
      validateExerciseName: (name: string) => true,
    }
  )
}