// this file contains all the commonly used data interfaces needed for the project

/**
 * Section is the basic part of an exercise. It holds information used to draw a segment on the clock face
 * as well as instructions and description what kind of exercise this section is.
 */
interface ISection {
  color: string
  description: string,
  setupTime: number,
  duration: number,
  key: string,
  name: string,
}

/**
 * Exercise is the container object for sections, it is used to manage which sections belong to which exercise
 * and when the exercise is planned to start.
 */
interface IExercise {
  defaultSections: ISection[]
  name: string,
  preset: boolean,
  startTime: Date,
}

/**
 * The ExerciseContext is used for all data manipulation inside the app. It provides methods for exercise and section
 * creation, deletion and modification. It also holds some app wide state information which is used to update different
 * components in the app which are dependend on the same state variables.
 */
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
  // general actions
  setTime: (time: Date) => void,
  saveExercises: () => void,
  // section controls
  // moveSectionUp: (section: ISection) => void,
  // moveSectionDown: (section: ISection) => void,
  updateSectionOrder: (sections: ISection[]) => void,
  submitSection: (oldSection: ISection, newSection: ISection) => void,
  deleteSection: (section: ISection) => void,
  setActiveSection: (sectionIndex: number) => void,
  toggleSectionDialog: (section: ISection) => void,
  toggleExerciseDialog: (section: IExercise) => void,
  // exercise controls
  submitExercise: (oldExercise: IExercise, newExercise: IExercise) => void,
  validateExerciseName: (name: string) => boolean,
  deleteExercise: (deleteIndex: number ) => void,
  selectExercise: (exercise: string) => void,
  acceptDeleteExercise: () => void
}

export { ISection, IExercise, IExerciseContext}