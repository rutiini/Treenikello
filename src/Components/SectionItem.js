import React, {Component} from 'react';
import './Sectionitem.css'

class SectionItem extends Component {
    
    // this should be a pure component probably since not much is going on in here, we just need to optimize rendering to handle the component alone.
    
    polarToCartesian(centerX, centerY, radius, angleInDegrees) {
        var angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
        
        return {
            x: Number(centerX) + (radius * Math.cos(angleInRadians)),
            y: Number(centerY) + (radius * Math.sin(angleInRadians))
        };
    }

    getPath(){
        // arc -> these are the props required.
        console.log(this.props.cx + " " + this.props.cy + " " +  this.props.radius + " " +  this.props.end_angle + " " + this.props.start_angle + " " + this.props.thickness)
        var start = this.polarToCartesian( this.props.cx,  this.props.cy,  this.props.radius,  this.props.end_angle);
        var end = this.polarToCartesian( this.props.cx,  this.props.cy,  this.props.radius,  this.props.start_angle);
        var largeArcFlag =  this.props.end_angle -  this.props.start_angle <= 180 ? "0" : "1";
        console.log(start.x + " " + start.y + " " + end.x + " " + end.y)
        var cutout_radius =  this.props.radius -  this.props.thickness,
        		start2 = this.polarToCartesian( this.props.cx, this.props.cy, cutout_radius,  this.props.end_angle),
        		end2 = this.polarToCartesian( this.props.cx,  this.props.cy, cutout_radius,  this.props.start_angle),

        d = [
        	"M", start.x, start.y,
        	"A",  this.props.radius,  this.props.radius, 0, largeArcFlag, 0, end.x, end.y,
        	"L",  this.props.cx,  this.props.cy,
        	"Z",
        	"M", start2.x, start2.y,
        	"A", cutout_radius, cutout_radius, 0, largeArcFlag, 0, end2.x, end2.y,
        	"L",  this.props.cx,  this.props.cy,
        	"Z"
        ].join(" ");

        console.log(start2.x + " " + start2.y + " " + end2.x + " " + end2.y)

        console.log(this.props.cx + " " + this.props.cy + " " +  this.props.radius + " " +  this.props.end_angle + " " + this.props.start_angle + " " + this.props.thickness)
        console.log(d)
        console.log("M 95 50 A 45 45 0 0 0 50 5 L 50 50 Z M 85 50 A 35 35 0 0 0 50 15 L 50 50 Z")

        return d;
    }


    render() {
        return (
            // <div className="SectionItem">
            <path id="arc" fill={this.props.color} stroke="none" fillRule="evenodd" d={this.d}/>
            //<path id="arc" fill="lightblue" stroke="none" fill-rule="evenodd" d="M 95 50 A 45 45 0 0 0 50 5 L 50 50 Z M 85 50 A 35 35 0 0 0 50 15 L 50 50 Z"/>
            // "M 5045 500 A 45 45 0 0 0 502.7554552980815448e-15 50-45 L 50 50 Z M 5035 500 A 35 35 0 0 0 502.1431318985078682e-15 50-35 L 50 50 Z"
                // { {this.props.section.position} ->
                // {this.props.section.name} 
                // {this.props.section.duration} min
                // {this.props.section.description} }
            // </div>
        )   
    }

    componentDidMount(){
        // here we draw it..
        this.d = this.getPath()
    }
}
export default SectionItem;