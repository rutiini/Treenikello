import { IExercise, ISection, ExerciseStatus } from "../DataInterfaces";
import { TimerMode } from "../Components/Clock";
import { useEffect, useRef } from "react";

export interface IPathProps {
  cx: number;
  cy: number;
  radius: number;
  startAngle: number;
  endAngle: number;
  thickness: number;
}

/** Custom hook from an example blog post to handle intervals */
export function useInterval(
  callback: (params?: object[]) => unknown,
  delay: number,
) {
  const savedCallback = useRef(callback);

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    const id = setInterval(tick, delay);
    return () => clearInterval(id);
  }, [delay]);
}
/**
 * constants used for the calculations
 */
export const CircleInDegrees = 360;
export const HourInMinutes = 60;
export const MinuteInDegrees = CircleInDegrees / HourInMinutes;

// TODO: fix this, the last active section stays active even when the exercise should be finished
/**
 * returns an int describing which section is currently active based on the time given,
 * exercise start time and section durations and order.
 * -1 means the exercise has not yet started, index == section array length means that
 * the exercise is over.
 * @param exercise excercise data
 * @param currentTime time to calculate the active section index from
 */
export function GetActiveSectionIndex(
  exercise: IExercise,
  currentTime: Date,
): ExerciseStatus {
  const { startTime, defaultSections: sectionItems } = exercise;
  const currentPosition = TimeToDegrees(currentTime); // "absolute minute position"
  const startPosition = TimeToDegrees(startTime);

  const length = sectionItems.length
    ? sectionItems
        .map((a: ISection) => a.duration + a.setupTime)
        .reduce((a: number, b: number) => a + b) * MinuteInDegrees
    : 0;

  const endPosition = startPosition + length;
  let angle = startPosition;
  let index = -1;

  if (startPosition > currentPosition) {
    return "PreExercise"; // index;
  } else if (endPosition < currentPosition) {
    return "PostExercise"; // sectionItems.length;
  } else {
    for (let i = 0; i < sectionItems.length; i++) {
      const sectionAngle =
        (sectionItems[i].duration + sectionItems[i].setupTime) *
        MinuteInDegrees;
      if (angle <= currentPosition && currentPosition <= angle + sectionAngle) {
        index = i;
        break;
      }
      angle = angle + sectionAngle;
    }
    // TODO: find out what this is.. --> post-exercise?
    if (
      length &&
      currentPosition >=
        angle +
          (sectionItems[sectionItems.length - 1].duration +
            sectionItems[sectionItems.length - 1].setupTime) *
            MinuteInDegrees
    ) {
      index++;
    }
  }

  return index;
}

/**
 * Transform the hours and minutes of a date object as degrees on a 360 degree circle where 1 minute is 6 degrees.
 * @param date A date object
 */
export function TimeToDegrees(date: Date) {
  return (
    date.getMinutes() * MinuteInDegrees + date.getHours() * CircleInDegrees
  );
}

/**
 * transform time component of a date object to HH:mm string.
 * @param date date to transform
 */
export function GetTimeAsHHmmString(date: Date) {
  if (!date) {
    throw new Error("Cannot transform time from null");
  }
  // TODO: clean this mess up?
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const HHString = hours < 10 ? `0${hours}` : hours;
  const mmString = minutes < 10 ? `0${minutes}` : minutes;
  const startAsString = `${HHString}:${mmString}`;
  return startAsString;
}

export function CycleTimerMode(currentState: TimerMode): TimerMode {
  switch (currentState) {
    case TimerMode.Hidden:
      return TimerMode.Ready;
    case TimerMode.Ready:
      return TimerMode.Running;
    case TimerMode.Running:
      return TimerMode.Finished;
    case TimerMode.Finished:
      return TimerMode.Hidden;
  }
}

/** simple interface for containing all the clock drawing data */
export class ClockData {
  private date: Date;

  constructor(date: Date) {
    this.date = date;
  }

  public UpdateDate(date: Date) {
    this.date = date;
  }

  public getHourPosition() {
    return 30 * (this.date.getHours() % 12) + this.date.getMinutes() / 2;
  }
  public getMinutePosition() {
    return MinuteInDegrees * this.date.getMinutes();
  }
  public getSecondPosition() {
    return MinuteInDegrees * this.date.getSeconds();
  }
}

export function getPath(props: IPathProps) {
  const {cx, cy, radius, startAngle, endAngle, thickness} = props;
  const start = polarToCartesian( cx,  cy,  radius,  endAngle);
  const end = polarToCartesian( cx,  cy,  radius,  startAngle);
  const largeArcFlag =  endAngle -  startAngle <= 180 ? "0" : "1";

  const cutoutRadius =  radius -  thickness;
  const start2 = polarToCartesian( cx, cy, cutoutRadius,  endAngle);
  const end2 = polarToCartesian( cx,  cy, cutoutRadius,  startAngle);

  return [
  "M", start.x, start.y,
  "A",  radius,  radius, 0, largeArcFlag, 0, end.x, end.y,
  "L",  cx,  cy,
  "Z",
  "M", start2.x, start2.y,
  "A", cutoutRadius, cutoutRadius, 0, largeArcFlag, 0, end2.x, end2.y,
  "L",  cx,  cy,
  "Z",
].join(" ");
}

function polarToCartesian(centerX: number, centerY: number, radius: number, angleInDegrees: number) {

const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;

return {
  x: Number(centerX) + (radius * Math.cos(angleInRadians)),
  y: Number(centerY) + (radius * Math.sin(angleInRadians)),
};
}
