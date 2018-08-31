import DateFnsUtils from 'material-ui-pickers/utils/date-fns-utils';
import MuiPickersUtilsProvider from 'material-ui-pickers/utils/MuiPickersUtilsProvider';
import React, { Component } from 'react';
import './App.css';
import BottomNavTabs from './Components/BottomNavTabs';
import Clock from './Components/Clock';
import ConfirmationDialog from './Components/ConfirmationDialog';
import EditExerciseDialog from './Components/EditExerciseDialog';
import EditSectionDialog from './Components/EditSectionDialog';
import NotificationSnackBar from './Components/NotificationSnackBar';
import { IExercise, ISection } from './DataInterfaces';
import { ExerciseContextProvider } from './ExerciseContext';
import store, { exercises } from './Store';

interface IState {
  activeSectionIndex: number,
  exercises: IExercise[],
  selectedExerciseIndex: number,
  editSectionOpen: boolean,
  selectedSectionIndex: number,
  editExerciseOpen: boolean,
  editExerciseIndex: number,
  confirmationDialogOpen: boolean,
  deleteExerciseIndex: number,
  snackBarOpen: boolean
}

class App extends Component<{}, IState> {

  constructor(props: any) {
    super(props);

    let newExercises: IExercise[] = [...exercises];

    // add exercises that the user has created locally
    const customExercises = store.getSessionExercises();
    if (customExercises !== null && customExercises !== undefined && customExercises.length > 0) {
      // console.log(`adding ${customExercises.length} custom exercises to list`)
      newExercises = newExercises.concat(customExercises);
    }

    this.state = {
      activeSectionIndex: 0,
      confirmationDialogOpen: false,
      deleteExerciseIndex: -1,
      editExerciseIndex: -1,
      editExerciseOpen: false,
      editSectionOpen: false,
      exercises: newExercises,
      selectedExerciseIndex: 0,
      selectedSectionIndex: 0,
      snackBarOpen: false,
    }

    // bindings..
    this.moveSectionUp = this.moveSectionUp.bind(this);
    this.moveSectionDown = this.moveSectionDown.bind(this);
    this.deleteSection = this.deleteSection.bind(this);
    this.updateSection = this.updateSection.bind(this);
  }

  public getContext = () => ({
    ...this.state,
    deleteSection: this.deleteSection,
    moveSectionDown: this.moveSectionDown,
    moveSectionUp: this.moveSectionUp,
    submitSection: this.updateSection,
  })
  /* Lifecycle hooks */

  /* implement the new context api for state management! */

  /* Section manipulation */

  public setActiveSection = (sectionIndex: number) => {
    if (sectionIndex < 0) {
      console.log("no active section");
    } else {
      // console.log("active section: " + sectionIndex);
      this.setState({
        activeSectionIndex: sectionIndex
      })
    }

  }

  // returns a section with generated key.
  public createSection(name: string, description: string, duration: number, color: string, key: string) {

    const section: ISection = {
      color,
      description,
      duration,
      key,
      name
    }
    return section;
  }

  public updateSection(oldSection: ISection, newSection: ISection) {
    const { exercises: stateExercises, selectedExerciseIndex } = this.state;

    const targetSectionIndex = stateExercises[selectedExerciseIndex].defaultSections.indexOf(oldSection);
    if (targetSectionIndex > -1) {

      const newExercises = [...stateExercises];
      newExercises[selectedExerciseIndex].defaultSections[targetSectionIndex] = newSection;

      this.setState(
        {
          exercises: newExercises,
        },
        () => store.saveSessionExercises(newExercises)
      )
    } else {
      // add newSection to the current ex
      console.log(`adding new section ${newSection.name}`)
      this.addSection(newSection);
    }
  }

  // public reassignKeys = (itemArr: ISection[], groupId: string) => {

  //   const rekeyedArr = itemArr.map((item, index) => {
  //     item.key = groupId + `-${index}-`;
  //     return item;
  //   })
  //   return rekeyedArr;
  // }

  // TODO: refactor all of these to store?
  public addSection(section: ISection) {
    const { exercises: stateExercises, selectedExerciseIndex } = this.state;

    const prevSelectedexercise = stateExercises[selectedExerciseIndex];
    if (prevSelectedexercise.preset) {
      // create new as a copy of the selected..
      console.log("template modified, create a new exercise based on the selected one!");
    }

    const newExercises = [...stateExercises]
    newExercises[selectedExerciseIndex].defaultSections = [...prevSelectedexercise.defaultSections, this.createSection(section.name, section.description, section.duration, section.color, prevSelectedexercise.defaultSections.length.toString())];

    this.setState(
      {
        exercises: newExercises
      },

      () => store.saveSessionExercises(newExercises)
    )
  }

  public deleteSection(section: ISection) {
    // prompt user for confirmation?
    const { exercises: stateExercises, selectedExerciseIndex } = this.state;

    const newSections = [...stateExercises[selectedExerciseIndex].defaultSections];
    const index = newSections.indexOf(section);

    if (index > -1) {
      newSections.splice(index, 1)
      const newexercise = { ...stateExercises[selectedExerciseIndex], defaultSections: newSections };
      const newExercises = [...stateExercises];
      newExercises[selectedExerciseIndex] = newexercise;

      this.setState((prevState) => {
        return { exercises: newExercises };
      },
        () => store.saveSessionExercises(newExercises))
    }
  }


  public moveSectionUp = (section: ISection) => {
    const { exercises: stateExercises, selectedExerciseIndex } = this.state;

    const exercise = stateExercises[selectedExerciseIndex];
    const moveIndex = exercise.defaultSections.indexOf(section)
    // if section is first we cant move up any more.
    if (moveIndex > 0) {
      const sections = exercise.defaultSections;
      // remove and readd section to new position..
      sections.splice(moveIndex, 1);
      sections.splice(moveIndex - 1, 0, section);
      const newExercises = stateExercises;
      newExercises[selectedExerciseIndex] = exercise;

      this.setState(
        {
          exercises: newExercises
        },
        () => store.saveSessionExercises(newExercises)
      )
    }
  }

  public moveSectionDown = (section: ISection) => {
    const { exercises: stateExercises, selectedExerciseIndex } = this.state;

    const exercise = stateExercises[selectedExerciseIndex];
    const moveIndex = exercise.defaultSections.indexOf(section)
    // if section is last we cant move down any more.
    if (moveIndex < exercise.defaultSections.length - 1) {
      const sections = exercise.defaultSections;
      // remove and readd section to new position..
      sections.splice(moveIndex, 1);
      sections.splice(moveIndex + 1, 0, section);

      const newExercises = stateExercises;
      newExercises[selectedExerciseIndex] = exercise;

      this.setState(
        {
          exercises: newExercises
        },
        () => store.saveSessionExercises(newExercises)
      )
    }
  }

  /* helper functions */

  public applyCurrentTime = () => {
    const { exercises: stateExercises, selectedExerciseIndex } = this.state;

    const newExercise = stateExercises[selectedExerciseIndex];
    newExercise.startTime = new Date();

    this.setState(
      {
        // selectedExercise: newExercise
      },
      () => store.saveSessionExercises(stateExercises)
    )
  }

  public timeChanged = (time: Date) => {
    const { exercises: stateExercises, selectedExerciseIndex } = this.state;

    console.log(time)
    // time is coming in the right format
    const newExercises = [...stateExercises];

    newExercises[selectedExerciseIndex].startTime = time
    this.setState(
      {
        exercises: newExercises
      }
    )
  }

  public selectExercise = (name: string) => {

    const arrayIndex = this.state.exercises.map(exercise => exercise.name).indexOf(name);

    if (arrayIndex > -1) {

      this.setState(
        {
          selectedExerciseIndex: arrayIndex
        }
      )
    }
  }

  // form submit action handler
  public submitExerciseEditDialog = (oldExercise: IExercise, newExercise: IExercise) => {
    const { exercises: stateExercises } = this.state;
    // check indexof old ex and replace with new, if -1 add new
    const editIndex = stateExercises.indexOf(oldExercise);
    // add new
    if (editIndex === -1) {
      const newExercises = [...stateExercises, newExercise];

      // add and select the new exercise
      this.setState(
        {
          ...this.state,
          exercises: newExercises,
          selectedExerciseIndex: newExercises.length - 1
        },
        () => store.saveSessionExercises(newExercises)
      )
    }
    // edit existing
    else {
      const editedExercises = [...stateExercises];
      editedExercises.splice(editIndex, 1, newExercise)
      console.log(editedExercises)
      this.setState(
        {
          ...this.state,
          exercises: editedExercises
        }
      )
    }

  }

  // pass custom exercises for store to be saved
  public saveExercises = () => {
    const { exercises: stateExercises } = this.state;
    const nonPresets = stateExercises.filter(x => x.preset !== true)
    // save only here..
    store.saveExercises(nonPresets);
    this.handleShowSnackbar();
  }

  // return true for valid new name
  public validateExerciseName = (name: string) => {

    const position = this.state.exercises.map(exercise => exercise.name).indexOf(name);

    if (position === -1) {
      return true;
    } else {
      return false;
    }

  }

  public handleDeleteExercise = () => {
    const { exercises: stateExercises, deleteExerciseIndex } = this.state;
    if (deleteExerciseIndex !== -1) {
      console.log(`deleting exercise at ${deleteExerciseIndex}`)
      const newExercises = [...stateExercises];
      // set selected to first in list (presets should always exist)
      this.setState({
        selectedExerciseIndex: 0
      })

      newExercises.splice(deleteExerciseIndex, 1)

      this.setState(
        {
          exercises: newExercises
        },
        () => store.saveSessionExercises(newExercises)
      )
    }
  }

  public handleSectionEditToggle = (section: ISection) => {

    const { editSectionOpen, exercises: stateExercises, selectedExerciseIndex } = this.state;

    // open for edit
    if (!editSectionOpen) {
      const i = stateExercises[selectedExerciseIndex].defaultSections.indexOf(section);
      this.setState({ selectedSectionIndex: i })
    }

    this.setState({
      editSectionOpen: !this.state.editSectionOpen
    })
  }

  public handleExerciseEditToggle = (exercise: IExercise) => {
    const { editExerciseOpen, exercises: stateExercises } = this.state;

    // open for edit
    if (!editExerciseOpen) {
      const i = stateExercises.indexOf(exercise);
      // console.log('opened for editing: ', i)
      this.setState({ editExerciseIndex: i })
    }
    // get exercise name to validate uniqueness etc.
    this.setState(
      { editExerciseOpen: !editExerciseOpen }
    )

  }

  public handleShowSnackbar = () => {
    this.setState({ snackBarOpen: true });
  };

  public handleCloseSnackbar = (event: Event, reason: string) => {
    if (reason === 'clickaway') {
      return;
    }

    this.setState({ snackBarOpen: false });
  };

  public handleToggleCofirmationDialog = (deleteIndex: number) => {

    const { confirmationDialogOpen } = this.state;
    this.setState(
      {
        confirmationDialogOpen: !confirmationDialogOpen,
        deleteExerciseIndex: deleteIndex
      }
    );

  }

  public render() {
    const { exercises: stateExercises,
      selectedExerciseIndex,
      activeSectionIndex,
      editSectionOpen,
      selectedSectionIndex,
      editExerciseOpen,
      editExerciseIndex,
      confirmationDialogOpen,
      snackBarOpen } = this.state;

    return (
      <ExerciseContextProvider value={this.getContext()}>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <div className="App">
          <Clock
            sectionItems={stateExercises[selectedExerciseIndex].defaultSections}
            startTime={stateExercises[selectedExerciseIndex].startTime}
            canvasSide={100}
            activeSection={activeSectionIndex}
            setActive={this.setActiveSection} />
          <BottomNavTabs
            // classes={classes}
            // theme={styles}
            exercises={stateExercises}
            selectedExerciseIndex={selectedExerciseIndex}
            moveUp={this.moveSectionUp}
            moveDown={this.moveSectionDown}
            deleteSection={this.deleteSection}
            setTime={this.timeChanged}
            selectExercise={this.selectExercise}
            activeSectionIndex={activeSectionIndex}
            editSectionOpen={editSectionOpen}
            handleSectionEditToggle={this.handleSectionEditToggle}
            handleSubmit={this.updateSection}
            handleExerciseEditToggle={this.handleExerciseEditToggle}
            saveExercises={this.saveExercises}
            deleteExercise={this.handleToggleCofirmationDialog} />
          {/* host the forms on the app level to have them and the state available? */}
          <EditSectionDialog 
          exercise={stateExercises[selectedExerciseIndex]} 
          open={editSectionOpen} 
          section={stateExercises[selectedExerciseIndex].defaultSections[selectedSectionIndex]} 
          handleToggle={this.handleSectionEditToggle} 
          // handleSubmit={this.updateSection} 
          />
          <EditExerciseDialog exercise={stateExercises[editExerciseIndex]} open={editExerciseOpen} handleToggle={this.handleExerciseEditToggle} handleSubmit={this.submitExerciseEditDialog} validateName={this.validateExerciseName} />
          <ConfirmationDialog open={confirmationDialogOpen}
            exercise={stateExercises[selectedExerciseIndex]}
            handleToggle={this.handleToggleCofirmationDialog}
            handleAccept={this.handleDeleteExercise}
          />
          <NotificationSnackBar open={snackBarOpen} handleHide={this.handleCloseSnackbar} />
        </div>
      </MuiPickersUtilsProvider>
      </ExerciseContextProvider>
    );
  }
}

export default App;
