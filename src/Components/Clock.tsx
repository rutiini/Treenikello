import { createStyles, Theme, WithStyles, withStyles } from '@material-ui/core';
import React, { Component, Context, ContextType } from 'react';
import { ISection } from '../DataInterfaces'
import { AppContext, IAppContext } from './AppContext';
import ClockFace from './ClockFace';
import SectionItem from './SectionItem';
import { CircleInDegrees, ClockData, CycleTimerMode, GetActiveSectionIndex, MinuteInDegrees, TimeToDegrees } from './Utils/ClockUtilities';

interface IProps extends WithStyles<typeof styles> {
    canvasSide: number
}

interface IState {
    clockData: ClockData,
    timerMode: TimerMode,
    stopWatchSeconds: number
}

export enum TimerMode {
    Hidden,
    Ready,
    Running,
    Finished
}

const styles = (theme: Theme) => createStyles({
    activeSection: {
        opacity: 1
    },
    clockContainer: {
        height: "45vh",
        [theme.breakpoints.between("md", "xl")]: {
            float: 'left',
            height: "99vh",
            width: "49vw",
        }
    },
    inactiveSection: {
        opacity: 0.65
    }
})


/**
 * Clock component renders the clock face and arms, it uses ExerciseContext to 
 * read and render exercise sections on the clock face.
 */
class Clock extends Component<IProps, IState> {

    public static contextType: Context<IAppContext> = AppContext;
    public context!: ContextType<typeof AppContext>;
    // basic parameters for drawing
    private canvasSide: number = 100;
    private centerCoordinate = 100 / 2;

    private stopwatchInterval: NodeJS.Timeout;
    // private interval: any;
    private sectionItems: JSX.Element[];

    constructor(props: IProps) {
        super(props);

        // custom canvasside given.
        if (this.props.canvasSide) {

            this.canvasSide = this.props.canvasSide;
            this.centerCoordinate = this.canvasSide / 2;
        }

        // put the hands in correct time for initial render
        const clockData = new ClockData(new Date());

        this.state =
            {
                clockData,
                stopWatchSeconds: 0,
                timerMode: TimerMode.Hidden
            }
    }

    public render() {
        this.sectionItems = this.updateFaceElements();
        const { classes } = this.props;
        const { clockData, stopWatchSeconds, timerMode } = this.state;
        return (
            <div className={classes.clockContainer} onClick={this.cycleTimerFunctions}>
                <ClockFace clockData={clockData}
                    centerCoordinate={this.centerCoordinate}
                    sectionItems={this.sectionItems}
                    stopWatchRotation={stopWatchSeconds}
                    timerMode={timerMode} />
            </div>
        )
    }

    public componentDidMount() {

        setInterval(() => {
            const currentTime = new Date()
            this.checkActiveSection(currentTime);
            const clockData = new ClockData(currentTime);
            this.setState(
                {
                    ...this.state,
                    clockData
                }
            )
        }, 1000)

    }

    /**
     * calculate the active section index and update index if it has changed.
     * @param currentTime date to compare to the exercise timings
     */
    private checkActiveSection(currentTime: Date) {
        const { selectedExercise, activeSection } = this.context.state;
        const activeIndex = GetActiveSectionIndex(selectedExercise, currentTime);
        const activeSectionIndex = activeSection ? selectedExercise.defaultSections.indexOf(activeSection) : -1;
        if (activeSectionIndex !== activeIndex) {
            this.context.dispatch.setActiveSection(selectedExercise.defaultSections[activeIndex]);
        }
    }

    /**
     * Increases the stopWatchSeconds in state by one.
     */
    private updateStopwatch = () => {
        const nextStep = this.state.stopWatchSeconds + 1;
        this.setState({
            stopWatchSeconds: nextStep
        })
    }

    /** cycle on tap -> make visible -> start -> stop -> hide and reset */
    private cycleTimerFunctions = () => {
        // case hidden set to visible and reset position to 0

        const newMode = CycleTimerMode(this.state.timerMode);
        this.setState({ timerMode: newMode });

        if (newMode === TimerMode.Running) {
            this.stopwatchInterval = setInterval(this.updateStopwatch, 500)
        }
        // case visible and stated stop timer
        else if (newMode === TimerMode.Finished) {
            // stopTimer
            clearInterval(this.stopwatchInterval);
        } else if (newMode === TimerMode.Hidden) {
            // reset time
            this.setState({ stopWatchSeconds: 0 });
        }
    }

    /**
     * Updates sections on the face.
     * @returns {ISection} updated sections.
     */
    private updateFaceElements() {
        // TODO: handle midnight problem?
        // in order to enable full lenght that exceeds hour we need to track the hour as well.
        const { selectedExercise, activeSection } = this.context.state;
        const { startTime, defaultSections } = selectedExercise;

        const currentTime = new Date();
        const sectionItems: JSX.Element[] = [];

        // change to absolute
        const currentPosition = TimeToDegrees(currentTime); // "absolute minute positio
        const startPosition = TimeToDegrees(startTime);
        let stopDrawAngle = CircleInDegrees; // opacity of sections is a good way of communication where we start and are..

        if (defaultSections) {

            // calculate from start time
            const { classes } = this.props;
            let cumulativeAngle = startPosition;
            defaultSections.map((sectionItem: ISection, index: number) => {

                const setupStartAngle = cumulativeAngle;
                const setupStopAngle = cumulativeAngle + sectionItem.setupTime * MinuteInDegrees;

                const sectionStartAngle = setupStopAngle // + sectionItem.setupTime * MinuteInDegrees; // !added setup
                cumulativeAngle += (sectionItem.duration + sectionItem.setupTime) * MinuteInDegrees; // transform minutes to degrees

                // if the section ends before starting angle dont draw it. Also if start is over an hour away
                if (cumulativeAngle <= currentPosition || currentPosition < cumulativeAngle - CircleInDegrees) {
                    // "extend" last visible section by new minutes
                    // TODO: current position is probably not the correct variable here since it can be in the middle of a section..
                    stopDrawAngle = stopDrawAngle + currentPosition;
                }
                else {
                    if (cumulativeAngle > stopDrawAngle + startPosition) {
                        cumulativeAngle = stopDrawAngle + startPosition;
                    }

                    // setup arc
                    sectionItems.push(<SectionItem
                        cx={this.centerCoordinate}
                        cy={this.centerCoordinate}
                        radius={44.1} // TODO: get rid of magic number
                        startAngle={setupStartAngle}
                        endAngle={setupStopAngle}
                        thickness={2}
                        key={sectionItems.length}
                        color={"#d3d0da"}
                        class={
                            sectionItem === activeSection
                                ? classes.activeSection
                                : classes.inactiveSection
                        } />)
                    // section arc
                    sectionItems.push(<SectionItem
                        cx={this.centerCoordinate}
                        cy={this.centerCoordinate}
                        radius={44.1} // TODO: get rid of magic number
                        startAngle={sectionStartAngle}
                        endAngle={cumulativeAngle}
                        thickness={3}
                        key={sectionItems.length}
                        color={sectionItem.color}
                        class={
                            sectionItem === activeSection
                                ? classes.activeSection
                                : classes.inactiveSection
                        } />)
                    // just check whether there is an active item set.
                }
            });
        }
        return sectionItems;
    }
}

export default withStyles(styles)(Clock);