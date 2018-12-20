﻿import { IExercise, ISection } from "src/DataInterfaces";
import { TimerMode } from "../Clock";

// export default class ClockUtilities {


  /**
   * constants used for the calculations
   */
  export const CircleInDegrees = 360;
  export const HourInMinutes = 60;
  export const MinuteInDegrees = CircleInDegrees / HourInMinutes;

  // fix this, the last active section stays active even when the exercise should be finished
  /**
   * returns an int describing which section is currently active based on the time.
   * -1 means the exercise has not yet started, index == section array length means that
   * the exercise is over.
   */
  export function GetActiveSectionIndex(exercise: IExercise, currentTime: Date) {

    const { startTime, defaultSections: sectionItems } = exercise;
    const currentPosition = TimeToDegrees(currentTime); // "absolute minute position"
    const startPosition = TimeToDegrees(startTime);

    const length = sectionItems.length
      ? sectionItems.map((a: ISection) => a.duration + a.setupTime).reduce((a: number, b: number) => a + b) * MinuteInDegrees
      : 0;

    const endPosition = startPosition + length;
    let angle = startPosition;
    let index = -1;

    if (startPosition > currentPosition) {
      return index;
    } else if (endPosition < currentPosition) {
      return sectionItems.length;
    }
    else {
      for (let i = 0; i < sectionItems.length; i++) {
        const sectionAngle = (sectionItems[i].duration + sectionItems[i].setupTime) * MinuteInDegrees;
        if (angle <= currentPosition && currentPosition <= angle + sectionAngle) {
          index = i;
          break;
        }
        angle = angle + sectionAngle;
      }
      if (length && currentPosition >= (angle + (sectionItems[sectionItems.length - 1].duration + sectionItems[sectionItems.length - 1].setupTime) * MinuteInDegrees)) {
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
    return date.getMinutes() * MinuteInDegrees + date.getHours() * CircleInDegrees;
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
    const startAsString = `${HHString}:${mmString}`
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
  
  constructor(date: Date){
    this.date = date;
  }

  public UpdateDate(date: Date){
    this.date = date;
  }

  public getHourPosition(){
    return 30 * (this.date.getHours() % 12) + this.date.getMinutes() / 2;
  }
  public getMinutePosition(){
    return MinuteInDegrees * this.date.getMinutes();
  }
  public getSecondPosition(){
    return MinuteInDegrees * this.date.getSeconds();
  }
}