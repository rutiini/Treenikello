import React, { Component } from 'react';
import './App.css';
import Clock from './Components/Clock';
import UniqueId from 'react-html-id';
import SectionListItem from './Components/SectionListItem';
import store, { exercises } from './Store';
import BottomNavTabs from './Components/BottomNavTabs';
import EditSectionForm from './Components/EditSectionForm';
import EditExerciseDialog from './Components/EditExerciseDialog';
import ConfirmationDialog from './Components/ConfirmationDialog';
import NotificationSnackBar from './Components/NotificationSnackBar';
// MUI stuff
// deprecated
// import SectionInputBox from './Components/SectionInputBox';
// import SectionInfo from './Components/SectionInfo';
// import BottomNavigation from './Components/BottomNavigation';
// import TimeInput from 'material-ui-time-picker'
// import Button from 'material-ui/Button';
// import Input from 'material-ui/Input';
// import { FormControl } from 'material-ui/Form';
// import Select from 'material-ui/Select';
// import EditSectionForm from './Components/EditSectionForm';

class App extends Component {

  sumAngle = 0;

  constructor(props) {
    super(props);
    // modify exercises with new unique ids
    UniqueId.enableUniqueIds(this);

    // to componentwillmount
    this.state = {
      exercises: exercises,
      selectedExerciseIndex: 0,
      editSectionOpen: false,
      selectedSectionIndex: 0,
      editExerciseOpen: false,
      editExerciseIndex: -1,
      confirmationDialogOpen: false,
      deleteExerciseIndex: -1,
      snackBarOpen: false
    }
  }

  /* implement the new context api for state management! */

  /* Section manipulation */

  setActiveSection = (sectionIndex) => {
    // TODO: should be coordinates for the section instead of separate object
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
  createSection(name, description, duration, color, key) {

    const section = {
      key: key,
      name: name,
      duration: duration,
      color: color,
      description: description
    }
    return section;
  }

  updateSection(oldSection, newSection) {
    const { exercises, selectedExerciseIndex } = this.state;

    const targetSectionIndex = exercises[selectedExerciseIndex].defaultSections.indexOf(oldSection);
    if (targetSectionIndex > -1) {

      const newexercise = exercises[selectedExerciseIndex];
      let newSections = newexercise.defaultSections;

      newSections[targetSectionIndex] = newSection;
      newexercise.defaultSections = newSections;
      const newExercises = [...exercises]
      newExercises[selectedExerciseIndex].defaultSections = newSections;

      this.setState(
        {
          exercises: newExercises,
          selectedExercise: newexercise
        },
        store.saveSessionExercises(newExercises)
      )
    } else {
      // add newSection to the current ex
      console.log(`adding new section ${newSection.name}`)
      this.addSection(newSection);
    }
  }

  reassignKeys = (itemArr, groupId) => {
    let rekeyedArr = itemArr.map((item, index) => {
      item.key = groupId + `-${index}-` + this.nextUniqueId(groupId);
      return item;
    })
    return rekeyedArr;
  }

  // TODO: refactor all of these to store?
  addSection(section) {
    const { exercises, selectedExerciseIndex } = this.state;

    const prevSelectedexercise = exercises[selectedExerciseIndex];
    if (prevSelectedexercise.preset) {
      // create new as a copy of the selected..
      console.log("template modified, create a new exercise based on the selected one!");
    }

    let newSection = this.createSection(section.name, section.description, section.duration, section.color, prevSelectedexercise.name +
      this.nextUniqueId())

    // rekey sections
    const newSections = this.reassignKeys([...prevSelectedexercise.defaultSections, newSection], prevSelectedexercise.name)
    // console.log("adding: ", section);

    const newExercises = [...exercises]
    newExercises[selectedExerciseIndex].defaultSections = newSections;

    this.setState(
      {
        exercises: newExercises
      },
      store.saveSessionExercises(newExercises)
    )
  }

  deleteSection(section) {
    // prompt user for confirmation?
    const { exercises, selectedExerciseIndex } = this.state;

    let newSections = [...exercises[selectedExerciseIndex].defaultSections];
    const index = newSections.indexOf(section);

    if (index > -1) {
      newSections.splice(index, 1)
      const newexercise = { ...exercises[selectedExerciseIndex], defaultSections: newSections };
      const newExercises = [...exercises];
      newExercises[selectedExerciseIndex] = newexercise;

      this.setState((prevState) => {
        return { exercises: newExercises };
      },
        store.saveSessionExercises(newExercises))
    }
  }


  moveSectionUp = (section) => {
    const { exercises, selectedExerciseIndex } = this.state;

    const exercise = exercises[selectedExerciseIndex];
    const moveIndex = exercise.defaultSections.indexOf(section)
    // if section is first we cant move up any more.
    if (moveIndex > 0) {
      let sections = exercise.defaultSections;
      // remove and readd section to new position..
      sections.splice(moveIndex, 1);
      sections.splice(moveIndex - 1, 0, section);
      const newExercises = exercises;
      newExercises[selectedExerciseIndex] = exercise;

      this.setState(
        {
          exercises: newExercises
        },
        store.saveSessionExercises(newExercises)
      )
    }
  }

  moveSectionDown = (section) => {
    const { exercises, selectedExerciseIndex } = this.state;

    const exercise = exercises[selectedExerciseIndex];
    const moveIndex = exercise.defaultSections.indexOf(section)
    // if section is last we cant move down any more.
    if (moveIndex < exercise.defaultSections.length - 1) {
      let sections = exercise.defaultSections;
      // remove and readd section to new position..
      sections.splice(moveIndex, 1);
      sections.splice(moveIndex + 1, 0, section);

      const newExercises = exercises;
      newExercises[selectedExerciseIndex] = exercise;

      this.setState(
        {
          exercises: newExercises
        },
        store.saveSessionExercises(newExercises)
      )
    }
  }

  /* helper functions */

  applyCurrentTime = () => {
    const { exercises, selectedExerciseIndex } = this.state;

    const newExercise = exercises[selectedExerciseIndex];
    newExercise.startTime = new Date();
    this.setState(
      {
        selectedExercise: newExercise
      },
      store.saveSessionExercises(exercises)
    )
  }

  timeChanged = (time) => {
    const { exercises, selectedExerciseIndex } = this.state;

    console.log(time)
    // time is coming in the right format
    const newExercises = [...exercises];

    newExercises[selectedExerciseIndex].startTime = time
    this.setState(
      {
        exercises: newExercises
      }
    )
  }

  getExerciseIndex(exercises, identifier) {
    return exercises.map(
      function (x) {
        if (x !== undefined) {
          return x.name
        } else {
          return "";
        }
      }
    ).indexOf(identifier);
  }

  // do a general id/key getter
  getArrayElementIndex(array, id) {
    return array.map(
      function (x) {
        return x.id
      }
    ).indexOf(id);
  }
  // just for debugging stuff
  printSections = (sections) => {
    sections.map((section, index) => {
      console.log(`pos: ${index} name: ${section.name} color: ${section.color} duration: ${section.duration}`);
      return true;
    })
  }

  selectExercise = (name) => {

    const { exercises } = this.state;
    // combobox selection should update state with new exercise
    const arrayIndex = this.getExerciseIndex(exercises, name)
    if (arrayIndex > -1) {


      this.setState(
        {
          selectedExerciseIndex: arrayIndex
        }
      )
    }
  }

  // form submit action handler
  submitExerciseEditDialog = (oldExercise, newExercise) => {
    const { exercises } = this.state;
    // check indexof old ex and replace with new, if -1 add new
    const editIndex = exercises.indexOf(oldExercise);
    // add new
    if (editIndex === -1) {
      let newExercises = [...exercises, newExercise];

      // add and select the new exercise
      this.setState(
        {
          ...this.state,
          exercises: newExercises,
          selectedExerciseIndex: newExercises.length - 1
        },
        store.saveSessionExercises(newExercises)
      )
    }
    // edit existing
    else {
      let editedExercises = [...exercises];
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
  saveExercises = () => {
    const { exercises } = this.state;
    const nonPresets = exercises.filter((x) => { return x.preset !== true; })
    // save only here..
    store.saveExercises(nonPresets);
    this.handleShowSnackbar();
  }

  // return true for valid new name
  validateExerciseName = (name) => {

    let usedNames = this.state.exercises.map(exercise => {
      return exercise.name;
    })

    const position = usedNames.indexOf(name);

    if (position === -1) {
      return true;
    } else {
      return false;
    }

  }

  handleDeleteExercise = () => {
    const { exercises, deleteExerciseIndex } = this.state;

    if (deleteExerciseIndex !== -1) {
      console.log(`deleting exercise at ${deleteExerciseIndex}`)
      const newExercises = [...exercises];
      // set selected to first in list (presets should always exist)
      this.setState({
        selectedExerciseIndex: 0
      })

      newExercises.splice(deleteExerciseIndex, 1)

      this.setState(
        {
          exercises: newExercises,
          deleteExerciseIndex: -1
        }, store.saveSessionExercises(newExercises)
      )
    }
  }

  // use as callback for setState
  updateSectionInputBoxes = () => {
    const { exercises, selectedExerciseIndex } = this.state;

    this.currentSections = exercises[selectedExerciseIndex].defaultSections.map((sectionItem, index) => {
      let inputBoxKey = sectionItem.key;
      // MUI style elments
      return <SectionListItem key={inputBoxKey} section={sectionItem} moveUp={this.moveSectionUp.bind(this)} moveDown={this.moveSectionDown.bind(this)} />

    })
  }

  updateExercisePresets = () => {
    const { exercises } = this.state;

    this.exercisePresets = exercises.map((exercise, index) => {
      // we should not have undefined exercises in the memory
      if (exercise !== undefined) {
        // console.log(`exercise  added to menu `, exercise)
        return <option key={index} value={exercise.name}>{exercise.name}</option>
      } else {
        return null;
      }
    })
    this.exercisePresets.push(<option key="addNewexercise">+ new exercise</option>)
  }

  handleSectionEditToggle = (section) => {

    const { editSectionOpen, exercises, selectedExerciseIndex } = this.state;

    // open for edit
    if (!editSectionOpen) {
      const i = exercises[selectedExerciseIndex].defaultSections.indexOf(section);
      this.setState({ selectedSectionIndex: i })
    }

    this.setState({
      editSectionOpen: !this.state.editSectionOpen
    })
  }

  handleExerciseEditToggle = (exercise) => {
    const { editExerciseOpen, exercises } = this.state;

    // open for edit
    if (!editExerciseOpen) {
      const i = exercises.indexOf(exercise);
      // console.log('opened for editing: ', i)
      this.setState({ editExerciseIndex: i })
    }
    // get exercise name to validate uniqueness etc.
    this.setState(
      { editExerciseOpen: !editExerciseOpen }
    )

  }

  handleShowSnackbar = () => {
    this.setState({ snackBarOpen: true });
  };

  handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    this.setState({ snackBarOpen: false });
  };

  handleToggleCofirmationDialog = (exercise) => {
    const { exercises } = this.state;
    // console.log('result of dialog:', exercise.name)
    const deleteIndex = exercises.indexOf(exercise);

    const { confirmationDialogOpen } = this.state;
    this.setState(
      {
        confirmationDialogOpen: !confirmationDialogOpen,
        deleteExerciseIndex: deleteIndex
      }
    );

  }

  /* Lifecycle hooks */

  componentWillMount() {
    // destructure from state to ease the syntax
    const { exercises } = this.state;

    // assign proper keys to exercises
    let newExercises = exercises.map(exercise => {
      // need to restart sequence under each exercise
      let rekeyedSections = this.reassignKeys(exercise.defaultSections, exercise.name);
      exercise.defaultSections = rekeyedSections;
      return exercise;
    })

    // add exercises that the user has created locally
    let customExercises = store.getSessionExercises();
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

  // specify the correct props and state for this! recieves old and new props?!
  componentWillUpdate(nextProps, nextState) {
    // updating sectioninput boxes should be called here
    //console.log("App: componentWillUpdate ran");
  }

  render() {
    // move to componentWillUpdate or componentWillrecieveprops?
    //console.log("rerendering app", new Date())
    this.updateExercisePresets();
    this.updateSectionInputBoxes();
    // deconstruct state for simpler syntax
    const { exercises,
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
          sectionItems={exercises[selectedExerciseIndex].defaultSections}
          startTime={exercises[selectedExerciseIndex].startTime}
          canvasSide="100"
          activeSection={activeSectionIndex}
          setActive={this.setActiveSection} />
          <BottomNavTabs
            exercises={exercises}
            selectedExerciseIndex={selectedExerciseIndex}
            moveUp={this.moveSectionUp}
            moveDown={this.moveSectionDown}
            deleteSection={this.deleteSection.bind(this)}
            setTime={this.timeChanged}
            selectExercise={this.selectExercise}
            activeSectionIndex={activeSectionIndex}
            editSectionOpen={editSectionOpen}
            handleSectionEditToggle={this.handleSectionEditToggle}
            handleSubmit={this.updateSection.bind(this)}
            handleExerciseEditToggle={this.handleExerciseEditToggle}
            saveExercises={this.saveExercises}
            // deleteExercise={this.handleDeleteExercise}
            deleteExercise={this.handleToggleCofirmationDialog} />
          {/* host the forms on the app level to have them and the state available? */}
          <EditSectionForm exercise={exercises[selectedExerciseIndex]} open={editSectionOpen} section={exercises[selectedExerciseIndex].defaultSections[selectedSectionIndex]} handleToggle={this.handleSectionEditToggle} handleSubmit={this.updateSection.bind(this)} />
          <EditExerciseDialog exercise={exercises[editExerciseIndex]} open={editExerciseOpen} handleToggle={this.handleExerciseEditToggle} handleSubmit={this.submitExerciseEditDialog} validateName={this.validateExerciseName} />
          <ConfirmationDialog open={confirmationDialogOpen}
            handleToggle={this.handleToggleCofirmationDialog}
            handleAccept={this.handleDeleteExercise} />
          <NotificationSnackBar open={snackBarOpen} handleHide={this.handleCloseSnackbar} />
      </div>
    );
  }
}

export default App;
