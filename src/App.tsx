import React, { Component } from 'react';
import './App.css';
import BottomNavTabs from './Components/BottomNavTabs';
import Clock from './Components/Clock';
import ConfirmationDialog from './Components/ConfirmationDialog';
import EditExerciseDialog from './Components/EditExerciseDialog';
import EditSectionDialog from './Components/EditSectionDialog';
import NotificationSnackBar from './Components/NotificationSnackBar';
import SectionListItem from './Components/SectionListItem';
import { IExercise, ISection } from './DataInterfaces';
import store, { exercises } from './Store';

// import UniqueId from 'react-html-id';

interface IState {
  activeSectionIndex: number,
  exercises: IExercise[],
  selectedExerciseIndex: number,
  editSectionOpen: boolean,
  selectedExercise: IExercise,
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
    // modify exercises with new unique ids
    // UniqueId.enableUniqueIds(this);
    
    // bindings..
    this.moveSectionUp = this.moveSectionUp.bind(this);
    this.moveSectionDown = this.moveSectionDown.bind(this);
    this.deleteSection = this.deleteSection.bind(this);
    this.updateSection = this.updateSection.bind(this);

    // to componentwillmount
    this.setState(
      {
        confirmationDialogOpen: false,
        deleteExerciseIndex: -1,
        editExerciseIndex: -1,
        editExerciseOpen: false,
        editSectionOpen: false,
        exercises: [...exercises],
        selectedExerciseIndex: 0,
        selectedSectionIndex: 0,
        snackBarOpen: false
      })
  }

  /* Lifecycle hooks */

  public componentWillMount() {
    // destructure from state to ease the syntax
    const { exercises: stateExercises } = this.state;

    // assign proper keys to exercises
    let newExercises = stateExercises.map(exercise => {
      // need to restart sequence under each exercise
      const rekeyedSections = this.reassignKeys(exercise.defaultSections, exercise.name);
      exercise.defaultSections = rekeyedSections;
      return exercise;
    })

    // add exercises that the user has created locally
    const customExercises = store.getSessionExercises();
    if (customExercises !== null && customExercises !== undefined && customExercises.length > 0) {
      // console.log(`adding ${customExercises.length} custom exercises to list`)
      newExercises = newExercises.concat(customExercises);
    }

    this.setState(
      {
        exercises: newExercises
      }
    )

    this.updateExercisePresets();
  }

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

      const newexercise = stateExercises[selectedExerciseIndex];
      const newSections = newexercise.defaultSections;

      newSections[targetSectionIndex] = newSection;
      newexercise.defaultSections = newSections;
      const newExercises = [...stateExercises]
      newExercises[selectedExerciseIndex].defaultSections = newSections;

      this.setState(
        {
          exercises: newExercises,
          selectedExercise: newexercise
        },

        () => store.saveSessionExercises(newExercises)
      )
    } else {
      // add newSection to the current ex
      console.log(`adding new section ${newSection.name}`)
      this.addSection(newSection);
    }
  }

  public reassignKeys = (itemArr: ISection[], groupId: string) => {
    
    const rekeyedArr = itemArr.map((item, index) => {
      item.key = groupId + `-${index}-`; // this.nextUniqueId(groupId);
      return item;
    })
    return rekeyedArr;
  }

  // TODO: refactor all of these to store?
  public addSection(section: ISection) {
    const { exercises: stateExercises, selectedExerciseIndex } = this.state;

    const prevSelectedexercise = stateExercises[selectedExerciseIndex];
    if (prevSelectedexercise.preset) {
      // create new as a copy of the selected..
      console.log("template modified, create a new exercise based on the selected one!");
    }

    const newSection = this.createSection(section.name, section.description, section.duration, section.color, prevSelectedexercise.name) 
    // + this.nextUniqueId())

    // rekey sections
    const newSections = this.reassignKeys([...prevSelectedexercise.defaultSections, newSection], prevSelectedexercise.name)
    // console.log("adding: ", section);

    const newExercises = [...stateExercises]
    newExercises[selectedExerciseIndex].defaultSections = newSections;

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
        selectedExercise: newExercise
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
          deleteExerciseIndex: -1,
          exercises: newExercises
        }, 
        () => store.saveSessionExercises(newExercises)
      )
    }
  }

  // use as callback for setState
  public updateSectionInputBoxes = () => {
    const { exercises: stateExercises, selectedExerciseIndex } = this.state;

    stateExercises[selectedExerciseIndex].defaultSections.map((sectionItem) => {
      const inputBoxKey = sectionItem.key;
      // MUI style elments
      return <SectionListItem key={inputBoxKey} section={sectionItem} moveUp={this.moveSectionUp} moveDown={this.moveSectionDown} />

    })
  }

  public updateExercisePresets = () => {
    const { exercises: stateExercises } = this.state;

    const exercisePresets = stateExercises.map((exercise, index) => {
      // we should not have undefined exercises in the memory
      if (exercise !== undefined) {
        // console.log(`exercise  added to menu `, exercise)
        return <option key={index} value={exercise.name}>{exercise.name}</option>
      } else {
        return null;
      }
    })
    
    exercisePresets.push(<option key="addNewexercise">+ new exercise</option>)
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

  public handleToggleCofirmationDialog = (exercise: IExercise) => {
    const { exercises: stateExercises } = this.state;
    // console.log('result of dialog:', exercise.name)
    const deleteIndex = stateExercises.indexOf(exercise);

    const { confirmationDialogOpen } = this.state;
    this.setState(
      {
        confirmationDialogOpen: !confirmationDialogOpen,
        deleteExerciseIndex: deleteIndex
      }
    );

  }

  // specify the correct props and state for this! recieves old and new props?!
  public componentWillUpdate(nextProps: never, nextState: IState) {
    // updating sectioninput boxes should be called here
    // console.log("App: componentWillUpdate ran");
  }

  public render() {
    // move to componentWillUpdate or componentWillrecieveprops?
    // console.log("rerendering app", new Date())
    this.updateExercisePresets();
    this.updateSectionInputBoxes();
    // deconstruct state for simpler syntax
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
      <div className="App">
        <Clock
          id="clock"
          sectionItems={stateExercises[selectedExerciseIndex].defaultSections}
          startTime={stateExercises[selectedExerciseIndex].startTime}
          canvasSide="100"
          activeSection={activeSectionIndex}
          setActive={this.setActiveSection} />
        <BottomNavTabs
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
        <EditSectionDialog exercise={stateExercises[selectedExerciseIndex]} open={editSectionOpen} section={stateExercises[selectedExerciseIndex].defaultSections[selectedSectionIndex]} handleToggle={this.handleSectionEditToggle} handleSubmit={this.updateSection} />
        <EditExerciseDialog exercise={stateExercises[editExerciseIndex]} open={editExerciseOpen} handleToggle={this.handleExerciseEditToggle} handleSubmit={this.submitExerciseEditDialog} validateName={this.validateExerciseName} />
        <ConfirmationDialog open={confirmationDialogOpen}
          handleToggle={this.handleToggleCofirmationDialog}
          handleAccept={this.handleDeleteExercise} />
        <NotificationSnackBar open={snackBarOpen} handleHide={this.handleCloseSnackbar} />
      </div>
    );
  }
}

export default App;
