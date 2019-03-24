import { createStyles, WithStyles, withStyles } from '@material-ui/core';
import React, { FunctionComponent, useReducer } from 'react';
import { AppContext, IAppContext, mutateState } from './Components/AppContext';
import Clock from './Components/Clock';
import ConfirmationDialog from './Components/dialogs/ConfirmationDialog';
import EditExerciseDialog from './Components/dialogs/EditExerciseDialog';
import EditSectionDialog from './Components/dialogs/EditSectionDialog';
import NotificationSnackBar from './Components/NotificationSnackBar';
import BottomNavTabs from './Components/tabs/BottomNavTabs';
import { IExercise, ISection } from './DataInterfaces';
import { ActionType, DefaultAppState, ExerciseReducer } from './ExerciseReducer';

interface IProps extends WithStyles<typeof styles> {
  // just for style injection
}

const styles = createStyles({
  App: {
    textAlign: 'center'
  },
})

/** TODO: refactor using hooks, replace context with reducer */
const App: FunctionComponent<IProps & WithStyles> = (props: IProps) => {

  const [state, dispatch] = useReducer(ExerciseReducer, DefaultAppState);
  const { classes } = props;
  const {editSection, editExercise } = state;

  const validateExerciseName = (name: string) => {

    const position = state.exercises.map(exercise => exercise.name).indexOf(name);

    if (position === -1) {
      return true;
    } else {
      return false;
    }
  }
  const deleteExercise = (exercise: IExercise) => dispatch({type: ActionType.DeleteExercise, payload: exercise});
  /** provide the reducer through context during transformation, after hooks are fully implemented the context becomes obsolete */
  const contextValue: IAppContext = {
    dispatch: {
      addExercise: (exercise: IExercise) => dispatch({type: ActionType.AddExercise, payload: exercise}),
      addSection: (section: ISection) => dispatch({type: ActionType.AddSection, payload: section}),
      deleteExercise: (exercise: IExercise) => {dispatch({type: ActionType.DeleteExercise, payload: exercise}); return true;},
      deleteSection: (section: ISection) => {dispatch({type: ActionType.DeleteSection, payload: section}); return true;},
      mutateState,
      save: () => void 0, // TODO: rewrite localstorage handling.
      setActiveSection: (section: ISection) => dispatch({type: ActionType.SetActiveSection, payload: section}),
      setConfirmOpen: () => void 0,
      setEditExercise: (exercise: IExercise) => dispatch({type: ActionType.SetEditExercise, payload: exercise}),
      setEditSection: (section: ISection) => dispatch({type: ActionType.SetEditSection, payload: section}),
      setExercises: (allExercises: ReadonlyArray<IExercise>) => dispatch({type: ActionType.UpdateAllExercises, payload: allExercises}),
      setSelectedExercise: (exercise: IExercise) => dispatch({type: ActionType.SetActiveExercise, payload: exercise}),
      setSelectedSection: (section: ISection) => dispatch({type: ActionType.SetEditSection, payload: section}),
      setTime: (time: Date) => dispatch({type: ActionType.UpdateStartTime, payload: time}),
      showMessage: () => void 0,
      updateSection: (section: ISection) => dispatch({type: ActionType.UpdateSection, payload: section}),
      updateSectionOrder: (sections: ReadonlyArray<ISection>) => dispatch({type: ActionType.UpdateAllSections, payload: sections}),
    },
    state: {...state,
      selectedExercise: state.activeExercise // to be removed
    }
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
            validateExerciseName={validateExerciseName}
            submit={contextValue.dispatch.save}/>}
          <ConfirmationDialog open = {contextValue.state.confirmOpen} exercise={state.activeExercise} deleteExercise={deleteExercise} setConfirmOpen={contextValue.dispatch.setConfirmOpen}/>
          <NotificationSnackBar open={state.snackBarOpen} handleHide={contextValue.dispatch.setConfirmOpen} />
        </div>
      </AppContext.Provider>
    );
  }

export default withStyles(styles)(App);
