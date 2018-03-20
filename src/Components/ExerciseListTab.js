import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import List, { ListItem, ListItemIcon, ListItemText, ListItemSecondaryAction } from 'material-ui/List';
import IconButton from 'material-ui/IconButton';

const styles = theme => ({
  root: {
    width: '100%',
    height: 300,
    backgroundColor: theme.palette.background.paper,
  },
  listItem: {
    width: '100%',
    textAlign: 'center',
  }
});

function ExerciseListTab(props) {
  const { classes,exercises, selectExercise } = props;
  const placeHolderIcon = <i className="material-icons">whatshot</i>
  const deleteIcon = <i className="material-icons">delete</i>
  const editIcon = <i className="material-icons">edit</i>
  
  const exerciseItems = exercises.map((exercise,index) => {
    let duration = 0;
    exercise.defaultSections.forEach(element => {
      duration = duration + Number.parseInt(element.duration);
    });
    const exerciseKey = exercise.name;
    return (
      <ListItem className={classes.listItem} key={exerciseKey} index={index} value={exercise.name} onClick={selectExercise} button>
      <ListItemIcon>
      {placeHolderIcon}
      </ListItemIcon>
      <ListItemText primary={exercise.name} secondary={`kesto: ${duration} min`}/>
      <ListItemSecondaryAction>
      <IconButton>
      {deleteIcon}
      </IconButton>
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
    </List>
    // </div>
  );
}

ExerciseListTab.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ExerciseListTab);