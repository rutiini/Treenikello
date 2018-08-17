// import { withStyles } from '@material-ui/core';
import React, { Component } from 'react';
import { ISection } from '../DataInterfaces';
import './Clock.css';
import SectionItem from './SectionItem';
import StopWatchHand from './StopWatchHand';

// TODO use withstyles..
// const styles: any = theme => ({
//     clock: {
//         [theme.breakpoints.up('sm')]: {
//             width: 1000,
//         },
//         [theme.breakpoints.down('xs')]: {
//             width: 500,
//         }
//     }

// })

interface IProps {
    sectionItems: ISection[],
    startTime: Date,
    canvasSide: number,
    activeSection: number,
    setActive: (sectionIndex: number) => void
}

interface IState {
    activeSectionIndex: number,
    date: string,
    secPosition: number,
    minPosition: number,
    hourPosition: number,
    timerEnabled: string
}

class Clock extends Component<IProps, IState> {

    // basic parameters for drawing
    private canvasSide: number = 100;
    private centerCoordinate = 100 / 2;
    private faceRadius = 100 / 2 - (100 / 20);
    private initialRotation: number = 0; // TODO: check whether this needs an actual value

    private timerEnabled = false;
    private timerStarted = false;
    private timerFinished = false;
    private stopWatchSeconds = 0;

    private stopwatchInterval: any;
    // private interval: any;
    private sectionItems: JSX.Element[];

    // static clock elements for the object
    private hourHand = <rect id="hour" x="48.5" y="22.5" width="3" height="30" rx="2.5" ry="2.55" fill="red" />
    private minHand = <rect id="min" x="49" y="12.5" width="2" height="40" rx="2" ry="2" fill="blue" />
    private secHand = <g id="secHand">
        <line id="sec" x1="50" y1="50" x2="50" y2="11" stroke="white" />
    </g>

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

        for (let i = 0; i < 60; i++) {
            // the "big hours"
            if (i % 15 === 0) {
                majors.push(this.createMarker(i, 5, "bigHourMarker"))
            }
            // lesser markers
            else if (i % 5 === 0) {
                majors.push(this.createMarker(i, 5, "hourMarker"))
            }
            // minutes
            else {
                majors.push(this.createMarker(i, 3, "minuteMarker"))
            }
        }
        this.Majors = majors;

        // bindings
        this.cycleTimerFunctions = this.cycleTimerFunctions.bind(this);
    }
    // get stuff from sub function
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
        const secRotation = 6 * d.getSeconds();
        const minRotation = 6 * d.getMinutes();
        const hourRotation = 30 * (d.getHours() % 12) + d.getMinutes() / 2;

        this.setState(
            {
                date: d.toLocaleString("fi"),
                hourPosition: hourRotation,
                minPosition: minRotation,
                secPosition: secRotation,
            }
        )

        this.rotateHand(this.secHand, this.state.secPosition);
        this.rotateHand(this.minHand, this.state.minPosition);
        this.rotateHand(this.hourHand, this.state.hourPosition);
    }

    // dont bind to wrong "this"!
    public enableTimerHand = () => {

        const hand: HTMLElement = document.getElementById("timerHand") as HTMLElement;
        hand.setAttribute("visibility", "visible")

        this.timerEnabled = true;
    }

    public componentWillMount() {

        // put the hands in correct time for initial render
        const d = new Date()
        const secRotation = 6 * d.getSeconds();
        const minRotation = 6 * d.getMinutes();
        const hourRotation = 30 * (d.getHours() % 12) + d.getMinutes() / 2;

        this.setState(
            {
                activeSectionIndex: -1,
                date: d.toLocaleString("fi"),
                hourPosition: hourRotation,
                minPosition: minRotation,
                secPosition: secRotation,
                timerEnabled: "hidden",
            }
        )
    }

    public render() {
        this.sectionItems = this.updateFaceElements();
        return (
            <div className="clockContainer" onClick={this.cycleTimerFunctions}>

                <svg id="clock" className="clock" viewBox="0 0 100 100">
                    <circle id="face" cx="50" cy="50" r="45" />
                    {this.sectionItems}
                    <g id="minuteMarkers">
                        {this.Majors}
                    </g>
                    <g id="hands">
                        {this.hourHand}
                        {this.minHand}
                        <StopWatchHand x1={50} y1={50} x2={50} y2={14} y3={12} color="yellow" tipColor="red" />
                        {this.secHand}
                    </g>
                    <circle id="midPoint" cx="50" cy="50" r="3" />
                </svg>
            </div>
        )
    }
    // udpate active section to parent?
    public componentDidUpdate() {
        const index = this.getActiveSectionIndex(this.props.sectionItems)

        if (this.state.activeSectionIndex !== index) {
            this.setState({
                activeSectionIndex: index
            })
            this.props.setActive(index);
        }
    }

    public componentDidMount() {

        setInterval(() => {
            const { secPosition, minPosition, hourPosition } = this.state;
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

            this.rotateHand(document.getElementById('secHand'), secPosition)
            this.rotateHand(document.getElementById('min'), minPosition)
            this.rotateHand(document.getElementById('hour'), hourPosition)
        }, 1000)

        const timerHand = document.getElementById("timerHand") as HTMLElement;
        timerHand.setAttribute("visibility", "hidden");

    }

    private disableTimerHand = () => {
        // read if this is ok to do..
        const hand: HTMLElement = document.getElementById("timerHand") as HTMLElement;

        // remove and create hand instead of manipulating it?
        // hand.remove();

        this.stopWatchSeconds = 0;
        // hand.setAttribute('transition','none')
        hand.setAttribute("visibility", "hidden")
        if (hand.classList.contains("timerOn")) {
            hand.classList.remove("timerOn")
        }
        if (!hand.classList.contains("timerOff")) {
            hand.classList.add("timerOff")
        }
        this.rotateHand(hand, 0)
        this.timerEnabled = false;
    }

    private rotateHand = (el: any, seconds: number) => {
        // make the stopwatch run with smooth movement
        // interval is 0,5s to support more "instant" stopping
        el.setAttribute('transform', 'rotate(' + seconds * 3 + ' 50 50)');
    }
    private updateStopwatch = () => {
        const hand = document.getElementById("timerHand") as HTMLElement;
        this.stopWatchSeconds++;
        this.rotateHand(hand, this.stopWatchSeconds);
    }

    // cycle on tap -> make visible -> start -> stop -> hide and reset
    private cycleTimerFunctions = () => {
        // case hidden set to visible and reset position to 0
        if (!this.timerEnabled && !this.timerFinished) {
            this.enableTimerHand();
            this.timerEnabled = true;
        }
        // case visible and stopped start timer
        else if (this.timerEnabled && !this.timerStarted && !this.timerFinished) {
            // startTimer
            this.stopWatchSeconds = 1
            this.rotateHand(document.getElementById("timerHand") as HTMLElement, this.stopWatchSeconds)
            this.stopwatchInterval = setInterval(this.updateStopwatch, 500);
            this.timerStarted = true;
        }
        // case visible and stated stop timer
        else if (this.timerEnabled && this.timerStarted) {
            // stopTimer
            clearInterval(this.stopwatchInterval);
            this.timerFinished = true;
            this.timerStarted = false;
        }
        // case visible and stopped (and used) set to hidden
        else {
            this.disableTimerHand();
            this.timerEnabled = false;
            this.timerStarted = false;
            this.timerFinished = false;
        }
    }

    // static elements -> timerhand should be created on-demand!




    private getActiveSectionIndex = (sections: ISection[]) => {
        const { startTime } = this.props;
        const d = new Date();
        const currentPosition = d.getMinutes() * 6 + d.getHours() * 360; // "absolute minute position"
        const startPosition = startTime.getMinutes() * 6 + startTime.getHours() * 360;
        let angle = startPosition;
        let index = -1;

        if (sections.length > 0 && currentPosition >= startPosition) {

            for (let i = 0; i < sections.length; i++) {
                const sectionAngle = sections[i].duration * 6;
                if (angle <= currentPosition && currentPosition <= angle + sectionAngle) {
                    index = i;
                    break;
                }
                angle = angle + sectionAngle;
            }
            if (currentPosition >= (angle + sections[sections.length - 1].duration * 6)) {
                index++;
            }
        }
        // if the angle moves from last section to the exercise set index to "over"

        return index;
    }

    private updateFaceElements() {
        // in order to enable full lenght that exceeds hour we need to track the hour as well.
        const d = new Date();

        const sectionItems: JSX.Element[] = [];

        // change to absolute
        const currentPosition = d.getMinutes() * 6 + d.getHours() * 360; // "absolute minute position"
        const startPosition = this.props.startTime.getMinutes() * 6 + this.props.startTime.getHours() * 360;
        let stopDrawAngle = 360; // opacity of sections is a good way of communication where we start and are..

        if (this.props.sectionItems) {
            // calculate from start time

            let angle = startPosition;
            // console.log(`sections starting angle: ${angle} current time angle: ${currentPosition} `)
            this.props.sectionItems.map((sectionItem, index) => {

                let sectionStyle = "InactiveSection";
                const startAngle = angle;
                angle += sectionItem.duration * 6; // transform minutes to degrees

                // if the section ends before starting angle dont draw it. Also if start is over an hour away
                if (angle <= currentPosition || currentPosition < angle - 360) {
                    // "extend" full circle by new minutes
                    stopDrawAngle = stopDrawAngle + currentPosition;
                }
                // should not be done during render since it updates state.
                // TODO. set active to full opacity others slightly less.
                else if (startAngle <= currentPosition && currentPosition < angle) {
                    sectionStyle = "ActiveSection"
                }

                if (angle > stopDrawAngle + startPosition) {
                    angle = stopDrawAngle + startPosition;
                }

                // set the detected section to the info block? -> info block is at app though?
                // this hack forces rerendering (changing keys..)
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
            });
            // just check whether there is an active item set.
        }
        return sectionItems;
    }

}

export default Clock as React.ComponentClass<IProps>;

// export default withStyles(styles)(Clock);