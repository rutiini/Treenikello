import {
  createStyles,
  Fab,
  Theme,
  withStyles,
  WithStyles
} from "@material-ui/core";
import {
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText
} from "@material-ui/core";
import React, { FunctionComponent, useContext } from "react";
import { IExercise } from "../../DataInterfaces";
import ExerciseContext from "../AppReducer/ExerciseContext";

/** component props */
interface IProps extends WithStyles<typeof styles> {
  exercises: ReadonlyArray<IExercise>;
  selected: number;
  theme: Theme;
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
    }
  });

const MS_IN_M: number = 60000;

/**
 * Props exercise list tab
 * @param props
 * @returns Tab for managing exercises
 */
const ExerciseListTab: FunctionComponent<
  IProps & WithStyles<"listItem" | "selectedListItem">
> = props => {
  const { classes } = props;
  const {
    exercises,
    selectExercise,
    toggleExerciseDialog,
    deleteExercise,
    selected
  } = props;
  
  const [state, /*dispatch*/] = useContext(ExerciseContext);

  const placeHolderIcon = <i className="material-icons">whatshot</i>;
  const deleteIcon = <i className="material-icons">delete</i>;
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
    toggleExerciseDialog(newExercise);
  };
  const editClicked = (exercise: IExercise) => () => {
    toggleExerciseDialog(exercise);
  };
  const deleteClicked = (exercise: IExercise) => () => {
    // confirmation prompt?
    deleteExercise(exercise);
  };

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
    const stopTime = new Date(
      exercise.startTime.getTime() + duration * MS_IN_M
    );
    const stops = `${stopTime.toLocaleTimeString("FI", {
      hour: "2-digit",
      minute: "2-digit"
    })}`;
    const exerciseKey = exercise.name;
    return (
      <ListItem
        className={
          selected === index ? classes.selectedListItem : classes.listItem
        }
        key={exerciseKey}
        value={exercise.name}
        onClick={clicked(exercise)}
        // button={true}
      >
        <ListItemIcon>{placeHolderIcon}</ListItemIcon>
        <ListItemText
          primary={exercise.name}
          secondary={`${starts} - ${stops} | ${duration} min | ${
            exercise.defaultSections.length
          } osiota`}
        />
        <ListItemSecondaryAction>
          {/*buttons disabled for presets.*/}
          <IconButton
            onClick={deleteClicked(exercise)}
            /*disabled={exercise.preset}*/
          >
            {deleteIcon}
          </IconButton>
          <IconButton
            onClick={editClicked(exercise)}
            disabled={exercise.preset}
          >
            {editIcon}
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
    );
  });

  return (
    <div className={`${classes.root} ${state.editExercise ? "expanded" : "collapsed"}`}>
      <div className={classes.list}>
      <List
        component="nav"
        style={{ height: "100%", paddingTop: 0, paddingBottom: 0 }}
      >
        {exerciseItems}
        <ListItem className={classes.listItem} key="add-exercise-btn">
          <Fab color="primary" aria-label="add" onClick={addClicked}>
            <i className="material-icons">add</i>
          </Fab>
        </ListItem>
      </List>
      </div>
      <div className={classes.editor}>
        EDITOR
      </div>
    </div>
  );
};

export default withStyles(styles, { withTheme: true })(ExerciseListTab);
