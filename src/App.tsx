import { createStyles, WithStyles, withStyles } from "@material-ui/core";
import React, { FunctionComponent, useReducer, useState, useEffect } from "react";
import ExerciseContext from "./Components/AppReducer/ExerciseContext";
import {
  ActionType,
  DefaultAppState,
  ExerciseReducer
} from "./Components/AppReducer/ExerciseReducer";
import Clock from "./Components/Clock";
import ConfirmationDialog from "./Components/dialogs/ConfirmationDialog";
import EditExerciseDialog from "./Components/dialogs/EditExerciseDialog";
import EditSectionDialog from "./Components/dialogs/EditSectionDialog";
import NotificationSnackBar from "./Components/NotificationSnackBar";
import BottomNavTabs from "./Components/tabs/BottomNavTabs";
import { IExercise } from "./DataInterfaces";
import TimeContext from "./Components/AppReducer/TimeContext";

interface IProps extends WithStyles<typeof styles> {
  // just for style injection
}

const styles = createStyles({
  App: {
    textAlign: "center"
  }
});

/** TODO: refactor using hooks, replace context with reducer */
const App: FunctionComponent<IProps & WithStyles> = (props: IProps) => {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [time, setTime] = useState(new Date());
  const [state, dispatch] = useReducer(ExerciseReducer, DefaultAppState);
  const { classes } = props;
  const { editSection, editExercise } = state;

  useEffect(() => {
    const timer = setInterval(() => {
        setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
}, []);

  const save = () => void 0;
  const validateExerciseName = (name: string) => {
    const position = state.exercises
      .map(exercise => exercise.name)
      .indexOf(name);

    if (position === -1) {
      return true;
    } else {
      return false;
    }
  };
  const deleteExercise = (exercise: IExercise) =>
    dispatch({ type: ActionType.DeleteExercise, payload: exercise });

  return (
    <ExerciseContext.Provider value={[state, dispatch]}>
      <TimeContext.Provider value={time}>
        <div className={classes.App}>
          <Clock canvasSide={100} />
          <BottomNavTabs />
          {editSection && <EditSectionDialog section={editSection} />}
          {editExercise && (
            <EditExerciseDialog
              exercise={editExercise}
              open={!!editExercise}
              validateExerciseName={validateExerciseName}
              submit={save}
            />
          )}
          <ConfirmationDialog
            open={confirmOpen}
            exercise={state.activeExercise}
            deleteExercise={deleteExercise}
            setConfirmOpen={setConfirmOpen}
          />
          <NotificationSnackBar
            open={state.snackBarOpen}
            handleHide={setConfirmOpen}
          />
        </div>
      </TimeContext.Provider>
    </ExerciseContext.Provider>
  );
};

export default withStyles(styles)(App);
