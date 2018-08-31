// this file contains all the commonly used data interfaces needed for the project

interface ISection {
  color: string
  description: string,
  duration: number,
  key: string,
  name: string,
}

interface IExercise {
  defaultSections: ISection[]
  name: string,
  preset: boolean,
  startTime: Date,
}

interface IExerciseContext {
  exercises: IExercise[],
  activeSectionIndex: number,
  selectedExerciseIndex: number,
  editSectionOpen: boolean,
  selectedSectionIndex: number,
  editExerciseOpen: boolean,
  editExerciseIndex: number,
  confirmationDialogOpen: boolean,
  deleteExerciseIndex: number,
  snackBarOpen: boolean,

  moveSectionUp: (section: ISection) => void,
  moveSectionDown: (section: ISection) => void,
  submitSection: (oldSection: ISection, newSection: ISection) => void,
  deleteSection: (section: ISection) => void,
  toggleSectionDialog: (section: ISection) => void,
}

export { ISection, IExercise, IExerciseContext}