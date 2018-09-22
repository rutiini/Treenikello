import { createStyles, Theme, WithStyles, withStyles } from '@material-ui/core';
import React, { Component } from 'react';
import { IExerciseContext } from '../DataInterfaces';
import { withExerciseContext } from '../ExerciseContext';
import SectionItem from './SectionItem';
import StopWatchHand from './StopWatchHand';

interface IProps extends WithStyles<typeof styles> {
    exerciseContext: IExerciseContext,
    canvasSide: number
}

interface IState {
    activeSectionIndex: number,
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
    clock:{
        height: "45vh",
        [theme.breakpoints.between("md","xl")]: {
            height: "99vh",
            width:"49vw",
          }
    },
    clockContainer:{
        height: "45vh",
        [theme.breakpoints.between("md","xl")]: {
            float: 'left',
            height: "99vh",
            width:"49vw",
          }
    },
    face: {
        fill: '#000000',
        stroke: '#bebebe', // colorings in to the theme?
        strokeWidth: 2,
    },
    hourMarker: {
        stroke: theme.palette.action.active,
        strokeWidth: 1
    },
    hourMin: {
        fill: theme.palette.action.hover,
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
    // private initialRotation: number = 0; // TODO: check whether this needs an actual value

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
        const secRotation = 6 * d.getSeconds();
        const minRotation = 6 * d.getMinutes();
        const hourRotation = 30 * (d.getHours() % 12) + d.getMinutes() / 2;

        this.state =
            {
                activeSectionIndex: -1,
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

    public updateTime = () => {
        const d = new Date()

        this.setState(
            {
                date: d.toLocaleString("fi"),
                hourPosition: 30 * (d.getHours() % 12) + d.getMinutes() / 2,
                minPosition: 6 * d.getMinutes(),
                secPosition: 6 * d.getSeconds(),
            }
        )
    }


    
    /**
     * Enable timer hand of clock
     */
    public enableTimerHand = () => {
        this.setState({ timerEnabled: true })
    }

    public render() {
        this.sectionItems = this.updateFaceElements();
        console.log('rendered clock')
        const { classes } = this.props;
        return (
            <div className={classes.clockContainer} onClick={this.cycleTimerFunctions}>

                <svg id="clock" className={classes.clock} viewBox="0 0 100 100">
                    <circle className={classes.face} cx="50" cy="50" r="45" />
                    {this.sectionItems}
                    <g id="minuteMarkers">
                        {this.Majors}
                    </g>
                    <g id="hands">
                        <rect transform={`rotate(${this.state.hourPosition} 50 50)`} id="hour" className={classes.hourMin} x="48.5" y="22.5" width="3" height="30" rx="2.5" ry="2.55" fill="red" />
                        <rect transform={`rotate(${this.state.minPosition} 50 50)`} id="min" className={classes.hourMin} x="49" y="12.5" width="2" height="40" rx="2" ry="2" fill="blue" />
                        <StopWatchHand x1={50} y1={50} x2={50} y2={14} y3={12} rotation={this.state.stopWatchSeconds * 3} visible={this.state.timerEnabled} color="yellow" tipColor="red" />
                        <g transform={`rotate(${this.state.secPosition} 50 50)`} id="secHand">
                            <line id="sec" x1="50" y1="50" x2="50" y2="11" stroke="white" />
                        </g>;
                    </g>
                    <circle className={classes.midPoint} cx="50" cy="50" r="3" />
                </svg>
            </div>
        )
    }

    public componentDidMount() {

        setInterval(() => {
            const d = new Date()
            const secRotation = 6 * d.getSeconds();
            const minRotation = 6 * d.getMinutes();
            const hourRotation = 30 * (d.getHours() % 12) + d.getMinutes() / 2;

            this.setState(
                {
                    date: d.toLocaleString("fi"),
                    hourPosition: hourRotation,
                    minPosition: minRotation,
                    secPosition: secRotation
                }
            )
        }, 1000)

    }

    // TODO: refactor, context can be taken directly from props.
    private ctxt = () => this.props.exerciseContext;


    
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
    // fix this, the last active section stays active even when the exercise should be finished
    private getActiveSectionIndex = () => {
        const { exercises, selectedExerciseIndex } = this.ctxt();
        const { startTime, defaultSections: sectionItems } = exercises[selectedExerciseIndex];

        const d = new Date();
        const currentPosition = d.getMinutes() * 6 + d.getHours() * 360; // "absolute minute position"
        const startPosition = startTime.getMinutes() * 6 + startTime.getHours() * 360;
        let angle = startPosition;
        let index = -1;

        if (sectionItems.length > 0 && currentPosition >= startPosition) {

            for (let i = 0; i < sectionItems.length; i++) {
                const sectionAngle = sectionItems[i].duration * 6;
                if (angle <= currentPosition && currentPosition <= angle + sectionAngle) {
                    index = i;
                    break;
                }
                angle = angle + sectionAngle;
            }
            if (currentPosition >= (angle + sectionItems[sectionItems.length - 1].duration * 6)) {
                index++;
            }
        }
        // if the angle moves from last section to the exercise set index to "over"

        return index;
    }
    
    /**
     * Updates sections on the face.
     * @returns {ISection} updated sections.
     */
    private updateFaceElements() {
        // in order to enable full lenght that exceeds hour we need to track the hour as well.
        const { exercises, selectedExerciseIndex, setActiveSection } = this.ctxt();
        const { startTime, defaultSections } = exercises[selectedExerciseIndex];

        const d = new Date();
        const sectionItems: JSX.Element[] = [];

        // change to absolute
        const currentPosition = d.getMinutes() * 6 + d.getHours() * 360; // "absolute minute position"
        const startPosition = startTime.getMinutes() * 6 + startTime.getHours() * 360;
        let stopDrawAngle = 360; // opacity of sections is a good way of communication where we start and are..

        if (defaultSections) {
            // calculate from start time
            const {classes} = this.props;
            let angle = startPosition;
            defaultSections.map((sectionItem, index) => {
                let sectionStyle = classes.inactiveSection;
                const startAngle = angle;
                angle += sectionItem.duration * 6; // transform minutes to degrees

                // if the section ends before starting angle dont draw it. Also if start is over an hour away
                if (angle <= currentPosition || currentPosition < angle - 360) {
                    // "extend" full circle by new minutes
                    stopDrawAngle = stopDrawAngle + currentPosition;
                }
                else {
                    if (startAngle <= currentPosition && currentPosition < angle) {
                        sectionStyle = classes.activeSection;

                        const activeIndex = this.getActiveSectionIndex()
                        if (this.state.activeSectionIndex !== activeIndex) {
                            this.setState({
                                activeSectionIndex: activeIndex
                            })
                            setActiveSection(activeIndex);
                        }
                    }

                    if (angle > stopDrawAngle + startPosition) {
                        angle = stopDrawAngle + startPosition;
                    }

                    const sectionArcKey = "Arc-" + index + angle;
                    sectionItems.push(<SectionItem
                        cx={this.centerCoordinate}
                        cy={this.centerCoordinate}
                        radius={44.1}
                        startAngle={startAngle}
                        endAngle={angle}
                        thickness={3}
                        key={sectionArcKey}
                        color={sectionItem.color}
                        class={sectionStyle} />)
                    // just check whether there is an active item set.
                }
            });
        }
        return sectionItems;
    }

}

export default withExerciseContext(withStyles(styles)(Clock));