import React, {Component} from 'react';
import SectionItem from './Components/SectionItem';
import StopWatchHand from './Components/StopWatchHand';
import './Clock.css';

class Clock extends Component {
    
    constructor(props){
        super(props);
        
        // move all the generally used stuff to vars to make modding easier. -> recalculate from props.
        var canvasSide = 100;
        var viewBox = "'0 0 " + canvasSide + " " + canvasSide + "'";
        var centerCoordinate = canvasSide/2;
        var faceRadius = canvasSide/2 - (canvasSide/20);

        var d = new Date()
        var secRotation = 6*d.getSeconds();
        var minRotation = 6*d.getMinutes();
        var hourRotation = 30*(d.getHours()%12) + d.getMinutes()/2;

        this.timerHand = null;
        var timerEnabled = false;

        this.state = {
            secPosition : secRotation,
            minPosition : minRotation,
            hourPosition : hourRotation,
            timerSecPosition :  0,
            timerHandVisible : "hidden"
        }
        
        this.rotateHand = function(el, deg) {
            el.setAttribute('transform', 'rotate('+ deg +' 50 50)')
        }

        // get stuff from sub function
        this.createMarker = function(id,length,className){
            
            // lets not render too many objects here
            if(id >= 60){
                throw new DOMException("too many minutemarkers for this clock");
            }
            let idTag = "marker"+i;
            let y1 = canvasSide/2 - faceRadius + length;
            let rotation = 'rotate('+ i*6 +' 50 50)';
            return (<line key={idTag} id={idTag} className={className} x1="50" y1={y1} x2="50" y2="6" transform={rotation}/>)
        }
        
        this.updateTime = function() {
            var d = new Date()
            var secRotation = 6*d.getSeconds();
            var minRotation = 6*d.getMinutes();
            var hourRotation = 30*(d.getHours()%12) + d.getMinutes()/2;
            this.setState(
                {
                    date: d.toString() ,
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
            // set rotation to 0
            var props = {
                x:"50",
                length:"38",
                y:"50"
            }

            // this.setState({
            //     timerHand: <StopWatchHand x1="50" x2="50" y1="50" y2="12" color="yellow"/> 
            //     //new StopWatchHand(props)
            //     //<StopWatchHand x="50" length="38" />;
            //     //<line id="timer" x1="50" y1="50" x2="50" y2="12" stroke="yellow" />
            // })
            document.getElementById("timer").setAttribute("visibility","visible")
            timerEnabled = true;
        }
        
        var disableTimerHand = function(){
            // read if this is ok to do..
            var hand = document.getElementById("timer")
            //hand.setAttribute("visibility","hidden")
            // remove and create hand instead of manipulating it
            hand.remove();
            stopWatchSeconds = 0;
            rotateHand(hand,0)
            timerEnabled = false;
        }

        var rotateHand = function(el, seconds) {
            // make the stopwatch run with smooth movement
            // interval is 0,5s to support more "instant" stopping
            el.setAttribute('transform', 'rotate('+ seconds*3 +' 50 50)')
        }
        
        var updateStopwatch = function(){
            var hand = document.getElementById("timer")
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
                rotateHand(document.getElementById("timer"),stopWatchSeconds)
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
        
        //separately timed stopclock
        ////this.timerHand = <StopWatchHand x="50" y="50" length="38" />
        //this.timerHand = <line id="timer" x1="50" y1="50" x2="50" y2="12" stroke="yellow" />

        // static clock elements for the object
        this.hourHand = <rect id="hour" x="47.5" y="22.5" width="5" height="30" rx="2.5" ry="2.55" fill="red" />
        this.minHand = <rect id="min" x="49" y="12.5" width="2" height="40" rx="2" ry="2" fill="blue" />
        this.secHand =  <g id="secHand">
                            <line id="sec" x1="50" y1="50" x2="50" y2="10" stroke="white" />
                            <line id="sectip" x1="50" y1="9" x2="50" y2="16" stroke="red" />
                        </g>

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

        let sectionBlocks = []
        if(this.props.sectionItems){
            sectionBlocks.map(sectionItem => {
                return(
                    <SectionItem key={sectionItem.name} section={sectionItem} />
                );
            });

        }
    }
    render() {
        let sectionItems;
        if(this.props.sectionItems){
            sectionItems = this.props.sectionItems.map(sectionItem => {
                return(
                    <SectionItem key={sectionItem.name} section={sectionItem} />
                );
            });
            
        }
        return (
            // <div className="Clock" onClick={this.cycleTimerFunctions.bind(this)} onTap={this.cycleTimerFunctions.bind(this)}>
            <div className="Clock" onClick={this.enableTimerHand}>
             <svg id="clock" viewBox="0 0 100 100"> 
               <circle id="face" cx="50" cy="50" r="45"/>
               <SectionItem cx="50" cy="50" radius="38" start_angle="0" end_angle="60" thickness="5" color="lightblue"/>
               <SectionItem cx="50" cy="50" radius="38" start_angle="60" end_angle="90" thickness="5" color="lightgreen"/>
               <SectionItem cx="50" cy="50" radius="38" start_angle="90" end_angle="300" thickness="5" color="orange"/>
               <SectionItem cx="50" cy="50" radius="38" start_angle="300" end_angle="345" thickness="5" color="lightblue"/>
               <SectionItem cx="50" cy="50" radius="38" start_angle="345" end_angle="360" thickness="5" color="lightgreen"/>
                    {/* <g id="sections">
                    arc secotors here 
                    </g> */}
                    <g id="minuteMarkers">
                    {this.Majors}
                    </g>
                    <g id="hands">
                       {this.hourHand}
                       {this.minHand}
                       <StopWatchHand x1="50" y1="50" x2="50" y2="12" color="yellow"/>
                       {/* {this.state.timerHand} */}
                       {this.secHand}
                    </g>
               <circle id="midPoint" cx="50" cy="50" r="3"/>
             </svg>
            <div>
        {this.state.date}<br/>
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
                    date: d.toString() ,
                    secPosition: secRotation,
                    minPosition: minRotation,
                    hourPosition: hourRotation
                }
            )

            this.rotateHand(document.getElementById('secHand'),this.state.secPosition)
            this.rotateHand(document.getElementById('min'),this.state.minPosition)
            this.rotateHand(document.getElementById('hour'),this.state.hourPosition)
        },1000)

        // var timerHand = document.getElementById("timer");
        // timerHand.setAttribute("visibility","hidden");

    }

}

export default Clock;