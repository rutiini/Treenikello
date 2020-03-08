import { createStyles, Icon, Step, StepContent, StepLabel, Stepper, Typography, withStyles } from "@material-ui/core";
import React, { FunctionComponent, useState, useContext } from "react";
import { IExercise, ISection } from "../../DataInterfaces";
import { useInterval, GetActiveSectionIndex } from "../Utils/ClockUtilities";
import ExerciseContext from "../AppReducer/ExerciseContext";
import { ActionType } from "../AppReducer/ExerciseReducer";
import { getExerciseDuration } from "../Utils";

const styles = createStyles({
    root: {
        overflow: "auto"
    },
    textContainer: {
        height: "calc(100% - 50px)"
    },
    textContent: {
        position: "relative",
        top: "50%",
        transform: "translateY(-50%)"
    }
});

interface IProps {
    classes: any;
    exercise: IExercise;
    activeSection: ISection | null;
}

// amount of minutes in hour, amount of seconds in minute.
const temporalConstant: number = 60;

/**
 * TODO: refactor this component..
 */
const WorkoutMonitorTab: FunctionComponent<IProps> = (props: IProps) => {
    const { classes, exercise, activeSection } = props;
    const [, dispatch] = useContext(ExerciseContext);

    const [time, setTime] = useState<Date>(new Date());

    const updateActiveSection = React.useCallback(() => {
        const currentIndex = GetActiveSectionIndex(exercise, time);
        const currentSection =
            currentIndex >= 0 && currentIndex < exercise.defaultSections.length
                ? exercise.defaultSections[currentIndex]
                : null;
        if (activeSection !== currentSection) {
            dispatch({ type: ActionType.UpdateActiveSection, payload: time });
        }
    }, [GetActiveSectionIndex, activeSection, exercise]);

    useInterval(() => {
        setTime(new Date());
        updateActiveSection();
    }, 1000);

    const steps = React.useMemo(() => exercise.defaultSections.map(section => section.name), [exercise]);
    // render different content based on the time
    const sectionIndex = activeSection ? exercise.defaultSections.indexOf(activeSection) : -1;

    // let tabContent: JSX.Element;
    if (!activeSection) {
        const ticks: number = timeToSeconds(exercise.startTime) - timeToSeconds(time);
        const hours: number = (ticks / temporalConstant) * temporalConstant;
        const minutes: number = ticks % temporalConstant;
        const seconds: number = ticks - hours * temporalConstant * temporalConstant - minutes * temporalConstant;

        const countDownTime: string = new Date(0, 0, 0, hours, minutes, seconds).toLocaleTimeString("fi");

        return (
            <div className={classes.textContainer}>
                <Typography
                    variant="h2"
                    className={classes.textContent}
                >{`Treenin alkuun: ${countDownTime}`}</Typography>
            </div>
        );
    } else if (checkExerciseEnded(exercise, new Date())) {
        return (
            <div className={classes.textContainer}>
                <Typography variant="h2" className={classes.textContent}>
                    Treeni suoritettu!
                </Typography>
            </div>
        );
    } else {
        return (
            <div className={classes.root}>
                <Stepper activeStep={sectionIndex} orientation="vertical">
                    {steps.map((label, index) => {
                        const section = exercise.defaultSections[index];
                        let icon;
                        if (index < sectionIndex) {
                            icon = (
                                <Icon color="secondary" className="material-icons">
                                    done
                                </Icon>
                            );
                        } else if (index === sectionIndex) {
                            icon = (
                                <Icon color="primary" className="material-icons">
                                    timer
                                </Icon>
                            );
                        } else {
                            icon = (
                                <Icon color="action" className="material-icons">
                                    fitness_center
                                </Icon>
                            );
                        }

                        return (
                            <Step key={label}>
                                <StepLabel icon={icon}>{label}</StepLabel>
                                <StepContent>
                                    <Typography>{section.description}</Typography>
                                    <Typography>{section.duration} min</Typography>
                                </StepContent>
                            </Step>
                        );
                    })}
                </Stepper>
                {sectionIndex === steps.length && <Typography>Treeni suoritettu!</Typography>}
            </div>
        );
    }
};

/**
 * This function transforms the time component of a date object to seconds,
 * NOTE: ignores the date component!
 * @param time input date object
 */
function timeToSeconds(time: Date) {
    return (
        time.getHours() * temporalConstant * temporalConstant + time.getMinutes() * temporalConstant + time.getSeconds()
    );
}

function checkExerciseEnded(exercise: IExercise, comparedTime: Date): boolean {
    const duration = getExerciseDuration(exercise);
    const startTime = new Date();
    startTime.setFullYear(comparedTime.getFullYear());
    startTime.setMonth(comparedTime.getMonth());
    startTime.setDate(comparedTime.getDate());
    startTime.setHours(exercise.startTime.getHours());
    startTime.setMinutes(exercise.startTime.getMinutes());
    
    const exerciseEnd: number = startTime.getTime() + duration * 60000; // minutes to ticks
    console.debug(
        "ex start: ",
        startTime,
        "ex end: ",
        new Date(exerciseEnd),
        "current: ",
        comparedTime
    );

    return exerciseEnd < comparedTime.getTime();
}

export default withStyles(styles)(WorkoutMonitorTab);
