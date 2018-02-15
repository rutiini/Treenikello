import React, {Component} from 'react';
import SectionItem from './Components/SectionItem';
import './Clock.css';

class Clock extends Component {

    render() {
        let sectionItems;
        if(this.props.sectionItems){
            sectionItems = this.props.sectionItems.map(sectionItem => {
                // console.log(sectionItem);
                return(
                    <SectionItem key={sectionItem.name} section={sectionItem} />
                );
            });
        }
        return (
            <div className="Clock">
                {/* <img src={clock} className="Clock" alt="clock" /> */}
                <svg xmlns="http://www.w3.org/2000/svg" id="clock" viewBox="0 0 100 100">
	                <circle id="face" cx="50" cy="50" r="45"/>
	                <g id="hands">
		                <rect id="hour" x="48.5" y="12.5" width="5" height="40" rx="2.5" ry="2.55" fill="red" />
		                <rect id="min" x="48" y="12.5" width="3" height="40" rx="2" ry="2" fill="blue"/>
		                <line id="sec" x1="50" y1="50" x2="50" y2="16" stroke="white"/>
	                </g>
                    <circle id="midpoint" cx="50" cy="50" r="3"/>
                </svg>
            <div>
                {/* {this.props.el}
                <br/>
                {this.props.deg}
                <br/> */}
                {sectionItems}
            </div>
            </div>
        )
    }
/*
    setInterval(el,deg){
        function r(el, deg) {
            el.setAttribute('transform', 'rotate('+ deg +' 50 50)')
        }
        var d = new Date()
        r(clock.sec, 6*d.getSeconds())  
        r(clock.min, 6*d.getMinutes())
        r(clock.hour, 30*(d.getHours()%12) + d.getMinutes()/2)
    
    }
    */
}
export default Clock;