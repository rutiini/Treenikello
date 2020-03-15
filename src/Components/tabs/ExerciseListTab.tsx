import { createStyles, Fab, Theme, withStyles, WithStyles } from "@material-ui/core";
import { IconButton, List, ListItem, ListItemIcon, ListItemSecondaryAction, ListItemText } from "@material-ui/core";
import React, { FunctionComponent, useContext, useState } from "react";
import { IExercise } from "../../DataInterfaces";
import ExerciseContext from "../../AppReducer/ExerciseContext";
import { ActionType } from "../../AppReducer/ExerciseReducer";
import ExerciseEditor from "../dialogs/ExerciseEditor";
import { getExerciseDuration, emptyExercise } from "../../Utils";

/** component props */
interface IProps extends WithStyles {
    exercises: ReadonlyArray<IExercise>;
    selected: number;
    selectExercise: (exercise: IExercise) => void;
}

const styles = (theme: Theme) =>
    createStyles({
        listItem: {
            backgroundColor: theme.palette.primary.main[400],
            justifyContent: "center",
            textAlign: "center",
            width: "100%",
        },
        selectedListItem: {
            backgroundColor: theme.palette.action.selected,
            justifyContent: "center",
            textAlign: "center",
            width: "100%",
        },
        root: {
            overflow: "hidden",
            userSelect: "none",
            height: "100%",
        },
        list: {
            "height": "100%",
            "overflow": "auto",
            "transition": "transform 300ms ease-in-out",
            "$root.expanded>&": {
                transform: "translateY(-100%)",
                overflow: "hidden",
            },
        },
        editor: {
            "height": "100%",
            "overflow": "hidden",
            "transition": "transform 300ms ease-in-out",
            "$root.expanded>&": {
                transform: "translateY(-100%)",
            },
        },
    });

const MS_IN_M: number = 60000;

/**
 * Props exercise list tab
 * @param props
 * @returns Tab for managing exercises
 */
const ExerciseListTab: FunctionComponent<IProps> = (props: IProps) => {
    const [state, dispatch] = useContext(ExerciseContext);
    const [exerciseInEdit, setExerciseInEdit] = useState<IExercise | null>(null);

    const { classes } = props;
    const { exercises, selectExercise, selected } = props;

    const onClick = React.useCallback(
        (exercise: IExercise) => {
            selectExercise(exercise);
        },
        [selectExercise],
    );

    const addClicked = React.useCallback(() => {
        const newExercise: IExercise = emptyExercise;
        setExerciseInEdit(newExercise);
    }, [setExerciseInEdit]);

    const editClicked = React.useCallback(
        (exercise: IExercise) => {
            setExerciseInEdit(exercise);
        },
        [setExerciseInEdit],
    );

    const updateExercise = React.useCallback(
        (exercise: IExercise): void => {
            // currently adds new every time instead of updating. FIX.
            if (exerciseInEdit && exerciseInEdit !== emptyExercise) {
                dispatch({
                    type: ActionType.UpdateExercise,
                    payload: {
                        updatedExercise: exercise,
                        targetExercise: exerciseInEdit,
                    },
                });
            } else {
                dispatch({ type: ActionType.AddExercise, payload: exercise });
            }
            setExerciseInEdit(null);
        },
        [exerciseInEdit, dispatch, setExerciseInEdit],
    );

    const deleteExercise = React.useCallback(
        (exercise: IExercise): void => {
            dispatch({ type: ActionType.DeleteExercise, payload: exercise });
            setExerciseInEdit(null);
        },
        [dispatch, setExerciseInEdit],
    );

    const closeEditor = React.useCallback((): void => {
        setExerciseInEdit(null);
    }, [setExerciseInEdit]);

    const exerciseItems = React.useMemo(
        () =>
            exercises.map((exercise, index) => (
                <StyledExerciseListElement
                    key={exercise.name}
                    selected={selected === index}
                    exercise={exercise}
                    onClick={onClick}
                    onEditClick={editClicked}
                />
            )),
        [exercises, selected, onClick, editClicked],
    );

    return (
        <div className={`${props.classes.root} ${exerciseInEdit ? "expanded" : "collapsed"}`}>
            <div className={props.classes.list}>
                <List>
                    {exerciseItems}
                    <ListItem className={classes.listItem} key="add-exercise-btn">
                        <Fab color="primary" aria-label="add" onClick={addClicked}>
                            <i className="material-icons">add</i>
                        </Fab>
                    </ListItem>
                </List>
            </div>
            <div className={props.classes.editor}>
                <ExerciseEditor
                    exercise={exerciseInEdit}
                    usedNames={state.exercises.map((e) => e.name)}
                    updateExercise={updateExercise}
                    deleteExercise={deleteExercise}
                    cancel={closeEditor}
                />
            </div>
        </div>
    );
};

interface IExerciseListElementProps extends WithStyles {
    exercise: IExercise;
    selected: boolean;
    onClick(exercise: IExercise): void;
    onEditClick(exercise: IExercise): void;
}

const ExerciseListElement: React.FunctionComponent<IExerciseListElementProps> = (props) => {
    const { exercise, selected, onClick, onEditClick, classes } = props;

    const duration: number = getExerciseDuration(exercise);

    const handleClick = React.useCallback(() => {
        onClick(exercise);
    }, [exercise, onClick]);

    const handleEditClick = React.useCallback(() => {
        onEditClick(exercise);
    }, [exercise, onEditClick]);
    // parse timestamps for start and stop
    const starts = `${exercise.startTime.toLocaleTimeString("FI", {
        hour: "2-digit",
        minute: "2-digit",
    })}`;

    const stopTime = new Date(exercise.startTime.getTime() + duration * MS_IN_M);
    const stops = `${stopTime.toLocaleTimeString("FI", {
        hour: "2-digit",
        minute: "2-digit",
    })}`;

    const exerciseKey = exercise.name;

    return (
        <ListItem
            className={selected ? classes.selectedListItem : classes.listItem}
            key={exerciseKey}
            value={exercise.name}
            onClick={handleClick}
        >
            <ListItemIcon>
                <i className="material-icons">whatshot</i>
            </ListItemIcon>
            <ListItemText
                primary={exercise.name}
                secondary={`${starts} - ${stops} | ${duration} min | ${exercise.defaultSections.length} osiota`}
            />
            <ListItemSecondaryAction>
                <IconButton onClick={handleEditClick} disabled={exercise.preset}>
                    <i className="material-icons">edit</i>
                </IconButton>
            </ListItemSecondaryAction>
        </ListItem>
    );
};

const StyledExerciseListElement = withStyles(styles)(ExerciseListElement);

export default withStyles(styles)(ExerciseListTab);
