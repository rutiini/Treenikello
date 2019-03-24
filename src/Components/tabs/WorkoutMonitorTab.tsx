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
import React, { FunctionComponent, useEffect, useState } from 'react';
import { IExercise, ISection } from '../../DataInterfaces';

const styles = createStyles({
  root: {
    overflow: 'auto',
  },
  textContainer: {
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
  activeSection: ISection | null
}

// amount of minutes in hour, amount of seconds in minute.
const temporalConstant: number = 60;

const WorkoutMonitorTab: FunctionComponent<IProps> = (props: IProps) => {

  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
  const [countDown, updateCountDown] = useState<number>(0);
  
  useEffect(() => {
      
    setTimer(setInterval(() => {
        const ticks = getCountDownTime(props.exercise.startTime).getTime();
        updateCountDown(ticks);
      }, 1000));

      return () => clearInterval(timer as NodeJS.Timer);

  },[]);

  // TODO: rerenders the whole component a lot but not a problem? => change shouldcomponentupdate with the index checking: if <0 then we should rerender but otherwise only when index changes
  const { classes, exercise, activeSection } = props;
  const steps = exercise.defaultSections.map(section => section.name);
  // render different content based on the time
  const sectionIndex = activeSection ? exercise.defaultSections.indexOf(activeSection) : -1;
  let tabContent: JSX.Element;
  if (!activeSection) {

    const countDownTime: string = (new Date(countDown)).toLocaleTimeString("fi");

    tabContent =
      <div className={classes.textContainer}>
        <Typography variant="h2" className={classes.textContent}>{`Treenin alkuun: ${countDownTime}`}</Typography>
      </div>
  } else if (sectionIndex === steps.length) {
    tabContent =
      <div className={classes.textContainer}>
        <Typography variant="h2" className={classes.textContent}>Treeni suoritettu!</Typography>
      </div>
  } else {
    tabContent = <div className={classes.root}>
      <Stepper activeStep={sectionIndex} orientation="vertical">
        {steps.map((label, index) => {
          const section = exercise.defaultSections[index];
          let icon;
          if (index < sectionIndex) {
            icon = <Icon color="secondary" className="material-icons">done</Icon>
          } else if (index === sectionIndex) {
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
      {sectionIndex === steps.length && (
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
function getCountDownTime(startTime: Date) {

  // TODO: check the hour calculation bug!
  const ticks: number = timeToSeconds(startTime) - timeToSeconds(new Date());
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
function timeToSeconds(time: Date) {
  return time.getHours() * temporalConstant * temporalConstant + time.getMinutes() * temporalConstant + time.getSeconds();
}

export default withStyles(styles)(WorkoutMonitorTab);
