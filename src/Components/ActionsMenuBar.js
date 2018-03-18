import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import EditSectionForm from './EditSectionForm';
import TimeInput from 'material-ui-time-picker'

const styles = {
  root: {
    flexGrow: 1,
    alignContent: "center",
  },
  flex: {
    flex: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  timeInput: {
    textColor: '#ffffff',
    fontSize: 20,
  },
  button: {
    marginRight: 10,
  }
};

function ActionsMenuBar(props) {
  const { classes, exercises, selectedExerciseIndex, setTime } = props;
  // const menuIcon = <i className="material-icons">menu</i>;
  
  return (
    <div className={classes.root}>
    <AppBar position="static">
    <Toolbar>
  <div>
  <i className="material-icons">access_time</i>
  <TimeInput color="inherit" id="TimeInput" mode="24h" value={exercises[selectedExerciseIndex].startTime} onChange={setTime} className={classes.flex}/>
  <Button variant="fab" mini color="inherit" onClick={() => setTime(new Date())}><i className="material-icons">update</i></Button>
  </div>
  <Typography variant="title" color="inherit" className={classes.flex}>
  {props.title}
  </Typography>
  {/* <Button variant="fab" mini color="inherit"><i className="material-icons">delete</i></Button> */}
  <EditSectionForm exercise={exercises[selectedExerciseIndex]} edit={true}/>
  </Toolbar>
  </AppBar>
  </div>
);
}

ActionsMenuBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ActionsMenuBar);
