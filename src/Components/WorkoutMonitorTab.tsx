import {
  Button,
  createStyles,
  Paper,
  Step,
  StepContent,
  StepLabel,
  Stepper,
  Typography,
  withStyles
} from '@material-ui/core';
import React, { Component } from 'react';
import { IExercise } from '../DataInterfaces';

const styles = createStyles({
  actionsContainer: {
    // marginBottom: theme.spacing.unit * 2,
  },
  button: {
    // marginRight: theme.spacing.unit,
  },
  // marginTop: theme.spacing.unit,
  resetContainer: {
    // padding: theme.spacing.unit * 3,
  },
  root: {
    // height: '100%',
    // backgroundColor: theme.palette.background,
    overflow: 'auto',
  },
});

interface IProps{
  classes: any,
  exercise: IExercise,
  activeSectionIndex: number
}
interface IState{
  activeStep: number // TODO: this is probably not necessary. -> consider pure component
}

class WorkoutMonitorTab extends Component<IProps, IState> {
  constructor(props: IProps){
    super(props);
    this.state = {
      activeStep: 0,
    };
  }

  public render() {
    const { classes, exercise, activeSectionIndex } = this.props;
    const steps = exercise.defaultSections.map(section => section.name);
    
    const {activeStep} = this.state;

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
                </StepContent>
              </Step>
            );
          })}
        </Stepper>
        {activeStep === steps.length && (
          <Paper square={true} elevation={0} className={classes.resetContainer}>
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

  private handleReset = () => {
    this.setState({
      activeStep: 0,
    });
  };

}

export default withStyles(styles)(WorkoutMonitorTab);
