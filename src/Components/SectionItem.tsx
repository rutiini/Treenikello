import React, { PureComponent } from 'react';
import './Sectionitem.css'

interface IProps{
    cx: number,
    cy: number,
    radius: number,
    startAngle: number,
    endAngle: number,
    thickness: number,
    class: string,
    color: string
}

class SectionItem extends PureComponent<IProps> {
    
    public render() {
        const pathString: string = this.getPath();
        return (
            <path id="arc" className={this.props.class} fill={this.props.color} fillRule="evenodd" d={pathString}/>
        )   
    }
    
    
    private polarToCartesian(centerX: number, centerY: number, radius: number, angleInDegrees: number) {
        
        const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
        
        return {
            x: Number(centerX) + (radius * Math.cos(angleInRadians)),
            y: Number(centerY) + (radius * Math.sin(angleInRadians))
        };
    }

    private getPath(){
        
        const start = this.polarToCartesian( this.props.cx,  this.props.cy,  this.props.radius,  this.props.endAngle);
        const end = this.polarToCartesian( this.props.cx,  this.props.cy,  this.props.radius,  this.props.startAngle);
        const largeArcFlag =  this.props.endAngle -  this.props.startAngle <= 180 ? "0" : "1";
        
        const cutoutRadius =  this.props.radius -  this.props.thickness
        const start2 = this.polarToCartesian( this.props.cx, this.props.cy, cutoutRadius,  this.props.endAngle)
        const end2 = this.polarToCartesian( this.props.cx,  this.props.cy, cutoutRadius,  this.props.startAngle)
        
        return [
            "M", start.x, start.y,
            "A",  this.props.radius,  this.props.radius, 0, largeArcFlag, 0, end.x, end.y,
            "L",  this.props.cx,  this.props.cy,
            "Z",
            "M", start2.x, start2.y,
            "A", cutoutRadius, cutoutRadius, 0, largeArcFlag, 0, end2.x, end2.y,
            "L",  this.props.cx,  this.props.cy,
            "Z"
        ].join(" ");
    }
}
export default SectionItem;