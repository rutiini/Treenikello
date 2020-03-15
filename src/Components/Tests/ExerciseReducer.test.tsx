import { ExerciseReducer, DefaultAppState, ActionType, IAction, IAppState } from "../AppReducer/ExerciseReducer";
import { emptySection, emptyExercise, getExerciseDuration } from "../Utils";
import { IExercise, ISection } from "../../DataInterfaces";

const initialState = DefaultAppState;
const reducer = ExerciseReducer;

test("Adding Exercise adds new exercise to list and sets it as active exercise", () => {
    const AddExercise: IAction = { type: ActionType.AddExercise, payload: emptyExercise };
    expect(reducer(initialState, AddExercise)).toEqual({
        ...initialState,
        exercises: [...initialState.exercises, emptyExercise],
        activeExercise: emptyExercise
    });
});

test("Updating Exercise updates exercise in list and active exercise", () => {
    const initialEditState: IAppState = {
        ...initialState,
        editExercise: emptyExercise,
        exercises: [...initialState.exercises, emptyExercise]
    };

    const updatedExercise: IExercise = {
        ...emptyExercise,
        name: "something else",
        startTime: new Date()
    };

    const expectedResultingStage: IAppState = {
        ...initialEditState,
        editExercise: null,
        activeExercise: updatedExercise,
        exercises: [...initialState.exercises, updatedExercise]
    };

    const UpdateExercise: IAction = {
        type: ActionType.UpdateExercise,
        payload: {
            updatedExercise,
            targetExercise: emptyExercise
        }
    };

    expect(reducer(initialEditState, UpdateExercise)).toEqual(expectedResultingStage);
});

test("Deleting Exercise removes exercis in list and active exercise falls back to existing exercise", () => {
    const initialEditState: IAppState = {
        ...initialState,
        editExercise: emptyExercise,
        exercises: [...initialState.exercises, emptyExercise]
    };

    const expectedResultingStage: IAppState = {
        ...initialEditState,
        editExercise: emptyExercise,
        activeExercise: initialState.exercises[0],
        exercises: [...initialState.exercises]
    };

    const DeleteExercise: IAction = {
        type: ActionType.DeleteExercise,
        payload: emptyExercise
    };

    expect(reducer(initialEditState, DeleteExercise)).toEqual(expectedResultingStage);
});

test("Setting edit Exercise mutates state correctly", () => {
    const SetActiveExercise: IAction = { type: ActionType.SetEditExercise, payload: emptyExercise };
    expect(reducer(initialState, SetActiveExercise)).toEqual({
        ...initialState,
        editExercise: emptyExercise
    });
});

test("Setting active Exercise mutates state correctly", () => {
    const SetActiveExercise: IAction = { type: ActionType.SetActiveExercise, payload: emptyExercise };
    expect(reducer(initialState, SetActiveExercise)).toEqual({
        ...initialState,
        activeExercise: emptyExercise
    });
});

test("Adding section updates active exercise and list exercises correctly", () => {
    const AddSection: IAction = { type: ActionType.AddSection, payload: emptySection };

    const updatedActiveExercise: IExercise = {
        ...initialState.activeExercise,
        defaultSections: [...initialState.activeExercise.defaultSections, emptySection]
    };

    const expectedResultingState: IAppState = {
        ...initialState,
        exercises: [updatedActiveExercise, initialState.exercises[1]],
        activeExercise: updatedActiveExercise
    };

    expect(reducer(initialState, AddSection)).toEqual(expectedResultingState);
});

test("Update section updates active exercise and list exercises correctly", () => {
    const updatedSection: ISection = {
        ...emptySection,
        name: "updated name",
        duration: emptySection.duration + 5,
        setupTime: emptySection.setupTime + 1
    };

    const initialActiveExercise: IExercise = {
        ...emptyExercise,
        defaultSections: [emptySection]
    };

    const initialUpdateState: IAppState = {
        ...initialState,
        editSection: emptySection,
        activeExercise: initialActiveExercise,
        exercises: [...initialState.exercises, initialActiveExercise]
    };

    const UpdateSection: IAction = { type: ActionType.UpdateSection, payload: updatedSection };

    const updatedActiveExercise: IExercise = {
        ...initialActiveExercise,
        defaultSections: [updatedSection]
    };

    const expectedResultingState: IAppState = {
        ...initialState,
        editSection: emptySection,
        exercises: [...initialState.exercises, updatedActiveExercise],
        activeExercise: updatedActiveExercise
    };

    expect(reducer(initialUpdateState, UpdateSection)).toEqual(expectedResultingState);
});

test("Delete section updates active exercise and list exercises correctly", () => {
    const initialActiveExercise: IExercise = {
        ...emptyExercise,
        defaultSections: [emptySection]
    };

    const initialUpdateState: IAppState = {
        ...initialState,
        editSection: emptySection,
        activeExercise: initialActiveExercise,
        exercises: [...initialState.exercises, initialActiveExercise]
    };

    const DeleteSection: IAction = { type: ActionType.DeleteSection, payload: emptySection };

    const updatedActiveExercise: IExercise = {
        ...initialActiveExercise,
        defaultSections: []
    };

    const expectedResultingState: IAppState = {
        ...initialState,
        editSection: emptySection,
        exercises: [...initialState.exercises, initialActiveExercise],
        activeExercise: updatedActiveExercise
    };

    expect(reducer(initialUpdateState, DeleteSection)).toEqual(expectedResultingState);
});

test("Setting active section mutates state correctly", () => {
    const SetActiveSection: IAction = { type: ActionType.SetActiveSection, payload: emptySection };
    expect(reducer(initialState, SetActiveSection)).toEqual({
        ...initialState,
        activeSection: emptySection
    });
});

test("Setting edit section mutates state correctly", () => {
    const SetActiveSection: IAction = { type: ActionType.SetEditSection, payload: emptySection };
    expect(reducer(initialState, SetActiveSection)).toEqual({
        ...initialState,
        editSection: emptySection
    });
});

test("Updating all sections applies the new order of actions", () => {
    const initialSectionOrder: ReadonlyArray<ISection> = [emptySection, ...initialState.activeExercise.defaultSections];

    const UpdateAllSections: IAction = {
        type: ActionType.UpdateAllSections,
        payload: [...initialState.activeExercise.defaultSections, emptySection]
    };

    const initialUpdateState: IAppState = {
        ...initialState,
        activeExercise: {
            ...initialState.activeExercise,
            defaultSections: initialSectionOrder
        }
    };

    const expectedResultingState: IAppState = {
        ...initialUpdateState,
        activeExercise: {
            ...initialUpdateState.activeExercise,
            defaultSections: [...initialState.activeExercise.defaultSections, emptySection]
        }
    };

    expect(reducer(initialUpdateState, UpdateAllSections)).toEqual(expectedResultingState);
});

test("Save Exercises activates the snackbar", () => {
    const SaveEXercises: IAction = { type: ActionType.SaveExercises };
    expect(reducer(initialState, SaveEXercises)).toEqual({
        ...initialState,
        snackBarOpen: true
    });
    // test that the snackbar closes as well?
});

test("Update Start time updates active exercise start time to current moment", () => {
    const newStartTime: Date = new Date();
    const UpdateStartTime: IAction = { type: ActionType.UpdateStartTime, payload: newStartTime };
    expect(reducer(initialState, UpdateStartTime)).toEqual({
        ...initialState,
        activeExercise: {
            ...initialState.activeExercise,
            startTime: newStartTime
        }
    });
});

test("Update active section when time is 1 second before exercise start", () => {
    const timeWhenSectionIsActive: Date = new Date(initialState.activeExercise.startTime.getTime() - 1000);
    const UpdateStartTime: IAction = { type: ActionType.UpdateActiveSection, payload: timeWhenSectionIsActive };
    expect(reducer(initialState, UpdateStartTime)).toEqual({
        ...initialState,
        activeSection: null
    });
});

test("Update active section when time is 1 second past exercise start", () => {
    const timeWhenSectionIsActive: Date = new Date(initialState.activeExercise.startTime.getTime() + 1000);
    const expectedActiveSectionIndex = 0;
    const UpdateStartTime: IAction = { type: ActionType.UpdateActiveSection, payload: timeWhenSectionIsActive };
    expect(reducer(initialState, UpdateStartTime)).toEqual({
        ...initialState,
        activeSection: initialState.activeExercise.defaultSections[expectedActiveSectionIndex],
        exerciseStatus: expectedActiveSectionIndex
    });
});

test("Update active section when time is 1 minute past exercise first section", () => {
    const firstSection = initialState.activeExercise.defaultSections[0];
    const expectedActiveSectionIndex = 1;
    const firstSectionDurationInMs: number = (firstSection.setupTime + firstSection.duration) * 60 * 1000;
    const timeWhenSectionIsActive: Date = new Date(
        initialState.activeExercise.startTime.getTime() + firstSectionDurationInMs + 60 * 1000 // one minute after..
    );
    const UpdateStartTime: IAction = { type: ActionType.UpdateActiveSection, payload: timeWhenSectionIsActive };
    expect(reducer(initialState, UpdateStartTime)).toEqual({
        ...initialState,
        activeSection: initialState.activeExercise.defaultSections[expectedActiveSectionIndex],
        exerciseStatus: expectedActiveSectionIndex
    });
});

test("Update active section when time is 1 minute past exercise last section", () => {
    const exerciseDuration = getExerciseDuration(initialState.activeExercise);
    const exerciseDurationInMs: number = exerciseDuration * 60 * 1000;
    const timeWhenSectionIsActive: Date = new Date(
        initialState.activeExercise.startTime.getTime() + exerciseDurationInMs + 60 * 1000 // one minute after..
    );
    const UpdateStartTime: IAction = { type: ActionType.UpdateActiveSection, payload: timeWhenSectionIsActive };
    expect(reducer(initialState, UpdateStartTime)).toEqual({
        ...initialState,
        activeSection: null,
        exerciseStatus: "PostExercise"
    });
});
