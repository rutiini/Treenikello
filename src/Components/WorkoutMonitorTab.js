import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Stepper, { Step, StepLabel, StepContent } from 'material-ui/Stepper';
import Button from 'material-ui/Button';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';

const styles = theme => ({
  root: {
    // height: '100%',
    overflow: 'auto',
    backgroundColor: theme.palette.background.list,
  },
  button: {
    marginTop: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
  actionsContainer: {
    marginBottom: theme.spacing.unit * 2,
  },
  resetContainer: {
    padding: theme.spacing.unit * 3,
  },
});

class WorkoutMonitorTab extends Component {
  state = {
    activeStep: 0,
  };
  
  handleNext = () => {
    this.setState({
      activeStep: this.state.activeStep + 1,
    });
  };
  
  handleBack = () => {
    this.setState({
      activeStep: this.state.activeStep - 1,
    });
  };
  
  handleReset = () => {
    this.setState({
      activeStep: 0,
    });
  };
  
  render() {
    const { classes, exercise, activeSectionIndex } = this.props;
    const steps = exercise.defaultSections.map(section => section.name);
    const { activeStep } = this.state;
    
    return (
      <div className={classes.root}>
      <Stepper activeStep={activeSectionIndex} orientation="vertical">
      {steps.map((label, index) => {
        return (
          <Step key={label}>
          <StepLabel>{label}</StepLabel>
          <StepContent>
          <Typography>
          {exercise.defaultSections[index].description}
          </Typography>
          <Typography>
          {exercise.defaultSections[index].duration} min
          </Typography>
          <div className={classes.actionsContainer}>
          </div>
          </StepContent>
          </Step>
        );
      })}
      </Stepper>
      {activeStep === steps.length && (
        <Paper square elevation={0} className={classes.resetContainer}>
        <Typography>Treeni suoritettu!</Typography>
        <Button onClick={this.handleReset} className={classes.button}>
        {/* aseta aika tähän hetkeen? */}
        Aloita alusta
        </Button>
        </Paper>
      )}
      </div>
    );
  }
}

WorkoutMonitorTab.propTypes = {
  classes: PropTypes.object,
};

export default withStyles(styles)(WorkoutMonitorTab);
