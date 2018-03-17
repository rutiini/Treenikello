import React, {Component} from 'react';
import './Sectionitem.css'

class SectionItem extends Component {
    
    polarToCartesian(centerX, centerY, radius, angleInDegrees) {
        var angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
        
        return {
            x: Number(centerX) + (radius * Math.cos(angleInRadians)),
            y: Number(centerY) + (radius * Math.sin(angleInRadians))
        };
    }
    
    //TODO: Clean up here, it's messy.

    componentWillReceiveProps(nextProps){
        
        // console.log("sectionItem angle: " + nextProps.start_angle)
        // if(this.props.color !== nextProps.color){
        //     console.log("sectionItem color: " + this.props.color)
        //     console.log("sectionItem new color: " + nextProps.color)
        // }
    }
    componentWillUpdate(){
        //console.log("sectionItem will update.")
        this.d = this.getPath();
    }
    
    // arc -> these are the props required.
    getPath(){
        
        // fix the outer edge black gap by increasing radius by 0.1px
        
        var start = this.polarToCartesian( this.props.cx,  this.props.cy,  this.props.radius,  this.props.end_angle);
        var end = this.polarToCartesian( this.props.cx,  this.props.cy,  this.props.radius,  this.props.start_angle);
        var largeArcFlag =  this.props.end_angle -  this.props.start_angle <= 180 ? "0" : "1";
        
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
        
        return d;
    }
    
    render() {
        //console.log("drawing arc: " + this.props.start_angle + " -> " + this.props.end_angle)
        return (
            <path id="arc" className={this.props.class} fill={this.props.color} fillRule="evenodd" d={this.d}/>
        )   
    }
    
    componentDidMount(){
        // here we draw it..
        this.d = this.getPath()
    }
}
export default SectionItem;