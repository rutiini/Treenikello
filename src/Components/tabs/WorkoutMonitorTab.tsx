import {
  Button,
  createStyles,
  Icon,
  Paper,
  Step,
  // StepButton,
  StepContent,
  // StepIcon,
  StepLabel,
  Stepper,
  Typography,
  withStyles,
} from '@material-ui/core';
import React, { Component } from 'react';
import { IExercise } from '../../DataInterfaces';

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

interface IProps {
  classes: any,
  exercise: IExercise,
  activeSectionIndex: number
}

class WorkoutMonitorTab extends Component<IProps, {}> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      activeStep: 0,
    };
  }

  public render() {
    const { classes, exercise, activeSectionIndex } = this.props;
    const steps = exercise.defaultSections.map(section => section.name);
    
    return (
      <div className={classes.root}>
        <Stepper activeStep={activeSectionIndex} orientation="vertical">
          {steps.map((label, index) => {
            const section = exercise.defaultSections[index];
            console.log(`step status completed: ${index}, ${activeSectionIndex}, ${index < activeSectionIndex}`);
            let icon;
              if(index < activeSectionIndex){
                icon = <Icon color="secondary" className="material-icons">done</Icon> 
              }else if(index === activeSectionIndex){
                icon = <Icon color="primary" className="material-icons">timer</Icon>
              }else{
                icon = <Icon color="action" className="material-icons">fitness_center</Icon>
              }

            return (
              <Step key={label}>
                <StepLabel icon={icon}>
                  {label}
                </StepLabel>
                <StepContent>
                  <Typography>
                    {section.description}
                  </Typography>
                  <Typography>
                    {section.duration} min
          </Typography>
                </StepContent>
              </Step>
            );
          })}
        </Stepper>
        {activeSectionIndex === steps.length && (
          <Paper square={true} elevation={0} className={classes.resetContainer}>
            <Typography>Treeni suoritettu!</Typography>
            <Button onClick={this.handleReset} className={classes.button}>
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
