import {
  createStyles,
  Icon,
  Step,
  StepContent,
  StepLabel,
  Stepper,
  Typography,
  withStyles,
} from '@material-ui/core';
import React, { Component } from 'react';
import { IExercise } from '../../DataInterfaces';

const styles = createStyles({
  root: {
    // height: '100%',
    // backgroundColor: theme.palette.background,
    overflow: 'auto',
  },
  textContainer:{
    height: "calc(100% - 50px)"
  },
  textContent: {
    position: "relative",
    top: "50%",
    transform: "translateY(-50%)"
  },
});

interface IProps {
  classes: any,
  exercise: IExercise,
  activeSectionIndex: number
}

interface IState {
  countDownSeconds: number
}

// amount of minutes in hour, amount of seconds in minute.
const temporalConstant: number = 60;

class WorkoutMonitorTab extends Component<IProps, IState> {
  
  private timer: any;

  constructor(props: IProps) {
    super(props);
    this.state = {
      countDownSeconds: 0
    };
  }


  public componentDidMount(){
    
    this.timer = setInterval(() => {
      const ticks = this.getCountDownTime(this.props.exercise.startTime).getTime();
      this.setState({
        countDownSeconds: ticks
      })
    },1000)
  }

  public componentWillUnmount(){
    clearInterval(this.timer);
  }

  // TODO: rerenders the whole component a lot but not a problem? => change shouldcomponentupdate with the index checking: if <0 then we should rerender but otherwise only when index changes
  public render() {
    const { classes, exercise, activeSectionIndex } = this.props;
    const steps = exercise.defaultSections.map(section => section.name);
    // render different content based on the time
    let tabContent: JSX.Element;
    if (activeSectionIndex < 0) {

      const countDown: string = this.getCountDownTime(exercise.startTime).toLocaleTimeString("fi");

      tabContent = 
      <div className={classes.textContainer}>
        <Typography variant="h2" className={classes.textContent}>{`Treenin alkuun: ${countDown}`}</Typography>
      </div>
    } else if (activeSectionIndex === steps.length) {
      tabContent =
      <div className={classes.textContainer}>
        <Typography variant="h2" className={classes.textContent}>Treeni suoritettu!</Typography>
      </div>
    } else {
      tabContent = <div className={classes.root}>
        <Stepper activeStep={activeSectionIndex} orientation="vertical">
          {steps.map((label, index) => {
            const section = exercise.defaultSections[index];
            let icon;
            if (index < activeSectionIndex) {
              icon = <Icon color="secondary" className="material-icons">done</Icon>
            } else if (index === activeSectionIndex) {
              icon = <Icon color="primary" className="material-icons">timer</Icon>
            } else {
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
            <Typography>Treeni suoritettu!</Typography>
        )}
      </div>
    }

    return (
      // TODO: fix active section calculation and show different content outside of the exercise (before: countdown, after: workout finished message!)
      tabContent
    );
  }

  /**
   * Compares input time agains current moment and outputs the time difference
   * @param startTime comparison time
   */
  private getCountDownTime(startTime: Date) {
    
    // TODO: check the hour calculation bug!
    const ticks: number = this.timeToSeconds(startTime) - this.timeToSeconds(new Date());
    const hours: number = ticks / temporalConstant * temporalConstant;
    const minutes: number = ticks % temporalConstant;
    const seconds: number = ticks - hours * temporalConstant * temporalConstant - minutes * temporalConstant;

    return new Date(0, 0, 0, hours, minutes, seconds);
  }

  /**
   * This function transforms the time component of a date object to seconds,
   * NOTE: ignores the date component!
   * @param time input date object
   */
  private timeToSeconds(time: Date) {
    return time.getHours() * temporalConstant * temporalConstant + time.getMinutes() * temporalConstant + time.getSeconds();
  }

}

export default withStyles(styles)(WorkoutMonitorTab);
