import { IExercise, ISection } from "../../DataInterfaces";
import { exercises } from "../../Store";
import { DefaultAppState, IAppState } from "../AppReducer/ExerciseReducer";
import { addSectionToActiveExercise, deleteExercise, deleteSectionFromActiveExercise, updateActiveExercise, updateSectionInActiveExercise, updateSectionsInActiveExercise } from "../AppReducer/StateUtils";

const section: ISection = {
    color: `red`,
    description: `test`,
    duration: 5,
    key: `1`,
    name: `test`,
    setupTime: 0,
}

test(`update active exercise successfully`, 
  () => {
    // select the and modify an exercise
    const modifiedExercise: IExercise = {
      ...DefaultAppState.activeExercise,
      defaultSections: [...DefaultAppState.activeExercise.defaultSections, section]
    };
    const editableState: IAppState = {
      ...DefaultAppState,
      editExercise: DefaultAppState.activeExercise
    }
    const resultState = updateActiveExercise(editableState, modifiedExercise)
    expect(resultState.activeExercise).toEqual(modifiedExercise);
  });

test(`updating section does not do anything if there is no edit section`,
  () => {

      expect(updateSectionInActiveExercise(DefaultAppState,section))
        .toEqual(DefaultAppState);
  });


test(`when an edit section exists all the related places are also updated`,
  () => {
      // select the first section of default active section as editable
    const editSection = DefaultAppState.activeExercise.defaultSections[0];
    const initialState: IAppState = {
        ...DefaultAppState,
        editSection,
    }
    // section gets updated in the active exercise
      expect(updateSectionInActiveExercise(initialState,section).activeExercise.defaultSections[0])
        .toEqual(section);
  });

test(`deleting an exercise sets another as active and removes the target from exercise`,
() => {
  const customExercise: IExercise = {
    ...DefaultAppState.activeExercise,
    name: `coostom!`
  }
  const stateWithCustomExercise: IAppState = {
    ...DefaultAppState,
    exercises: [...exercises, customExercise]
  }
  expect(deleteExercise(stateWithCustomExercise,customExercise)).toEqual(DefaultAppState);
});

test(`adding new section in active exercise successfully`,
  () => {
      // select the first section of default active section as editable

    // section gets updated in the active exercise
    const resultState = addSectionToActiveExercise(DefaultAppState,section);
      expect(resultState.activeExercise.defaultSections.indexOf(section))
        .toBeTruthy();
      expect(resultState.exercises[0].defaultSections.indexOf(section))
        .toBeTruthy();
  });

test(`deleting a section from active exercise successfully`,
  () => {
      // select the first section of default active section as editable
    const deleteTarget = DefaultAppState.activeExercise.defaultSections[0];
    // section gets updated in the active exercise
      expect(deleteSectionFromActiveExercise(DefaultAppState,deleteTarget).activeExercise.defaultSections.indexOf(section))
        .toBe(-1);
  });

test(`updating all the sections for exercise successfully`,
  () => {
      // select the first section of default active section as editable
    const updatedSections = [...DefaultAppState.activeExercise.defaultSections, section];
    // section gets updated in the active exercise
      expect(updateSectionsInActiveExercise(DefaultAppState,updatedSections).activeExercise.defaultSections)
        .toEqual(updatedSections);
  });