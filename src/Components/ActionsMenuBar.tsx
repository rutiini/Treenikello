import { AppBar, createStyles, Fab, Toolbar, Typography, withStyles } from "@material-ui/core";
import React from "react";
import { IExercise } from "../DataInterfaces";

const styles = createStyles({
    button: {
        marginRight: 10
    },
    flex: {
        flex: 1
    },
    menuButton: {
        marginLeft: -12,
        marginRight: 20
    },
    root: {
        alignContent: "center",
        flexGrow: 1,
        userSelect: "none"
    },
    timeInput: {
        fontSize: 20,
        textColor: "#ffffff"
    }
});

interface IProps {
    classes: any;
    exercise: IExercise;
    setTime: (time: Date) => void;
    title: string;
    saveExercises: () => void;
}

const ActionsMenuBar: React.FC<IProps> = props => {
    const { classes, title, setTime, saveExercises } = props;

    const setTimeNow = React.useCallback(() => {
        setTime(new Date());
    }, [setTime]);

    const saveAllExercises = React.useCallback(() => {
        saveExercises();
    }, [saveExercises]);

    return (
        <div className={classes.root}>
            <AppBar position="static" color="secondary">
                <Toolbar>
                    <Fab color="primary" onClick={saveAllExercises}>
                        <i className="material-icons">save</i>
                    </Fab>
                    <Typography variant="h4" color="inherit" className={classes.flex}>
                        {title}
                    </Typography>
                    <Fab color="primary" onClick={setTimeNow}>
                        <i className="material-icons">play_circle_outline</i>
                    </Fab>
                </Toolbar>
            </AppBar>
        </div>
    );
};

export default withStyles(styles)(ActionsMenuBar);
