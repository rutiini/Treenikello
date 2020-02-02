import { createStyles, Fab, Theme, withStyles, WithStyles } from "@material-ui/core";
import { IconButton, List, ListItem, ListItemIcon, ListItemSecondaryAction, ListItemText } from "@material-ui/core";
import React, { FunctionComponent, useContext, useState } from "react";
import { IExercise } from "../../DataInterfaces";
import ExerciseContext from "../AppReducer/ExerciseContext";
import { ActionType } from "../AppReducer/ExerciseReducer";
import ExerciseEditor from "../dialogs/ExerciseEditor";

/** component props */
interface IProps extends WithStyles {
    exercises: ReadonlyArray<IExercise>;
    selected: number;
    toggleExerciseDialog: (exercise: IExercise) => void;
    deleteExercise: (exercise: IExercise) => boolean;
    selectExercise: (exercise: IExercise) => void;
}

const styles = (theme: Theme) =>
  createStyles({
    listItem: {
      backgroundColor: theme.palette.primary.main[400],
      justifyContent: "center",
      textAlign: "center",
      width: "100%"
    },
    selectedListItem: {
      backgroundColor: theme.palette.action.selected,
      justifyContent: "center",
      textAlign: "center",
      width: "100%"
    },
    root: {
      overflow: 'hidden',
      userSelect: 'none',
      height: "100%"
    },
    list: {
      height: "100%",
      overflow: "auto",
      transition: "transform 300ms ease-in-out",
      "$root.expanded>&": {
        transform: "translateY(-100%)",
        overflow: "hidden"
      }
    },
    editor: {
      height: "100%",
      overflow: "hidden",
      transition: "transform 300ms ease-in-out",
      "$root.expanded>&": {
        transform: "translateY(-100%)",
      }
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

    const placeHolderIcon = <i className="material-icons">whatshot</i>;
    const editIcon = <i className="material-icons">edit</i>;

    const clicked = (exercise: IExercise) => () => {
        selectExercise(exercise);
    };

    const addClicked = () => {
      const newExercise: IExercise = {
            defaultSections: [],
            name: "",
            preset: false,
            startTime: new Date()
        };
        setExerciseInEdit(newExercise);
        // dispatch({ type: ActionType.AddExercise, payload: newExercise });
    };

    const editClicked = (exercise: IExercise) => () => {
      setExerciseInEdit(exercise);
        // dispatch({ type: ActionType.SetEditExercise, payload: exercise });
    };

    function updateExercise(exercise: IExercise): void {
        if (exerciseInEdit) {
          dispatch({ type: ActionType.AddExercise, payload: exercise });
          setExerciseInEdit(null);
        } else {
            dispatch({ type: ActionType.UpdateExercise, payload: exercise });
        }
    }

    function deleteExercise(exercise: IExercise): void {
      dispatch({type: ActionType.DeleteExercise, payload: exercise});
      setExerciseInEdit(null);
    }

    function closeEditor(): void {
      // dispatch({type: ActionType.SetEditExercise, payload: null});
      setExerciseInEdit(null);
    }
    const exerciseItems = exercises.map((exercise, index) => {
        let duration: number = 0;

        exercise.defaultSections.forEach(element => {
            duration = +element.duration + element.setupTime; // todo: this gets interpreted as string for some reason.
        });

        // parse timestamps for start and stop
        const starts = `${exercise.startTime.toLocaleTimeString("FI", {
            hour: "2-digit",
            minute: "2-digit"
        })}`;
        const stopTime = new Date(exercise.startTime.getTime() + duration * MS_IN_M);
        const stops = `${stopTime.toLocaleTimeString("FI", {
            hour: "2-digit",
            minute: "2-digit"
        })}`;
        const exerciseKey = exercise.name;
        return (
            <ListItem
                className={selected === index ? classes.selectedListItem : classes.listItem}
                key={exerciseKey}
                value={exercise.name}
                onClick={clicked(exercise)}
                // button={true}
            >
                <ListItemIcon>{placeHolderIcon}</ListItemIcon>
                <ListItemText
                    primary={exercise.name}
                    secondary={`${starts} - ${stops} | ${duration} min | ${exercise.defaultSections.length} osiota`}
                />
                <ListItemSecondaryAction>
                    <IconButton onClick={editClicked(exercise)} disabled={exercise.preset}>
                        {editIcon}
                    </IconButton>
                </ListItemSecondaryAction>
            </ListItem>
        );
    });

    return <div className={`${props.classes.root} ${exerciseInEdit ? "expanded" : "collapsed"}`}>
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
        {/* {exerciseInEdit && JSON.stringify(exerciseInEdit)} */}
        <ExerciseEditor 
        exercise={exerciseInEdit}
        usedNames={state.exercises.map(e => e.name)}
        updateExercise={updateExercise}
        deleteExercise={deleteExercise}
        cancel={closeEditor}
        />
        </div>
      </div>;
};

export default withStyles(styles)(ExerciseListTab);
