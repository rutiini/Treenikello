import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import List, { ListItem, ListItemIcon, ListItemText, ListItemSecondaryAction } from 'material-ui/List';
import IconButton from 'material-ui/IconButton';
import Button from 'material-ui/Button';

const styles = theme => ({
  root: {
    // height: '100%',
    backgroundColor: theme.palette.background.paper,
  },
  listItem: {
    width: '100%',
    textAlign: 'center',
    justifyContent: 'center'
  }
});

function ExerciseListTab(props) {
  const { classes, exercises, selectExercise, handleExerciseEditToggle, deleteExercise } = props;
  const placeHolderIcon = <i className="material-icons">whatshot</i>
  const deleteIcon = <i className="material-icons">delete</i>
  const editIcon = <i className="material-icons">edit</i>

  // const clicked = ()  => ({target: { value }}) => {
  const clicked = exercise => () => {
    selectExercise(exercise.name)
  }

  const addClicked = () => {
    handleExerciseEditToggle()
  }
  const editClicked = exercise => () => {
    handleExerciseEditToggle(exercise)
  }
  const deleteClicked = exercise => () => {
    // confirmation prompt?
    deleteExercise(exercise)
  }

  const exerciseItems = exercises.map((exercise, index) => {
    
    // add in visual indicator to selected exercise!
    let selected = props.selectedExerciseIndex === index;
    let backgroundColor = selected ? 'lightgrey' : 'white';
    
    let duration =  0;
    
    exercise.defaultSections.forEach(element => {
      duration = duration + Number.parseInt(element.duration, 10);
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
        <IconButton disabled>
          {deleteIcon}
        </IconButton>
      editBtn =
        <IconButton disabled>
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
      <ListItem className={classes.listItem} key={exerciseKey} index={index} value={exercise.name} onClick={clicked(exercise)} style={{backgroundColor: backgroundColor}} button>
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
          <Button variant="fab" mini color="secondary" aria-label="add" onClick={addClicked}>
            <i className="material-icons">add</i>
          </Button>
        </ListItem>
      </List>
    </div>
  );
}

ExerciseListTab.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ExerciseListTab);