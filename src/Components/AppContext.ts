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
  readonly deleteExercise: (exercise: IExercise) => boolean,
  readonly deleteSection: (section: ISection) => boolean,
  readonly save: () => void,
  readonly setActiveSection: (activeSection: ISection) => void,
  readonly setConfirmOpen: (openState: boolean) => void,
  readonly setEditExercise: (selectedExercise: IExercise) => void,
  readonly setEditSection: (editSection: ISection) => void,
  readonly setExercises: (newExercises: IExercise[]) => void,
  readonly setSelectedExercise: (IExercise: IExercise) => void,
  readonly setSelectedSection: (section: ISection) => void,
  readonly setTime: (newTime: Date) => void,
  readonly showMessage: (snackBarOpen: boolean, message: string) => void
  readonly updateSectionOrder: (sections: ISection[]) => void
}

/** A more traditional context */
export interface IAppContext {
  state: IAppState,
  readonly dispatch: IAppDispatch
}

export function GetContextInstance(): IAppContext {
  return ContextInstance
}

const state: IAppState = { 
  activeSection: null, 
  confirmOpen: false,
  editExercise: null, // set to null to be falsy and get rid of separate bits for the dialogs?!
  editSection: null,
  exercises: [...exercises], 
  selectedExercise: exercises[0],
  selectedSection: null,
  snackBarOpen: false
}
const dispatch: IAppDispatch = {
  deleteExercise,
  deleteSection,
  save,
  setActiveSection,
  setConfirmOpen,
  setEditExercise,
  setEditSection,
  setExercises,
  setSelectedExercise,
  setSelectedSection,
  setTime,
  showMessage,
  updateSectionOrder,
}
export const ContextInstance: IAppContext = {
  dispatch,
  state
}

function deleteExercise(exercise: IExercise){
  ContextInstance.state.exercises = 
  ContextInstance.state.exercises.filter(e => e === exercise);
  ContextInstance.state.confirmOpen = true;
  console.log("delete exercise!");
  logState();
  return true;
 }
 function deleteSection(section: ISection){
  ContextInstance.state.selectedExercise.defaultSections = 
  ContextInstance.state.selectedExercise.defaultSections.filter(s => s === section);
  console.log("delete section!");
  logState();
  return true;
 }
function setActiveSection(activeSection: ISection | null){
  ContextInstance.state.activeSection = activeSection
  console.log("setActiveSection!");
  logState();
 }
function setEditExercise(selectedExercise: IExercise | null){
  ContextInstance.state.editExercise = selectedExercise;
  console.log("edit exercise set!");
  logState();
 }
function setEditSection(editSection: ISection | null){
  ContextInstance.state.editSection = editSection
  console.log("edit section set!");
  logState();
 }
function setExercises(newExercises: IExercise[]){
  ContextInstance.state.exercises = newExercises;
  console.log("setExercises!");
  logState();
 }
function setSelectedExercise(exercise: IExercise){
  ContextInstance.state.selectedExercise = exercise;
  console.log("setSelectedExercise!");
  logState();
 }
function setSelectedSection(section: ISection){
  ContextInstance.state.selectedSection = section;
  console.log("setSelectedSection!");
  logState();
 }
function setTime(time: Date){
  if(ContextInstance.state.selectedExercise){
    ContextInstance.state.selectedExercise.startTime = time;
  }
  console.log("setTime!");
  logState();
 }
function showMessage(snackBarOpen: boolean, message: string){
  ContextInstance.state.snackBarOpen = snackBarOpen;
  console.log(`showMessage! ${message}`);
  logState();
 }

 function updateSectionOrder(sections: ISection[]){
   ContextInstance.state.selectedExercise.defaultSections = sections;
   console.log(`sections reordered!`);
 }
 function setConfirmOpen(confirmState: boolean){
  ContextInstance.state.confirmOpen = confirmState;
 }

function save(){
  console.log(`saved!`);
  logState();
 }
 function logState(){
   console.table(ContextInstance.state);
 }

export const AppContext = React.createContext<IAppContext>(ContextInstance);