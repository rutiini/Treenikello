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
    
    getActiveSectionIndex = (sections) => {
        const {startTime} = this.props;
        const d = new Date();
        const currentPosition = d.getMinutes()*6 + d.getHours()*360; // "absolute minute position"
        const startPosition = startTime.getMinutes()*6 + startTime.getHours()*360;
        let angle = startPosition;
        let index = -1;
        
        if(sections.length > 0 && currentPosition >= startPosition){
            
            for(let i= 0; i< sections.length; i++){
                const sectionAngle = sections[i].duration*6;
                if(angle <= currentPosition && currentPosition <= angle + sectionAngle){
                    index = i;
                    break;
                }
                angle = angle + sectionAngle;
            }
            // exercise is complpeted.. NOT WORKING
            if(currentPosition >= (angle + sections[sections.length -1].duration*6)){
                index++;
            }
        }
        // if the angle moves from last section to the exercise set index to "over"
        
        return index;
    }
    
    updateFaceElements(){
        // in order to enable full lenght that exceeds hour we need to track the hour as well.
        const d = new Date();
        
        let sectionItems;
        
        // change to absolute
        const currentPosition = d.getMinutes()*6 + d.getHours()*360; // "absolute minute position"
        const startPosition = this.props.startTime.getMinutes()*6 + this.props.startTime.getHours()*360;
        let stopDrawAngle = 360; // opacity of sections is a good way of communication where we start and are..
        
        if(this.props.sectionItems){
            // calculate from start time
            
            let angle = startPosition;
            // console.log(`sections starting angle: ${angle} current time angle: ${currentPosition} `)
            sectionItems = this.props.sectionItems.map((sectionItem,index) => {
                
                let sectionStyle = "InactiveSection";
                let startAngle = angle
                angle += sectionItem.duration*6; // transform minutes to degrees
                
                // if the section ends before starting angle dont draw it. Also if start is over an hour away
                if(angle <= currentPosition || currentPosition < angle - 360){
                    // "extend" full circle by new minutes
                    stopDrawAngle = stopDrawAngle + currentPosition;
                    return null;
                }
                // should not be done during render since it updates state.
                // TODO. set active to full opacity others slightly less.
                else if(startAngle <= currentPosition && currentPosition < angle){
                    sectionStyle = "ActiveSection"
                }
                
                if(angle > stopDrawAngle + startPosition){
                    angle = stopDrawAngle + startPosition;
                }
                
                // set the detected section to the info block? -> info block is at app though?
                // this hack forces rerendering (changing keys..)
                let sectionArcKey = "Arc-" + index + angle;
                return(
                    <SectionItem cx={this.centerCoordinate} cy={this.centerCoordinate} radius="44.1" start_angle={startAngle} end_angle={angle} thickness="3" key={sectionArcKey} color={sectionItem.color} section={sectionItem} class={sectionStyle}/>
                );
            });
            // just check whether there is an active item set.
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
                timerEnabled: "hidden",
                activeSectionIndex: -1
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
        //console.log("Clock: ComponentWillRecieveProps triggered")
    }
    componentWillUpdate(){
        // fires before rendering with new props or state
        // this.sectionItems = this.updateFaceElements();
    }
    render() {
        this.sectionItems = this.updateFaceElements();
        return (
            <div className="Clock" onClick={this.cycleTimerFunctions.bind(this)}>
            
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
        // udpate active section to parent?
        componentDidUpdate(){
            const index = this.getActiveSectionIndex(this.props.sectionItems)

            if(this.state.ActiveSectionIndex !== index){
                this.setState({
                    ActiveSectionIndex: index
                })
                this.props.setActive(index);
            }
        }
        
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