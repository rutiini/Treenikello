import { createStyles, WithStyles, withStyles } from '@material-ui/core';
import DateFnsUtils from 'material-ui-pickers/utils/date-fns-utils';
import MuiPickersUtilsProvider from 'material-ui-pickers/utils/MuiPickersUtilsProvider';
import React, { Component } from 'react';
import BottomNavTabs from './Components/BottomNavTabs';
import Clock from './Components/Clock';
import ConfirmationDialog from './Components/ConfirmationDialog';
import EditExerciseDialog from './Components/EditExerciseDialog';
import EditSectionDialog from './Components/EditSectionDialog';
import NotificationSnackBar from './Components/NotificationSnackBar';
import { IExercise, ISection } from './DataInterfaces';
import { ExerciseContextProvider } from './ExerciseContext';
import store, { exercises } from './Store';

interface IProps extends WithStyles<typeof styles>{
  // just for style injection
}

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

const styles = createStyles({
  App:{
    textAlign: 'center'
  },
})

class App extends Component<IProps, IState> {

  constructor(props: any) {
    super(props);

    let newExercises: IExercise[] = [...exercises];

    const customExercises = store.getSessionExercises();
    if (customExercises !== null && customExercises !== undefined && customExercises.length > 0) {
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

  public render() {
    const { snackBarOpen } = this.state;
    const { classes } = this.props;

    return (
      <ExerciseContextProvider value={this.getContext()}>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <div className={classes.App}>
          <Clock canvasSide={100}/>
          <BottomNavTabs/>
          <EditSectionDialog/>
          <EditExerciseDialog/>
          <ConfirmationDialog/>
          <NotificationSnackBar open={snackBarOpen} handleHide={this.handleCloseSnackbar} />
        </div>
      </MuiPickersUtilsProvider>
      </ExerciseContextProvider>
    );
  }

  private getContext = () => ({
    ...this.state,
    acceptDeleteExercise: this.handleDeleteExercise,
    deleteExercise: this.handleToggleCofirmationDialog,
    deleteSection: this.deleteSection,
    moveSectionDown: this.moveSectionDown,
    moveSectionUp: this.moveSectionUp,
    saveExercises: this.saveExercises,
    selectExercise: this.selectExercise,
    setActiveSection: this.setActiveSection,
    setTime: this.timeChanged,
    submitExercise: this.submitExerciseEditDialog,
    submitSection: this.updateSection,
    toggleExerciseDialog: this.handleExerciseEditToggle,
    toggleSectionDialog: this.handleSectionEditToggle,
    validateExerciseName: this.validateExerciseName,
  })

  private setActiveSection = (sectionIndex: number) => {
    if (sectionIndex < 0) {
      console.log("no active section");
    } else {
      this.setState({
        activeSectionIndex: sectionIndex
      })
    }

  }

  // returns a section with generated key.
  private createSection(name: string, description: string, duration: number, color: string, key: string) {

    const section: ISection = {
      color,
      description,
      duration,
      key,
      name
    }
    return section;
  }

  private updateSection(oldSection: ISection, newSection: ISection) {
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

  // TODO: refactor all of these to store?
  private addSection(section: ISection) {
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

  private deleteSection(section: ISection) {
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


  private moveSectionUp = (section: ISection) => {
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

  private moveSectionDown = (section: ISection) => {
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

  private timeChanged = (time: Date) => {
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

  private selectExercise = (name: string) => {

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
  private submitExerciseEditDialog = (oldExercise: IExercise, newExercise: IExercise) => {
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
  private saveExercises = () => {
    const { exercises: stateExercises } = this.state;
    const nonPresets = stateExercises.filter(x => x.preset !== true)
    // save only here..
    store.saveExercises(nonPresets);
    this.handleShowSnackbar();
  }

  // return true for valid new name
  private validateExerciseName = (name: string) => {

    const position = this.state.exercises.map(exercise => exercise.name).indexOf(name);

    if (position === -1) {
      return true;
    } else {
      return false;
    }

  }

  private handleDeleteExercise = () => {
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

  private handleSectionEditToggle = (section: ISection) => {

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

  private handleExerciseEditToggle = (exercise: IExercise) => {
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

  private handleShowSnackbar = () => {
    this.setState({ snackBarOpen: true });
  };

  private handleCloseSnackbar = (event: Event, reason: string) => {
    if (reason === 'clickaway') {
      return;
    }

    this.setState({ snackBarOpen: false });
  };

  private handleToggleCofirmationDialog = (deleteIndex: number) => {

    const { confirmationDialogOpen } = this.state;
    this.setState(
      {
        confirmationDialogOpen: !confirmationDialogOpen,
        deleteExerciseIndex: deleteIndex
      }
    );

  }

}

export default withStyles(styles)(App);
