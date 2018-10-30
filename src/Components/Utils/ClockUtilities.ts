import { IExercise, ISection } from "src/DataInterfaces";



export default class ClockUtilities {


  /**
   * constants used for the calculations
   */
  public static readonly circleInDegrees = 360;
  public static readonly hourInMinutes = 60;
  public static readonly minuteInDegrees = ClockUtilities.circleInDegrees / ClockUtilities.hourInMinutes;

  // fix this, the last active section stays active even when the exercise should be finished
  /**
   * returns an int describing which section is currently active based on the time.
   * -1 means the exercise has not yet started, index == section array length means that
   * the exercise is over.
   */
  public static getActiveSectionIndex = (exercise: IExercise, currentTime: Date) => {

    const { startTime, defaultSections: sectionItems } = exercise;
    const currentPosition = ClockUtilities.timeToDegrees(currentTime); // "absolute minute position"
    const startPosition = ClockUtilities.timeToDegrees(startTime);

    const length = sectionItems.length
      ? sectionItems.map((a: ISection) => a.duration + a.setupTime).reduce((a: number, b: number) => a + b)*ClockUtilities.minuteInDegrees
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
        const sectionAngle = (sectionItems[i].duration + sectionItems[i].setupTime) * ClockUtilities.minuteInDegrees;
        if (angle <= currentPosition && currentPosition <= angle + sectionAngle) {
          index = i;
          break;
        }
        angle = angle + sectionAngle;
      }
      if (length && currentPosition >= (angle + (sectionItems[sectionItems.length - 1].duration + sectionItems[sectionItems.length - 1].setupTime) * ClockUtilities.minuteInDegrees)) {
        index++;
      }
    }

    return index;
  }

  /**
   * Transform the hours and minutes of a date object as degrees on a 360 degree circle where 1 minute is 6 degrees.
   * @param date A date object
   */
  public static timeToDegrees(date: Date) {
    return date.getMinutes() * ClockUtilities.minuteInDegrees + date.getHours() * ClockUtilities.circleInDegrees;
  }

  /**
   * transform time component of a date object to HH:mm string.
   * @param date date to transform
   */
  public static getTimeAsHHmmString(date: Date){
    if(!date){
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

}