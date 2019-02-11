import { createStyles, WithStyles, withStyles } from '@material-ui/core';
import bind from 'bind-decorator';
import React, { Component, Context, ContextType } from 'react';
import { addExercise, addSection, AppContext, ContextInstance, deleteExercise, deleteSection, IAppContext, IAppState, mutateState, setActiveSection, setEditExercise, setEditSection, setSelectedExercise, setSelectedSection } from './Components/AppContext';
import Clock from './Components/Clock';
import ConfirmationDialog from './Components/dialogs/ConfirmationDialog';
import EditExerciseDialog from './Components/dialogs/EditExerciseDialog';
import EditSectionDialog from './Components/dialogs/EditSectionDialog';
import NotificationSnackBar from './Components/NotificationSnackBar';
import BottomNavTabs from './Components/tabs/BottomNavTabs';
import { IExercise, ISection } from './DataInterfaces';
import Store, { exercises } from './Store';

interface IProps extends WithStyles<typeof styles> {
  // just for style injection
}

const styles = createStyles({
  App: {
    textAlign: 'center'
  },
})

class App extends Component<IProps, IAppState> {

  public static ContextType: Context<IAppContext>;
  public context!: ContextType<typeof AppContext>;

  constructor(props: any) {
    super(props);

    let newExercises: IExercise[] = [...exercises];

    const customExercises = Store.getSavedExercises();
    if (customExercises && customExercises.length > 0) {
      newExercises = newExercises.concat(customExercises);
    }

    this.state = ContextInstance.state;
  }

  public render() {
    const { 
      snackBarOpen,
      selectedExercise, 
      editSection, 
      editExercise,
      // selectedSection,
    } = this.state;
    const { classes } = this.props;
    const contextValue = {
      dispatch: {
        addExercise: this.addExercise,
        addSection: this.addSection,
        deleteExercise: this.deleteExercise,
        deleteSection: this.deleteSection,
        mutateState,
        save: () => void 0, // TODO: rewrite localstorage handling.
        setActiveSection: this.setActiveSection,
        setConfirmOpen: () => mutateState(this.state, "confirmOpen", !this.state.confirmOpen),
        setEditExercise: this.setEditExercise,
        setEditSection: this.setEditSection,
        setExercises: this.setExercises,
        setSelectedExercise: this.setSelectedExercise,
        setSelectedSection: this.setSelectedSection,
        setTime: this.setTime,
        showMessage: this.showMessage,
        updateSection: this.updateSection,
        updateSectionOrder: this.updateSectionOrder,
      },
      state: {...this.state}
    }

    return (
      <AppContext.Provider value={contextValue}>
        <div className={classes.App}>
          <Clock canvasSide={100} />
          <BottomNavTabs />
          {editSection && <EditSectionDialog 
            section={editSection}/>}
          {editExercise && <EditExerciseDialog 
            exercise={editExercise}
            open={!!editExercise}
            validateExerciseName={this.validateExerciseName}
            submit={contextValue.dispatch.save}/>}
          <ConfirmationDialog open = {contextValue.state.confirmOpen} exercise={selectedExercise} deleteExercise={this.deleteExercise} setConfirmOpen={contextValue.dispatch.setConfirmOpen}/>
          <NotificationSnackBar open={snackBarOpen} handleHide={contextValue.dispatch.setConfirmOpen} />
        </div>
      </AppContext.Provider>
    );
  }

  private validateExerciseName(name: string){
    return this.state.exercises.map(e => e.name).indexOf(name) !== -1;
  }

  @bind
  private deleteExercise(exercise: IExercise){
    this.setState({
      ...deleteExercise(this.state, exercise)
    });
    return true;
  }
  @bind
  private deleteSection(section: ISection){
    this.setState({
      ...deleteSection(this.state, section)
    });
    return true;
  }
  @bind
  private setActiveSection(section: ISection){
    if(section !== this.state.activeSection){
      this.setState({
        ...setActiveSection(this.state, section)
      });
    }
  }
  @bind
  private setEditExercise(exercise: IExercise){
    this.setState({
      ...setEditExercise(this.state, exercise)
      });
  }
  @bind
  private setEditSection(section: ISection | null){
    this.setState({
      ...setEditSection(this.state, section)
      });
  }
  @bind
  private setSelectedExercise(exercise: IExercise){
    this.setState({
      ...setSelectedExercise(this.state, exercise)
      });
  }
  @bind
  private setSelectedSection(section: ISection){
    this.setState({
      ...setSelectedSection(this.state, section)
      });
  }
  @bind
  private setExercises(newExercises: IExercise[]){
    this.setState({
      exercises: newExercises
    })
  }
  @bind
  private updateSection(updatedSection: ISection){
    // TODO: update the selected exercise (and the one in the exercises array)
    // create external state change handler functions for these
    this.setState({
      editSection: updatedSection 
    })
  }
  @bind
  private addSection(newSection: ISection){
    this.setState({
      ...addSection(this.state, newSection)
    })
  }
  @bind
  private addExercise(newExercise: IExercise){
    this.setState({
      ...addExercise(this.state, newExercise)
    })
  }
  @bind
  private updateSectionOrder(sections: ISection[]){
    "huaa";
  }
  @bind
  private showMessage(openstate: boolean, message: string){
    "huaa";
  }
  @bind
  private setTime(){
    const updatedExercise = {...this.state.selectedExercise};
    updatedExercise.startTime = new Date();

    this.setState({
      ...this.state,
      selectedExercise: updatedExercise
    })
  }


  // private setActiveSection = (sectionIndex: number) => {
  //   this.setState({
  //     activeSectionIndex: sectionIndex
  //   })
  // }

  // // returns a section with generated key.
  // private createSection(name: string, description: string, duration: number, color: string, key: string) {
  //   const section: ISection = {
  //     color,
  //     description,
  //     duration,
  //     key,
  //     name,
  //     setupTime: 0 // replace with input
  //   }
  //   return section;
  // }

  // private updateSection(oldSection: ISection, newSection: ISection) {
  //   const { exercises: stateExercises, selectedExerciseIndex } = this.state;

  //   const targetSectionIndex = stateExercises[selectedExerciseIndex].defaultSections.indexOf(oldSection);
  //   if (targetSectionIndex > -1) {

  //     const newExercises = [...stateExercises];
  //     newExercises[selectedExerciseIndex].defaultSections[targetSectionIndex] = newSection;

  //     this.setState(
  //       {
  //         exercises: newExercises,
  //       },
  //       () => Store.saveExercises(newExercises)
  //     )
  //   } else {
  //     // add newSection to the current ex
  //     console.log(`adding new section ${newSection.name}`)
  //     this.addSection(newSection);
  //   }
  // }

  // // TODO: refactor all of these to store?
  // private addSection(section: ISection) {
  //   const { exercises: stateExercises, selectedExerciseIndex } = this.state;

  //   const prevSelectedexercise = stateExercises[selectedExerciseIndex];
  //   if (prevSelectedexercise.preset) {
  //     // create new as a copy of the selected..
  //     console.log("template modified, create a new exercise based on the selected one!");
  //   }

  //   const newExercises = [...stateExercises]
  //   newExercises[selectedExerciseIndex].defaultSections = [...prevSelectedexercise.defaultSections, this.createSection(section.name, section.description, section.duration, section.color, prevSelectedexercise.defaultSections.length.toString())];

  //   this.setState(
  //     {
  //       exercises: newExercises
  //     },

  //     () => Store.saveExercises(newExercises)
  //   )
  // }

  // private deleteSection(section: ISection) {
  //   // prompt user for confirmation?
  //   const { exercises: stateExercises, selectedExerciseIndex } = this.state;

  //   const newSections = [...stateExercises[selectedExerciseIndex].defaultSections];
  //   const index = newSections.indexOf(section);

  //   if (index > -1) {
  //     newSections.splice(index, 1)
  //     const newexercise = { ...stateExercises[selectedExerciseIndex], defaultSections: newSections };
  //     const newExercises = [...stateExercises];
  //     newExercises[selectedExerciseIndex] = newexercise;

  //     this.setState((prevState) => {
  //       return { exercises: newExercises };
  //     },
  //       () => Store.saveExercises(newExercises))
  //   }
  // }

  // private updateSectionOrder = (sections: ISection[]) => {
  //   const { exercises: stateExercises, selectedExerciseIndex } = this.state;
  //   const e = stateExercises[selectedExerciseIndex]
  //   e.defaultSections = sections;

  //   const newExercises = stateExercises;
  //   newExercises[selectedExerciseIndex] = e;

  //   this.setState(
  //     {
  //       exercises: newExercises
  //     },
  //     () => Store.saveExercises(newExercises)
  //   )
  // }

  // private timeChanged = (time: Date) => {
  //   const { exercises: stateExercises, selectedExerciseIndex } = this.state;

  //   console.log(time)
  //   // time is coming in the right format
  //   const newExercises = [...stateExercises];

  //   newExercises[selectedExerciseIndex].startTime = time
  //   this.setState(
  //     {
  //       exercises: newExercises
  //     }
  //   )
  // }

  // private selectExercise = (name: string) => {

  //   const arrayIndex = this.state.exercises.map(exercise => exercise.name).indexOf(name);

  //   if (arrayIndex > -1) {

  //     this.setState(
  //       {
  //         selectedExerciseIndex: arrayIndex
  //       }
  //     )
  //   }
  // }

  // // form submit action handler
  // private submitExerciseEditDialog = (oldExercise: IExercise, newExercise: IExercise) => {
  //   const { exercises: stateExercises } = this.state;
  //   // check indexof old ex and replace with new, if -1 add new
  //   const editIndex = stateExercises.indexOf(oldExercise);
  //   // add new
  //   if (editIndex === -1) {
  //     const newExercises = [...stateExercises, newExercise];

  //     // add and select the new exercise
  //     this.setState(
  //       {
  //         ...this.state,
  //         exercises: newExercises,
  //         selectedExerciseIndex: newExercises.length - 1
  //       },
  //       () => Store.saveExercises(newExercises)
  //     )
  //   }
  //   // edit existing
  //   else {
  //     const editedExercises = [...stateExercises];
  //     editedExercises.splice(editIndex, 1, newExercise)
  //     console.log(editedExercises)
  //     this.setState(
  //       {
  //         ...this.state,
  //         exercises: editedExercises
  //       }
  //     )
  //   }

  // }

  // // pass custom exercises for store to be saved
  // private saveExercises = () => {
  //   const { exercises: stateExercises } = this.state;
  //   const nonPresets = stateExercises.filter(x => x.preset !== true)
  //   // save only here..
  //   Store.saveExercises(nonPresets);
  //   this.handleShowSnackbar();
  // }

  // // return true for valid new name
  // private validateExerciseName = (name: string) => {

  //   const position = this.state.exercises.map(exercise => exercise.name).indexOf(name);

  //   if (position === -1) {
  //     return true;
  //   } else {
  //     return false;
  //   }

  // }

  // private handleDeleteExercise = () => {
  //   const { exercises: stateExercises, deleteExerciseIndex } = this.state;
  //   if (deleteExerciseIndex !== -1) {
  //     console.log(`deleting exercise at ${deleteExerciseIndex}`)
  //     const newExercises = [...stateExercises];
  //     // set selected to first in list (presets should always exist)
  //     this.setState({
  //       selectedExerciseIndex: 0
  //     })

  //     newExercises.splice(deleteExerciseIndex, 1)

  //     this.setState(
  //       {
  //         exercises: newExercises
  //       },
  //       () => Store.saveExercises(newExercises)
  //     )
  //   }
  // }

  // private handleSectionEditToggle = (section: ISection) => {

  //   const { editSectionOpen, exercises: stateExercises, selectedExerciseIndex } = this.state;

  //   // open for edit
  //   if (!editSectionOpen) {
  //     const i = stateExercises[selectedExerciseIndex].defaultSections.indexOf(section);
  //     this.setState({ selectedSectionIndex: i })
  //   }

  //   this.setState({
  //     editSectionOpen: !this.state.editSectionOpen
  //   })
  // }

  // private handleExerciseEditToggle = (exercise: IExercise) => {
  //   const { editExerciseOpen, exercises: stateExercises } = this.state;

  //   // open for edit
  //   if (!editExerciseOpen) {
  //     const i = stateExercises.indexOf(exercise);
  //     // console.log('opened for editing: ', i)
  //     this.setState({ editExerciseIndex: i })
  //   }
  //   // get exercise name to validate uniqueness etc.
  //   this.setState(
  //     { editExerciseOpen: !editExerciseOpen }
  //   )

  // }

  // private handleShowSnackbar = () => {
  //   this.setState({ snackBarOpen: true });
  // };

  // private handleCloseSnackbar = (event: Event, reason: string) => {
  //   if (reason === 'clickaway') {
  //     return;
  //   }

  //   this.setState({ snackBarOpen: false });
  // };

  // private handleToggleCofirmationDialog = (deleteIndex: number) => {

  //   // const { confirmationDialogOpen } = this.state;
  //   this.setState(
  //     {
  //       // confirmationDialogOpen: !confirmationDialogOpen,
  //       confirmationDialogOpen: true,
  //       deleteExerciseIndex: deleteIndex
  //     }
  //   );

  // }

}

export default withStyles(styles)(App);
