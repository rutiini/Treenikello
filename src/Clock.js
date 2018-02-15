import React, {Component} from 'react';
import SectionItem from './Components/SectionItem'
import clock from './clock.svg';
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
                <img src={clock} className="Clock" alt="clock" />
            
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

    setInterval(el,deg){
        function r(el, deg) {
            el.setAttribute('transform', 'rotate('+ deg +' 50 50)')
        }
        var d = new Date()
        r(clock.sec, 6*d.getSeconds())  
        r(clock.min, 6*d.getMinutes())
        r(clock.hour, 30*(d.getHours()%12) + d.getMinutes()/2)
    
    }
}
export default Clock;