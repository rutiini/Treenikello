import React, {Component} from 'react';
import SectionItem from './SectionItem';
import StopWatchHand from './StopWatchHand';
import './Clock.css';

class Clock extends Component {

    // basic parameters for drawing
    canvasSide = 100;
    centerCoordinate = 100/2;
    faceRadius = 100/2 - (100/20);


    constructor(props){
        super(props);

        // custom canvasside given.
        if(this.props.canvasSide){

            this.canvasSide = this.props.canvasSide;
            this.centerCoordinate = this.canvasSide/2;
            this.faceRadius =  this.canvasSide/2 - (this.canvasSide/20)
        }


        this.rotateHand = function(el, deg) {
            el.setAttribute('transform', 'rotate('+ deg +' 50 50)')
            // el.setAttribute('transform', {rotate: deg + '50 50'})
        }

        // get stuff from sub function
        this.createMarker = function(id,length,className){

            // lets not render too many objects here
            if(id >= 60){
                throw new DOMException("too many minutemarkers for this clock");
            }
            let idTag = "marker"+i;
            let y1 = this.canvasSide/2 - this.faceRadius + length;
            let y2 = this.canvasSide/2 - this.faceRadius + 0.9; // slight overlap (0.1) and stroke width..
            let centerCoordinate = this.canvasSide/2;
            let rotation = 'rotate('+ i*6 +' 50 50)';
            return (<line key={idTag} id={idTag} className={className} x1={centerCoordinate} y1={y1} x2={centerCoordinate} y2={y2} transform={rotation}/>)
        }

        this.updateTime = function() {
            var d = new Date()
            var secRotation = 6*d.getSeconds();
            var minRotation = 6*d.getMinutes();
            var hourRotation = 30*(d.getHours()%12) + d.getMinutes()/2;
            this.setState(
                {
                    date: d.toLocaleString("fi") ,
                    secPosition: secRotation,
                    minPosition: minRotation,
                    hourPosition: hourRotation
                }
            )
            this.rotateHand(this.secHand,this.state.secPosition)
            this.rotateHand(this.minHand,this.state.minPosition)
            this.rotateHand(this.hourHand,this.state.hourPosition)
        }

        var timerEnabled = false;
        var timerStarted = false;
        var timerFinished = false;
        var stopWatchSeconds = 0;

        // dont bind to wrong "this"!
        var enableTimerHand = function(){

            let hand = document.getElementById("timerHand")
            hand.setAttribute("visibility","visible")

            timerEnabled = true;
        }

        var disableTimerHand = function(){
            // read if this is ok to do..
            var hand = document.getElementById("timerHand")

            // remove and create hand instead of manipulating it?
            //hand.remove();

            stopWatchSeconds = 0;
            // hand.setAttribute('transition','none')
            hand.setAttribute("visibility","hidden")
            if(hand.classList.contains("timerOn")){
                hand.classList.remove("timerOn")
            }
            if(!hand.classList.contains("timerOff")){
                hand.classList.add("timerOff")
            }
            rotateHand(hand,0)
            timerEnabled = false;
        }

        var rotateHand = function(el, seconds) {
            // make the stopwatch run with smooth movement
            // interval is 0,5s to support more "instant" stopping
            el.setAttribute('transform', 'rotate('+ seconds*3 +' 50 50)')
        }

        var updateStopwatch = function(){
            var hand = document.getElementById("timerHand")
            stopWatchSeconds++;
            rotateHand(hand,stopWatchSeconds)
        }

        var stopWatchInterval;
        // cycle on tap -> make visible -> start -> stop -> hide and reset
        this.cycleTimerFunctions = function(){
            // case hidden set to visible and reset position to 0
            if(!timerEnabled && !timerFinished){
                enableTimerHand();
                timerEnabled = true;
            }
            // case visible and stopped start timer
            else if(timerEnabled && !timerStarted && !timerFinished){
                // startTimer
                stopWatchSeconds = 1
                rotateHand(document.getElementById("timerHand"),stopWatchSeconds)
                stopWatchInterval = setInterval(updateStopwatch,500);
                timerStarted = true;
            }
            // case visible and stated stop timer
            else if(timerEnabled && timerStarted){
                //stopTimer
                clearInterval(stopWatchInterval);
                timerFinished = true;
                timerStarted = false;
            }
            // case visible and stopped (and used) set to hidden
            else{
                disableTimerHand();
                timerEnabled = false;
                timerStarted = false;
                timerFinished = false;
            }
        }

        // static elements -> timerhand should be created on-demand!

        // static clock elements for the object
        this.hourHand = <rect id="hour" x="48.5" y="22.5" width="3" height="30" rx="2.5" ry="2.55" fill="red" />
        this.minHand = <rect id="min" x="49" y="12.5" width="2" height="40" rx="2" ry="2" fill="blue" />
        this.secHand =  <g id="secHand">
        <line id="sec" x1="50" y1="50" x2="50" y2="11" stroke="white" />
        {/* <line id="sectip" x1="50" y1="9" x2="50" y2="16" stroke="red" /> */}
        </g>

        this.sectionItems = null;

        // draw hours and minutes to the clock face
        var majors = [];
        for(var i = 0; i<60; i++){
            // the "big hours"
            if(i%15 === 0){
                majors.push(this.createMarker(i,5,"bigHourMarker"))
            }
            // lesser markers
            else if(i%5 === 0){
                majors.push(this.createMarker(i,5,"hourMarker"))
            }
            // minutes
            else{
                majors.push(this.createMarker(i,3,"minuteMarker"))
            }
        }
        this.Majors = majors;

    }

    updateFaceElements(){
         // consider the current position of minute hand compared to always show upcoming sections and current section, "old" sections can be left out. Hour comes to play when the exercise is over an hour and we need to know which cycle we are on. -> calculate minute hand position relative to the start time.
        // need for good ol' math with modulo stuff probably.
        let d = new Date();
        let currentMinutePosition = d.getMinutes()*6;
        let sectionItems;
        let fullCicrcle = 354; // leave a gap to hilight the starting moment or find another way to hilight the start..
        let activeSet = this.props.activeSection;
        let startTimeAngle = this.props.startTime.getMinutes()*6;
        if(this.props.sectionItems){
            // calculate from start time
            var angle = startTimeAngle;

            sectionItems = this.props.sectionItems.map(sectionItem => {

                if(angle === fullCicrcle + startTimeAngle){
                    return null;
                }

                let startAngle = angle
                angle += sectionItem.duration*6; // transform minutes to degrees

                // if the section ends before starting angle dont draw it..
                if(angle <= currentMinutePosition){
                    // "extend" full circle by new minutes
                    fullCicrcle = fullCicrcle + currentMinutePosition;
                    return null;
                }
                // should not be done during render since it updates state.
                else if(startAngle <= currentMinutePosition && currentMinutePosition < angle){
                    if(activeSet == null){
                        this.props.setActive(sectionItem);
                    }else if(activeSet.name !== sectionItem.name){
                        this.props.setActive(sectionItem);
                    }
                }

                // we reach full circle and stop rendering
                if(angle > fullCicrcle + startTimeAngle){
                    angle = fullCicrcle + startTimeAngle;
                }
                // set the detected section to the info block? -> info block is at app though?
                // this hack forces redrawing
                let sectionArcKey = "Arc-" + this.props.startTime.getMinutes() + sectionItem.key;
                return(
                    <SectionItem cx="50" cy="50" radius="44.1" start_angle={startAngle} end_angle={angle} thickness="3" key={sectionArcKey} color={sectionItem.color} section={sectionItem} />
                );
            });
        }
        return sectionItems;
    }

    componentWillMount(){

        // put the hands in correct time for initial render
        let d = new Date()
        let secRotation = 6*d.getSeconds();
        let minRotation = 6*d.getMinutes();
        let hourRotation = 30*(d.getHours()%12) + d.getMinutes()/2;

        this.setState(
            {
                date: d.toLocaleString("fi") ,
                secPosition: secRotation,
                minPosition: minRotation,
                hourPosition: hourRotation,
                timerEnabled: "hidden"
            }
        )

        // this.rotateHand(document.getElementById('secHand'),this.state.secPosition)
        // this.rotateHand(document.getElementById('min'),this.state.minPosition)
        // this.rotateHand(document.getElementById('hour'),this.state.hourPosition)

        this.timerHand = null;
        // var timerEnabled = false;
    }

    componentWillReceiveProps(nextProps){
        // fires when component is recieving new props
        // console.log("Clock: ComponentWillRecieveProps triggered")
    }
    componentWillUpdate(){
        // fires before rendering with new props or state
        this.sectionItems = this.updateFaceElements();
    }
    render() {

        return (
            <div className="Clock" onClick={this.cycleTimerFunctions.bind(this)} onTap={this.cycleTimerFunctions.bind(this)}>
            <div id="StringDateContainer">
            {this.state.date}<br/>
            </div>
            {/* current section indicator (color coded box with name and description) */}
            <svg id="clock" viewBox="0 0 100 100">
            <circle id="face" cx="50" cy="50" r="45"/>
            {this.sectionItems}
            <g id="minuteMarkers">
            {this.Majors}
            </g>
            <g id="hands">
            {this.hourHand}
            {this.minHand}
            <StopWatchHand x1="50" y1="50" x2="50" y2="14" y3="12" color="yellow" tipColor="red" visibility={this.state.timerEnabled} transform={this.initialRotation}/>
            {this.secHand}
            </g>
            <circle id="midPoint" cx="50" cy="50" r="3"/>
            </svg>
            <div>
            </div>
            </div>
        )}

        componentDidMount(){

            this._interval = setInterval(() => {
                var d = new Date()
                var secRotation = 6*d.getSeconds();
                var minRotation = 6*d.getMinutes();
                var hourRotation = 30*(d.getHours()%12) + d.getMinutes()/2;

                this.setState(
                    {
                        date: d.toLocaleString("fi") ,
                        secPosition: secRotation,
                        minPosition: minRotation,
                        hourPosition: hourRotation
                    }
                )

                this.rotateHand(document.getElementById('secHand'),this.state.secPosition)
                this.rotateHand(document.getElementById('min'),this.state.minPosition)
                this.rotateHand(document.getElementById('hour'),this.state.hourPosition)
            },1000)

            var timerHand = document.getElementById("timerHand");
            timerHand.setAttribute("visibility","hidden");

        }

    }

    export default Clock;