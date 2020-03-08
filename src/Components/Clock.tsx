import { createStyles, Theme, WithStyles, withStyles } from "@material-ui/core";
import React, { FunctionComponent, useContext, useEffect, useState } from "react";
import { IExercise, ISection } from "../DataInterfaces";
import ExerciseContext from "./AppReducer/ExerciseContext";
import ClockFace from "./ClockFace";
import SectionItem from "./SectionItem";
import {
    CircleInDegrees,
    ClockData,
    CycleTimerMode,
    MinuteInDegrees,
    TimeToDegrees,
    useInterval
} from "./Utils/ClockUtilities";

interface IProps extends WithStyles<typeof styles> {
    canvasSide: number;
}

export enum TimerMode {
    Hidden,
    Ready,
    Running,
    Finished
}

const styles = (theme: Theme) =>
    createStyles({
        activeSection: {
            opacity: 1
        },
        clockContainer: {
            height: "45vh",
            [theme.breakpoints.between("md", "xl")]: {
                float: "left",
                height: "99vh",
                width: "49vw"
            }
        },
        inactiveSection: {
            opacity: 0.65
        }
    });

const centerCoordinate = 100 / 2;

/**
 * Clock component renders the clock face and arms, it uses ExerciseContext to
 * read and render exercise sections on the clock face.
 */
const Clock: FunctionComponent<IProps> = (props: IProps) => {
    const [stopWatchSeconds, setStopWatchSeconds] = useState(0);
    const [timerMode, setTimerMode] = useState(TimerMode.Hidden);
    const [stopWatch, setStopWatch] = useState<NodeJS.Timeout | null>(null);
    const [time, setTime] = useState(new Date());

    useInterval(() => setTime(new Date()), 1000);

    // use the context to get the shared state and dispatch instace
    const [state] = useContext(ExerciseContext); // state gets reassigned this way. -> Do we need context to actually share the state?

    // stopwatch should react to the timermode
    useEffect(() => {
        if (timerMode === TimerMode.Running && stopWatchSeconds === 0) {
            setStopWatch(setInterval(updateStopwatch, 500));
        } else if (timerMode === TimerMode.Finished) {
            if (stopWatch) {
                clearInterval(stopWatch as NodeJS.Timeout);
            }
        } else if (timerMode === TimerMode.Hidden) {
            setStopWatchSeconds(0);
        }
    }, [timerMode, stopWatchSeconds]);

    /**
     * Increases the stopWatchSeconds in state by one.
     */
    const updateStopwatch = React.useCallback(() => {
        setStopWatchSeconds(seconds => seconds + 1);
    }, [setStopWatch]);

    /** cycle on tap -> make visible -> start -> stop -> hide and reset */
    const cycleTimerFunctions = React.useCallback(() => {
        // case hidden set to visible and reset position to 0
        const newMode = CycleTimerMode(timerMode);
        setTimerMode(newMode);
    }, [setTimerMode, timerMode, CycleTimerMode]);

    const sectionItems: ReadonlyArray<JSX.Element> = React.useMemo(
        () => updateFaceElements(state.activeExercise, state.activeSection, props.classes),
        [state.activeExercise, state.activeSection, props.classes]
    );
    const { classes } = props;
    const clockData = new ClockData(time);

    return (
        <div className={classes.clockContainer} onClick={cycleTimerFunctions}>
            <ClockFace
                clockData={clockData}
                centerCoordinate={centerCoordinate}
                sectionItems={sectionItems}
                stopWatchRotation={stopWatchSeconds}
                timerMode={timerMode}
            />
        </div>
    );
};

/**
 * Updates sections on the face.
 * @returns {ISection} updated sections.
 */
function updateFaceElements(
    selectedExercise: IExercise,
    activeSection: ISection | null,
    classes: Record<"activeSection" | "inactiveSection", string>
): ReadonlyArray<JSX.Element> {
    // TODO: handle midnight problem?
    // in order to enable full lenght that exceeds hour we need to track the hour as well.
    // const { selectedExercise, activeSection } = this.context.state;
    const { startTime, defaultSections } = selectedExercise;

    const currentTime = new Date();
    const sectionItems: JSX.Element[] = [];

    // change to absolute
    const currentPosition = TimeToDegrees(currentTime); // "absolute minute position
    const startPosition = TimeToDegrees(startTime);
    let stopDrawAngle = CircleInDegrees; // opacity of sections is a good way of communication where we start and are..

    if (defaultSections) {
        // calculate from start time
        let cumulativeAngle = startPosition;
        defaultSections.map((sectionItem: ISection) => {
            const setupStartAngle = cumulativeAngle;
            const setupStopAngle = cumulativeAngle + sectionItem.setupTime * MinuteInDegrees;

            const sectionStartAngle = setupStopAngle; // + sectionItem.setupTime * MinuteInDegrees; // !added setup
            cumulativeAngle += (sectionItem.duration + sectionItem.setupTime) * MinuteInDegrees; // transform minutes to degrees

            // if the section ends before starting angle dont draw it. Also if start is over an hour away
            if (cumulativeAngle <= currentPosition || currentPosition < cumulativeAngle - CircleInDegrees) {
                // "extend" last visible section by new minutes
                // TODO: current position is probably not the correct variable here since it can be in the middle of a section..
                stopDrawAngle = stopDrawAngle + currentPosition;
            } else {
                if (cumulativeAngle > stopDrawAngle + startPosition) {
                    cumulativeAngle = stopDrawAngle + startPosition;
                }

                // setup arc
                sectionItems.push(
                    <SectionItem
                        cx={centerCoordinate}
                        cy={centerCoordinate}
                        radius={44.1} // TODO: get rid of magic number
                        startAngle={setupStartAngle}
                        endAngle={setupStopAngle}
                        thickness={2}
                        key={sectionItems.length}
                        color={"#d3d0da"}
                        className={sectionItem === activeSection ? classes.activeSection : classes.inactiveSection}
                    />
                );
                // section arc
                sectionItems.push(
                    <SectionItem
                        cx={centerCoordinate}
                        cy={centerCoordinate}
                        radius={44.1} // TODO: get rid of magic number
                        startAngle={sectionStartAngle}
                        endAngle={cumulativeAngle}
                        thickness={3}
                        key={sectionItems.length}
                        color={sectionItem.color}
                        className={sectionItem === activeSection ? classes.activeSection : classes.inactiveSection}
                    />
                );
                // just check whether there is an active item set.
            }
        });
    }
    return sectionItems;
}

export default withStyles(styles)(Clock);
