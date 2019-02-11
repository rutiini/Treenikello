import React from "react";
import { IExercise, ISection } from "src/DataInterfaces";
import { exercises } from "../Store";

/** Suggested context api, hard to extract state from this though. */
// interface IAppState {
//   startTime: { data: Date, setData: (newTime: Date) => void },
//   exercises: { data: IExercise[], setData: (newExercises: IExercise[]) => void },
//   activeSection: { data: ISection, setData: (activeSection: ISection) => void }
//   selectedExercise: { data: IExercise, setData: (IExercise: IExercise) => void },
//   editSectionOpen: { data: boolean, setData: (editSection: boolean) => void },
//   selectedSectionIndex: { data: boolean, setData: (selectedSection: boolean) => void },
//   editExerciseOpen: { data: boolean, setData: (editExercise: boolean) => void },
//   editExerciseIndex: { data: boolean, setData: (selectedExercise: boolean) => void },
//   confirmationDialogOpen: { data: boolean, setData: (editSection: boolean) => void },
//   deleteExercise: { data: IExercise, setData: (deleteExercise: IExercise) => boolean }
//   snackBarOpen: { data: boolean, setData: (snackBarOpen: boolean) => void }
// }

/** app state */
export interface IAppState {
  activeSection: ISection | null,
  confirmOpen: boolean,
  editExercise: IExercise | null,
  editSection: ISection | null, 
  exercises: IExercise[], 
  selectedExercise: IExercise,
  selectedSection: ISection | null,
  snackBarOpen: boolean, 
}

/** API for state control */
export interface IAppDispatch {
  readonly addExercise: (exercise: IExercise) => void,
  readonly addSection: (section: ISection) => void,
  readonly deleteExercise: (exercise: IExercise) => boolean,
  readonly deleteSection: (section: ISection) => boolean,
  readonly save: () => void,
  readonly setActiveSection: (activeSection: ISection) => void,
  readonly setConfirmOpen: (openState: boolean) => void,
  readonly setEditExercise: (selectedExercise: IExercise | null) => void,
  readonly setEditSection: (editSection: ISection | null) => void,
  readonly setExercises: (newExercises: IExercise[]) => void,
  readonly setSelectedExercise: (exercise: IExercise) => void,
  readonly setSelectedSection: (section: ISection) => void,
  readonly setTime: (newTime: Date) => void,
  readonly showMessage: (snackBarOpen: boolean, message: string) => void
  readonly updateSection: (sections: ISection) => void
  readonly updateSectionOrder: (sections: ISection[]) => void
  readonly mutateState: (state: IAppState, prop: stateVars, value: unknown) => IAppState
}

/** A more traditional context */
export interface IAppContext {
  state: IAppState,
  readonly dispatch: IAppDispatch
}

export function GetContextInstance(): IAppContext {
  return ContextInstance
}

type stateVars = "deleteExercise" | "confirmOpen" | "editExercise" | "editSection" | "exercises" | "selectedExercise" | "selectedSection" | "snackBarOpen"

const initState: IAppState = { 
  activeSection: null, 
  confirmOpen: false,
  editExercise: null, // set to null to be falsy and get rid of separate bits for the dialogs?!
  editSection: null,
  exercises: [...exercises], 
  selectedExercise: exercises[0],
  selectedSection: null,
  snackBarOpen: false
}
const testDispatch: IAppDispatch = {
  addExercise: (exercise) => void 0,
  addSection: (section) => void 0,
  deleteExercise: (exercise) => true,
  deleteSection: (section) => true,
  mutateState,
  save: () => void 0,
  setActiveSection: (activeSection) => void 0,
  setConfirmOpen: (openState) => void 0,
  setEditExercise: (editSection) => void 0,
  setEditSection: (editSection) => void 0,
  setExercises: (newExercises) => void 0,
  setSelectedExercise: (exercise) => void 0,
  setSelectedSection: (section) => void 0,
  setTime: (newTime) => void 0,
  showMessage: (snackBarOpen, message) => void 0,
  updateSection: (section) => void 0,
  updateSectionOrder: (sections) => void 0,
}
export const ContextInstance: IAppContext = {
  dispatch: testDispatch,
  state: initState
}

export function deleteExercise(state: IAppState, exercise: IExercise){
  state.exercises = 
  state.exercises.filter(e => e === exercise);
  state.confirmOpen = true;
  console.log("delete exercise!");
  logState(state);
  return state;
 }
 export function deleteSection(state: IAppState, section: ISection){
  state.selectedExercise.defaultSections = 
  state.selectedExercise.defaultSections.filter(s => s !== section);
  console.log("delete section!");
  logState(state);
  
  return state;
 }
 export function setActiveSection(state: IAppState, activeSection: ISection | null){
  state.activeSection = activeSection
  console.log("setActiveSection!");
  logState(state);
  return state;
 }
 export function setEditExercise(state: IAppState, selectedExercise: IExercise | null){
  state.editExercise = selectedExercise;
  console.log("edit exercise set!");
  logState(state);
  return state;
 }
 export function setEditSection(state: IAppState, editSection: ISection | null){
  state.editSection = editSection
  console.log("edit section set!");
  logState(state);
  return state;
 }
 export function setExercises(state: IAppState, newExercises: IExercise[]){
  state.exercises = newExercises;
  console.log("setExercises!");
  logState(state);
  return state;
 }
 export function setSelectedExercise(state: IAppState, exercise: IExercise){
  state.selectedExercise = exercise;
  console.log("setSelectedExercise!");
  logState(state);
  return state;
 }
 export function setSelectedSection(state: IAppState, section: ISection){
  state.selectedSection = section;
  console.log("setSelectedSection!");
  logState(state);
  return state;
 }
 export function setTime(state: IAppState, time: Date){
  if(ContextInstance.state.selectedExercise){
    state.selectedExercise.startTime = time;
  }
  console.log("setTime!");
  logState(state);
  return state;
 }
 export function showMessage(state: IAppState, snackBarOpen: boolean, message: string){
  state.snackBarOpen = snackBarOpen;
  console.log(`showMessage! ${message}`);
  logState(state);
  return state;
 }

 export function updateSectionOrder(state: IAppState, sections: ISection[]){
   state.selectedExercise.defaultSections = sections;
   console.log(`sections reordered!`);
   return state;
 }
 export function setConfirmOpen(state: IAppState, confirmState: boolean){
  state.confirmOpen = confirmState;
  return state;
 }

 export function save(){
  console.log(`saved!`);
  // logState();
 }

 /**
  * experimental function for generic shallow state mutations
  * @param state 
  * @param prop 
  * @param value 
  */
 export function mutateState(state: IAppState, prop: stateVars, value: unknown){
   return {
     ...state,
     [prop]: value
    }
 }

 /**
  * function for adding a new section to exercise
  * TODO: write test
  * @param state state to mutate
  * @param newSection section to add to exercise
  */
 export function addSection(state: IAppState, newSection: ISection){
   const exerciseList = state.exercises;
   const exerciseIndex = getSelectedExerciseIndex(state);
   exerciseList[exerciseIndex].defaultSections 
   = [...exerciseList[exerciseIndex].defaultSections,newSection]

   return {
     ...state,
     exercises: exerciseList,
     selectedExercise: exerciseList[exerciseIndex]
    }
  }

 /**
  * function for adding a new exercise to state
  * TODO: write test
  * @param state state to mutate
  * @param newExercise exercise to add to state
  */
 export function addExercise(state: IAppState, newExercise: IExercise){
   return {
     ...state,
     exercises: [...state.exercises, newExercise],
     selectedExercise: newExercise
   }
 }
 function getSelectedExerciseIndex(state: IAppState){
   return state.exercises.indexOf(state.selectedExercise);
 }

 function logState(state: IAppState){
   console.table(state);
 }

export const AppContext = React.createContext<IAppContext>(ContextInstance);