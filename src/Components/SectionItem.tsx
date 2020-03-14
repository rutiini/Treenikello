import React from 'react';

interface IPathProps{
    cx: number;
    cy: number;
    radius: number;
    startAngle: number;
    endAngle: number;
    thickness: number;
}

interface IProps extends IPathProps{
    className: string,
    color: string
}

/** 
 * section item as a component TODO: refactor back to clock because path should always be a part of SVG 
 * and is not usable as a generic component.
 * */
const SectionItem: React.FC<IProps> = (props) => {
        const {className, color, ...others} = props;
        const pathString: string = getPath(others);
        return (
            <path id="arc" className={className} fill={color} fillRule="evenodd" d={pathString}/>
        )
}

function getPath(props: IPathProps){
        const {cx, cy, radius, startAngle, endAngle, thickness} = props;
    const start = polarToCartesian( cx,  cy,  radius,  endAngle);
    const end = polarToCartesian( cx,  cy,  radius,  startAngle);
    const largeArcFlag =  endAngle -  startAngle <= 180 ? "0" : "1";
    
    const cutoutRadius =  radius -  thickness
    const start2 = polarToCartesian( cx, cy, cutoutRadius,  endAngle)
    const end2 = polarToCartesian( cx,  cy, cutoutRadius,  startAngle)
    
    return [
        "M", start.x, start.y,
        "A",  radius,  radius, 0, largeArcFlag, 0, end.x, end.y,
        "L",  cx,  cy,
        "Z",
        "M", start2.x, start2.y,
        "A", cutoutRadius, cutoutRadius, 0, largeArcFlag, 0, end2.x, end2.y,
        "L",  cx,  cy,
        "Z"
    ].join(" ");
}

function polarToCartesian(centerX: number, centerY: number, radius: number, angleInDegrees: number) {
        
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    
    return {
        x: Number(centerX) + (radius * Math.cos(angleInRadians)),
        y: Number(centerY) + (radius * Math.sin(angleInRadians))
    };
}
export default SectionItem;