import { createStyles, withStyles } from '@material-ui/core';
import { Button } from '@material-ui/core';
import { IconButton, List, ListItem, ListItemIcon, ListItemSecondaryAction, ListItemText } from '@material-ui/core';
import React, { SFC } from 'react';
import { IExercise } from '../DataInterfaces';

const styles = createStyles({
  listItem: {
    justifyContent: 'center',
    textAlign: 'center',
    width: '100%'
  },
  root: {
    // height: '100%',
    // backgroundColor: theme.palette.background.paper,
  }
});

interface IProps{
  classes: any, 
  exercises: IExercise[], 
  selectExercise: (exerciseName: string) => void,
  handleExerciseEditToggle: (exercise?: IExercise) => void,
  deleteExercise: (exercise: IExercise) => void,
  selectedExerciseIndex: number
}

const ExerciseListTab: SFC<IProps> = (props) => {
  const { classes, exercises, selectExercise, handleExerciseEditToggle, deleteExercise } = props;
  const placeHolderIcon = <i className="material-icons">whatshot</i>
  const deleteIcon = <i className="material-icons">delete</i>
  const editIcon = <i className="material-icons">edit</i>

  // const clicked = ()  => ({target: { value }}) => {
  const clicked = (exercise: IExercise) => () => {
    selectExercise(exercise.name);
  }

  const addClicked = () => {
    handleExerciseEditToggle();
  }
  const editClicked = (exercise: IExercise) => () => {
    handleExerciseEditToggle(exercise);
  }
  const deleteClicked = (exercise: IExercise) => () => {
    // confirmation prompt?
    deleteExercise(exercise);
  }

  const exerciseItems = exercises.map((exercise, index) => {
    
    // add in visual indicator to selected exercise!
    const selected = props.selectedExerciseIndex === index;
    const backgroundColor = selected ? 'lightgrey' : 'white';
    
    let duration =  0;
    
    exercise.defaultSections.forEach(element => {
      duration = duration + element.duration;
    });
    
    // parse timestamps for start and stop
    const starts = `${exercise.startTime.toLocaleTimeString('FI', {hour: '2-digit', minute:'2-digit'})}`;
    const stopTime = new Date(exercise.startTime.getTime() + duration*60000);
    const stops = `${stopTime.toLocaleTimeString('FI', {hour: '2-digit', minute:'2-digit'})}`;

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
      <ListItem className={classes.listItem} key={exerciseKey} value={exercise.name} onClick={clicked(exercise)} style={{backgroundColor}} button={true}>
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
      <List component="nav" style={{height: '100%', paddingTop: 0, paddingBottom: 0}}>
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

export default withStyles(styles)(ExerciseListTab);