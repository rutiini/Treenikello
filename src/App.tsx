import { createStyles, WithStyles, withStyles } from "@material-ui/core";
import React, { FunctionComponent, useReducer, useState } from "react";
import ExerciseContext from "./Components/AppReducer/ExerciseContext";
import { ActionType, DefaultAppState, ExerciseReducer } from "./Components/AppReducer/ExerciseReducer";
import Clock from "./Components/Clock";
import ConfirmationDialog from "./Components/dialogs/ConfirmationDialog";
import NotificationSnackBar from "./Components/NotificationSnackBar";
import BottomNavTabs from "./Components/tabs/BottomNavTabs";
import { IExercise } from "./DataInterfaces";

const styles = createStyles({
    App: {
        textAlign: "center",
    },
});

const App: FunctionComponent<WithStyles> = (props) => {
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [state, dispatch] = useReducer(ExerciseReducer, DefaultAppState);
    const { classes } = props;

    const deleteExercise = React.useCallback(
        (exercise: IExercise) => dispatch({ type: ActionType.DeleteExercise, payload: exercise }),
        [dispatch],
    );

    const handleSnackBarClose = React.useCallback(() => {
        dispatch({ type: ActionType.CloseSnackbar });
    }, [dispatch]);

    return (
        <ExerciseContext.Provider value={[state, dispatch]}>
            <div className={classes.App}>
                <Clock canvasSide={100} />
                <BottomNavTabs />
                <ConfirmationDialog
                    open={confirmOpen}
                    exercise={state.activeExercise}
                    deleteExercise={deleteExercise}
                    setConfirmOpen={setConfirmOpen}
                />
                <NotificationSnackBar open={state.snackBarOpen} handleHide={handleSnackBarClose} />
            </div>
        </ExerciseContext.Provider>
    );
};

export default withStyles(styles)(App);
