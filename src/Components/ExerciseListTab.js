import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import List, { ListItem, ListItemIcon, ListItemText, ListItemSecondaryAction } from 'material-ui/List';
import IconButton from 'material-ui/IconButton';
import Button from 'material-ui/Button';

const styles = theme => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
  listItem: {
    width: '100%',
    textAlign: 'center',
    justifyContent: 'center'
  }
});

function ExerciseListTab(props) {
  const { classes,exercises, selectExercise } = props;
  const placeHolderIcon = <i className="material-icons">whatshot</i>
  const deleteIcon = <i className="material-icons">delete</i>
  const editIcon = <i className="material-icons">edit</i>
  
  // const clicked = ()  => ({target: { value }}) => {
  const clicked = exercise => () => {
    selectExercise(exercise.name)
  }

  const exerciseItems = exercises.map((exercise,index) => {
    let duration = 0;
    exercise.defaultSections.forEach(element => {
      duration = duration + Number.parseInt(element.duration,10);
    });
    // delete button only for non-presets
    let deleteBtn;
    if(exercise.preset){
      deleteBtn = 
      <IconButton disabled>
        {deleteIcon}
      </IconButton>
    }else{
      deleteBtn = 
      <IconButton>
        {deleteIcon}
      </IconButton>
    } 

  const exerciseKey = exercise.name;
    return (
      <ListItem className={classes.listItem} key={exerciseKey} index={index} value={exercise.name} onClick={clicked(exercise)} button>
      <ListItemIcon className={classes.listItemIcon}>
      {placeHolderIcon}
      </ListItemIcon>
      <ListItemText primary={exercise.name} secondary={`kesto: ${duration} min`}/>
      <ListItemSecondaryAction>
      {deleteBtn}
      <IconButton>
      {editIcon}
      </IconButton>
      </ListItemSecondaryAction>
      </ListItem>
    )
  })
  
  return (
    // <div className={classes.root}>
    <List component="nav">
    {exerciseItems}
    <ListItem className={classes.listItem} key='add-exercise-btn'>
    <Button variant="fab" mini color="secondary" aria-label="add">
    <i className="material-icons">add</i>
    </Button>
    </ListItem>
    </List>
    // </div>
  );
}

ExerciseListTab.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ExerciseListTab);