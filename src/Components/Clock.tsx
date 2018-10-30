import { createStyles, Theme, WithStyles, withStyles } from '@material-ui/core';
import React, { Component } from 'react';
import { IExerciseContext } from '../DataInterfaces';
import { withExerciseContext } from '../ExerciseContext';
import SectionItem from './SectionItem';
import StopWatchHand from './StopWatchHand';
import ClockUtilities from './Utils/ClockUtilities';

interface IProps extends WithStyles<typeof styles> {
    exerciseContext: IExerciseContext,
    canvasSide: number
}

interface IState {
    date: string,
    secPosition: number,
    minPosition: number,
    hourPosition: number,
    timerEnabled: boolean,
    stopWatchSeconds: number
}

const styles = (theme: Theme) => createStyles({
    activeSection: {
        opacity: 1
    },
    bigHourMarker: {
        stroke: theme.palette.action.active,
        strokeWidth: 2
    },
    clock: {
        height: "45vh",
        [theme.breakpoints.between("md", "xl")]: {
            height: "99vh",
            width: "49vw",
        }
    },
    clockContainer: {
        height: "45vh",
        [theme.breakpoints.between("md", "xl")]: {
            float: 'left',
            height: "99vh",
            width: "49vw",
        }
    },
    face: {
        fill: '#000000',
        stroke: '#bebebe', // colorings in to the theme?
        strokeWidth: 2,
    },
    faceCover: {
        fill: '#000000',
        // stroke: '#bebebe', // colorings in to the theme?
        // strokeWidth: 2,
    },
    hourMarker: {
        stroke: theme.palette.action.active,
        strokeWidth: 1
    },
    hourMin: {
        fill: theme.palette.secondary.main,
        stroke: theme.palette.action.active,
        strokeWidth: 1,
    },
    inactiveSection: {
        opacity: 0.65
    },
    midPoint: {
        fill: theme.palette.action.active,
    },
    minor: {
        fill: '#3f3f3f',
    },
    minuteMarker: {
        stroke: theme.palette.action.active,
        strokeWidth: 1,
    },
    sec: {
        stroke: theme.palette.action.active,
    }
})


/**
 * Clock component renders the clock face and arms, it uses ExerciseContext to 
 * read and render exercise sections on the clock face.
 */
class Clock extends Component<IProps, IState> {

    // basic parameters for drawing
    private canvasSide: number = 100;
    private centerCoordinate = 100 / 2;
    private faceRadius = 100 / 2 - (100 / 20);

    private timerStarted = false;
    private timerFinished = false;

    private stopwatchInterval: any;
    // private interval: any;
    private sectionItems: JSX.Element[];

    // draw hours and minutes to the clock face
    private Majors: JSX.Element[] = [];

    constructor(props: IProps) {
        super(props);

        // custom canvasside given.
        if (this.props.canvasSide) {

            this.canvasSide = this.props.canvasSide;
            this.centerCoordinate = this.canvasSide / 2;
            this.faceRadius = this.canvasSide / 2 - (this.canvasSide / 20)
        }
        const majors = [];
        const { classes } = this.props;

        for (let i = 0; i < 60; i++) {
            // the "big hours"
            if (i % 15 === 0) {
                majors.push(this.createMarker(i, 5, classes.bigHourMarker))
            }
            // lesser markers
            else if (i % 5 === 0) {
                majors.push(this.createMarker(i, 5, classes.hourMarker))
            }
            // minutes
            else {
                majors.push(this.createMarker(i, 3, classes.minuteMarker))
            }
        }
        this.Majors = majors;

        // put the hands in correct time for initial render
        const d = new Date()
        const secRotation = ClockUtilities.minuteInDegrees * d.getSeconds();
        const minRotation = ClockUtilities.minuteInDegrees * d.getMinutes();
        const hourRotation = 30 * (d.getHours() % 12) + d.getMinutes() / 2;

        this.state =
            {
                date: d.toLocaleString("fi"),
                hourPosition: hourRotation,
                minPosition: minRotation,
                secPosition: secRotation,
                stopWatchSeconds: 0,
                timerEnabled: false,
            }

        // bindings
        this.cycleTimerFunctions = this.cycleTimerFunctions.bind(this);
    }
    // get stuff from sub function


    /**
     * Creates minute and hour markers on the clock face
     */
    public createMarker = (position: number, length: number, className: string) => {

        // lets not render too many objects here
        if (position >= 60) {
            throw new DOMException("too many minutemarkers for this clock");
        }
        const idTag = "marker" + position;
        const y1 = this.canvasSide / 2 - this.faceRadius + length;
        const y2 = this.canvasSide / 2 - this.faceRadius + 0.9; // slight overlap (0.1) and stroke width..
        const centerCoordinate = this.canvasSide / 2;
        const rotation = 'rotate(' + position * 6 + ' 50 50)';
        return (<line key={idTag} id={idTag} className={className} x1={centerCoordinate} y1={y1} x2={centerCoordinate} y2={y2} transform={rotation} />)
    }

    /**
     * Enable timer hand of clock
     */
    public enableTimerHand = () => {
        this.setState({ timerEnabled: true })
    }

    public render() {
        this.sectionItems = this.updateFaceElements();
        const { classes } = this.props;
        return (
            <div className={classes.clockContainer} onClick={this.cycleTimerFunctions}>
                <svg id="clock" className={classes.clock} viewBox="0 0 100 100">
                    {/* TODO: remove a bunch of magic numbers, make stuff rescalable. */}
                    <circle
                        className={classes.face}
                        cx={this.centerCoordinate}
                        cy={this.centerCoordinate}
                        r="45" />
                    {this.sectionItems}
                    <circle
                        className={classes.faceCover}
                        cx={this.centerCoordinate}
                        cy={this.centerCoordinate}
                        r="41" />
                    <g id="minuteMarkers">
                        {this.Majors}
                    </g>
                    <g id="hands">
                        <rect
                            transform={`rotate(${this.state.hourPosition} ${this.centerCoordinate} ${this.centerCoordinate})`}
                            id="hour"
                            className={classes.hourMin}
                            x="48.5"
                            y="22.5"
                            width="3"
                            height="30"
                            rx="2.5"
                            ry="2.55"
                            fill="red" />
                        <rect
                            transform={`rotate(${this.state.minPosition} ${this.centerCoordinate} ${this.centerCoordinate})`}
                            id="min"
                            className={classes.hourMin}
                            x="49"
                            y="12.5"
                            width="2"
                            height="40"
                            rx="2"
                            ry="2"
                            fill="blue" />
                        <StopWatchHand
                            x1={this.centerCoordinate}
                            y1={this.centerCoordinate}
                            x2={this.centerCoordinate}
                            y2={14}
                            y3={12}
                            rotation={this.state.stopWatchSeconds * 3}
                            visible={this.state.timerEnabled}
                            color="yellow"
                            tipColor="red" />
                        <g
                            transform={`rotate(${this.state.secPosition} ${this.centerCoordinate} ${this.centerCoordinate})`}
                            id="secHand">
                            <line
                                id="sec"
                                x1={this.centerCoordinate}
                                y1={this.centerCoordinate}
                                x2={this.centerCoordinate}
                                y2="11"
                                stroke="white" />
                        </g>;
                    </g>
                    <circle
                        className={classes.midPoint}
                        cx={this.centerCoordinate}
                        cy={this.centerCoordinate}
                        r="3" />
                </svg>
            </div>
        )
    }

    public componentDidMount() {

        setInterval(() => {
            const currentTime = new Date()
            this.checkActiveSection(currentTime);
            const secRotation = 6 * currentTime.getSeconds();
            const minRotation = 6 * currentTime.getMinutes();
            const hourRotation = 30 * (currentTime.getHours() % 12) + currentTime.getMinutes() / 2
            this.setState(
                {
                    date: currentTime.toLocaleString("fi"),
                    hourPosition: hourRotation,
                    minPosition: minRotation,
                    secPosition: secRotation
                }
            )
        }, 1000)

    }

    /**
     * calculate the active section index and update index if it has changed.
     * @param currentTime date to compare to the exercise timings
     */
    private checkActiveSection(currentTime: Date) {
        const { exercises, selectedExerciseIndex, setActiveSection, activeSectionIndex } = this.props.exerciseContext;
        const activeIndex = ClockUtilities.getActiveSectionIndex(exercises[selectedExerciseIndex], currentTime);
        // console.log(`active: ${activeIndex}`);
        if (activeSectionIndex !== activeIndex) {
            setActiveSection(activeIndex);
        }
    }

    /**
     * Disable timer hand of clock
     */
    private disableTimerHand = () => {
        // have all the hands as private props.
        const hand: HTMLElement = document.getElementById("timerHand") as HTMLElement;

        this.setState({
            stopWatchSeconds: 0
        })

        hand.setAttribute("visibility", "hidden")
        if (hand.classList.contains("timerOn")) {
            hand.classList.remove("timerOn")
        }
        if (!hand.classList.contains("timerOff")) {
            hand.classList.add("timerOff")
        }

        this.setState({ timerEnabled: true })
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

    // TODO: refactor to use int or enum for cycling the state..
    // cycle on tap -> make visible -> start -> stop -> hide and reset
    private cycleTimerFunctions = () => {
        // case hidden set to visible and reset position to 0
        if (!this.state.timerEnabled && !this.timerFinished) {
            this.enableTimerHand();
            this.setState({ timerEnabled: true })
        }
        // case visible and stopped start timer
        else if (this.state.timerEnabled && !this.timerStarted && !this.timerFinished) {
            this.stopwatchInterval = setInterval(this.updateStopwatch, 500);
            this.timerStarted = true;
        }
        // case visible and stated stop timer
        else if (this.state.timerEnabled && this.timerStarted) {
            // stopTimer
            clearInterval(this.stopwatchInterval);
            this.timerFinished = true;
            this.timerStarted = false;
        }
        // case visible and stopped (and used) set to hidden
        else {
            this.disableTimerHand();
            this.timerStarted = false;
            this.timerFinished = false;
            this.setState({ timerEnabled: false })
        }
    }

    /**
     * Updates sections on the face.
     * @returns {ISection} updated sections.
     */
    private updateFaceElements() {
        // TODO: handle midnight problem?
        // in order to enable full lenght that exceeds hour we need to track the hour as well.
        const { exercises, selectedExerciseIndex, activeSectionIndex } = this.props.exerciseContext;
        const { startTime, defaultSections } = exercises[selectedExerciseIndex];

        const currentTime = new Date();
        const sectionItems: JSX.Element[] = [];

        // change to absolute
        const currentPosition = ClockUtilities.timeToDegrees(currentTime); // "absolute minute positio
        const startPosition = ClockUtilities.timeToDegrees(startTime);
        let stopDrawAngle = ClockUtilities.circleInDegrees; // opacity of sections is a good way of communication where we start and are..

        if (defaultSections) {

            // calculate from start time
            const { classes } = this.props;
            let cumulativeAngle = startPosition;
            defaultSections.map((sectionItem, index) => {
                
                const setupStartAngle = cumulativeAngle;
                const setupStopAngle = cumulativeAngle + sectionItem.setupTime * ClockUtilities.minuteInDegrees;

                const sectionStartAngle = setupStopAngle // + sectionItem.setupTime * ClockUtilities.minuteInDegrees; // !added setup
                cumulativeAngle += (sectionItem.duration + sectionItem.setupTime)* ClockUtilities.minuteInDegrees; // transform minutes to degrees

                // if the section ends before starting angle dont draw it. Also if start is over an hour away
                if (cumulativeAngle <= currentPosition || currentPosition < cumulativeAngle - ClockUtilities.circleInDegrees) {
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
                            index === activeSectionIndex 
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
                            index === activeSectionIndex 
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

export default withExerciseContext(withStyles(styles)(Clock));