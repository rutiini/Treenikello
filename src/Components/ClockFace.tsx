import { createStyles, Theme, WithStyles, withStyles } from "@material-ui/core";
import React from "react";
import { TimerMode } from "./Clock";
import StopWatchHand from "./StopWatchHand";
import { ClockData } from "./Utils/ClockUtilities";

interface IClockFaceProps {
  classes: {
    bigHourMarker: string,
    clock: string,
    face: string,
    faceCover: string,
    hourMin: string,
    hourMarker: string,
    midPoint: string,
    minuteMarker: string
  },
  readonly clockData: ClockData,
  readonly centerCoordinate: number,
  readonly sectionItems: ReadonlyArray<JSX.Element>,
  readonly stopWatchRotation: number,
  readonly timerMode: TimerMode
}
const styles = (theme: Theme) => createStyles({
  bigHourMarker: {
    stroke: theme.palette.action.active,
    strokeWidth: 2
  },
  clock: {
    height: "45vh",
    [theme.breakpoints.between("md", "xl")]: {
      height: "99vh",
      width: "49vw",
    }
  },
  face: {
    fill: '#000000',
    stroke: '#bebebe',
    strokeWidth: 2,
  },
  faceCover: {
    fill: '#000000',
  },
  hourMarker: {
    stroke: theme.palette.action.active,
    strokeWidth: 1
  },
  hourMin: {
    fill: theme.palette.secondary.main,
    stroke: theme.palette.action.active,
    strokeWidth: 1,
  },
  midPoint: {
    fill: theme.palette.action.active,
  },
  minuteMarker: {
    stroke: theme.palette.action.active,
    strokeWidth: 1,
  }
})


const ClockFace: React.SFC<IClockFaceProps & WithStyles> = (props: IClockFaceProps) => {
  const majors: JSX.Element[] = [];
  const { classes } = props;

for (let i = 0; i < 60; i++) {
  // the "big hours"
  if (i % 15 === 0) {
    majors.push(createMarker(i, 5, classes.bigHourMarker))
  }
  // lesser markers
  else if (i % 5 === 0) {
    majors.push(createMarker(i, 5, classes.hourMarker))
  }
  // minutes
  else {
    majors.push(createMarker(i, 3, classes.minuteMarker))
  }
}

function createMarker(position: number, length: number, className: string) {
  const canvasSide: number = 100;
  const centerCoordinate = 100 / 2;
  const faceRadius = 100 / 2 - (100 / 20);
  // lets not render too many objects here
  if (position >= 60) {
    throw new DOMException("too many minutemarkers for this clock");
  }
  const idTag = "marker" + position;
  const y1 = canvasSide / 2 - faceRadius + length;
  const y2 = canvasSide / 2 - faceRadius + 0.9; // slight overlap (0.1) and stroke width..
  const rotation = `rotate(${position * 6} 50 50)`;
  return (<line key={idTag} id={idTag} className={className} x1={centerCoordinate} y1={y1} x2={centerCoordinate} y2={y2} transform={rotation} />)
}

  return <svg id="clock" className={classes.clock} viewBox="0 0 100 100">
    {/* TODO: remove a bunch of magic numbers, make stuff rescalable. */}
    <circle
      className={classes.face}
      cx={props.centerCoordinate}
      cy={props.centerCoordinate}
      r={45} />
    {props.sectionItems}
    <circle
      className={classes.faceCover}
      cx={props.centerCoordinate}
      cy={props.centerCoordinate}
      r={41} />
    <g id="minuteMarkers">
      {majors}
    </g>
    <g id="hands">
      <rect
        transform={`rotate(${props.clockData.getHourPosition()} ${props.centerCoordinate} ${props.centerCoordinate})`}
        id="hour"
        className={classes.hourMin}
        x={48.5}
        y={22.5}
        width={3}
        height={30}
        rx={2.5}
        ry={2.55}
        fill="red" />
      <rect
        transform={`rotate(${props.clockData.getMinutePosition()} ${props.centerCoordinate} ${props.centerCoordinate})`}
        id="min"
        className={classes.hourMin}
        x={49}
        y={12.5}
        width={2}
        height={40}
        rx={2}
        ry={2}
        fill="blue" />
      <StopWatchHand
        x1={props.centerCoordinate}
        y1={props.centerCoordinate}
        x2={props.centerCoordinate}
        y2={14}
        y3={12}
        rotation={props.stopWatchRotation * 3}
        visible={0 < props.timerMode}
        color="yellow"
        tipColor="red" />
      <g
        transform={`rotate(${props.clockData.getSecondPosition()} ${props.centerCoordinate} ${props.centerCoordinate})`}
        id="secHand">
        <line
          id="sec"
          x1={props.centerCoordinate}
          y1={props.centerCoordinate}
          x2={props.centerCoordinate}
          y2={11}
          stroke="white" />
      </g>;
  </g>
    <circle
      className={classes.midPoint}
      cx={props.centerCoordinate}
      cy={props.centerCoordinate}
      r={3} />
  </svg>
}

export default withStyles(styles)(ClockFace);