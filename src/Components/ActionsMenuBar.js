import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import EditSectionForm from './EditSectionForm';

const styles = theme => ({
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
});

export default withStyles(styles)(class ActionsMenuBar extends Component {
  state = {
    open: false
  }

  handleToggle = () => {
    this.setState({
      open: !this.state.open
    })
  }


  render() {
    const { classes, exercises, selectedExerciseIndex, setTime, title, handleSubmit, saveExercises } = this.props;
    const { open } = this.state;

    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
          <Button variant="fab" mini color="inherit" onClick={saveExercises}><i className="material-icons">save</i></Button>
            <Typography variant="title" color="inherit" className={classes.flex}>
              {title}
            </Typography>
            <Button variant="fab" mini color="inherit" onClick={() => setTime(new Date())}><i className="material-icons">play_circle_outline</i></Button>
            <EditSectionForm exercise={exercises[selectedExerciseIndex]} open={open} handleToggle={this.handleToggle} handleSubmit={handleSubmit} />
          </Toolbar>
        </AppBar>
      </div>
    );
  }
});

this.propTypes = {
  classes: PropTypes.object.isRequired,
};
