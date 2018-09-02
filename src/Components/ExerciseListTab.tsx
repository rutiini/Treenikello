import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core';
import { Button } from '@material-ui/core';
import { IconButton, List, ListItem, ListItemIcon, ListItemSecondaryAction, ListItemText } from '@material-ui/core';
import React, { SFC } from 'react';
import { IExercise, IExerciseContext } from '../DataInterfaces';
import { withExerciseContext } from '../ExerciseContext';

const styles = (theme: Theme) => createStyles({
  listItem: {
    backgroundColor: theme.palette.primary.main[400],
    justifyContent: 'center',
    textAlign: 'center',
    width: '100%',
  },
  selectedListItem: {
    backgroundColor: theme.palette.secondary.main,
    justifyContent: 'center',
    textAlign: 'center',
    width: '100%'
  }
});

interface IProps extends WithStyles {
  exerciseContext: IExerciseContext
}

const ExerciseListTab: SFC<IProps> = (props) => {
  const { classes } = props;
  const {
    exercises,
    selectExercise,
    toggleExerciseDialog,
    deleteExercise,
    selectedExerciseIndex
  } = props.exerciseContext;

  const placeHolderIcon = <i className="material-icons">whatshot</i>
  const deleteIcon = <i className="material-icons">delete</i>
  const editIcon = <i className="material-icons">edit</i>

  const clicked = (exercise: IExercise) => () => {
  selectExercise(exercise.name)
  }

  const addClicked = () => {
    const newExercise: IExercise = {
      defaultSections: [],
      name: "",
      preset: false,
      startTime: new Date()
    }
    toggleExerciseDialog(newExercise);
  }
  const editClicked = (exercise: IExercise) => () => {
    toggleExerciseDialog(exercise);
  }
  const deleteClicked = (exercise: IExercise) => () => {
    // confirmation prompt?
    deleteExercise(exercises.indexOf(exercise));
  }

  const exerciseItems = exercises.map((exercise, index) => {

    // add in visual indicator to selected exercise!
    const selected = selectedExerciseIndex === index;
    
    // const backgroundColor = selected ? 'grey' : 'orange';
    // from theme
    // const backgroundColor = selected ? 'orange' : 'grey';
    const styleClass = selected ? classes.selectedListItem : classes.listItem;

    let duration = 0;

    exercise.defaultSections.forEach(element => {
      duration = duration + element.duration;
    });

    // parse timestamps for start and stop
    const starts = `${exercise.startTime.toLocaleTimeString('FI', { hour: '2-digit', minute: '2-digit' })}`;
    const stopTime = new Date(exercise.startTime.getTime() + duration * 60000);
    const stops = `${stopTime.toLocaleTimeString('FI', { hour: '2-digit', minute: '2-digit' })}`;

    // buttons disabled for presets.
    let deleteBtn;
    let editBtn;
    if (exercise.preset) {
      deleteBtn =
        <IconButton disabled={true}>
          {deleteIcon}
        </IconButton>
      editBtn =
        <IconButton disabled={true}>
          {editIcon}
        </IconButton>
    } else {
      deleteBtn =
        <IconButton onClick={deleteClicked(exercise)}>
          {deleteIcon}
        </IconButton>
      editBtn =
        <IconButton onClick={editClicked(exercise)}>
          {editIcon}
        </IconButton>
    }

    const exerciseKey = exercise.name;
    return (
      <ListItem className={styleClass} key={exerciseKey} value={exercise.name} onClick={clicked(exercise)}
      // style={{ backgroundColor }}
      // focusVisibleClassName='secondary'
      button={true}>
        <ListItemIcon className={classes.listItemIcon}>
          {placeHolderIcon}
        </ListItemIcon>
        <ListItemText
          primary={exercise.name}
          secondary={`${starts} - ${stops} | ${duration} min | ${exercise.defaultSections.length} osiota`} />
        <ListItemSecondaryAction>
          {deleteBtn}
          {editBtn}
        </ListItemSecondaryAction>
      </ListItem>
    )
  })

  return (
    <div className={classes.root}>
      <List component="nav" style={{ height: '100%', paddingTop: 0, paddingBottom: 0 }}>
        {exerciseItems}
        <ListItem className={classes.listItem} key='add-exercise-btn'>
          <Button variant="fab" mini={true} color="secondary" aria-label="add" onClick={addClicked}>
            <i className="material-icons">add</i>
          </Button>
        </ListItem>
      </List>
    </div>
  );
}


export default withExerciseContext(withStyles(styles)(ExerciseListTab));