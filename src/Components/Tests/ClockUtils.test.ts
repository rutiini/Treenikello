import { IExercise } from 'src/DataInterfaces';
import ClockUtilities from '../Utils/ClockUtilities';

/**
 * some helper data for the tests
 */

/**
 * bad data for error handling testing
 */
// tslint:disable-next-line:prefer-const
let nullDate: Date;

/**
 * Exercise object with convenient time markers
 */
const testExercise: IExercise = {
  defaultSections: [
    {
      color: "#1b85b8",
      description: 'nilkat lämpimiksi, käsipallo',
      duration: 8,
      key: "unassigned",
      name: 'Alkulämmittely',
      setupTime: 2
    },
    {
      color: "#559e83",
      description: 'erityisesti jalat vetreiksi',
      duration: 5,
      key: "unassigned",
      name: 'Alkuvenyttely',
      setupTime: 5
    },
    {
      color: "#ae5a41",
      description: 'kokeilkaa uutta korkeaa',
      duration: 15,
      key: "unassigned",
      name: 'Tengi',
      setupTime: 0
    },
    {
      color: "#c3cb71",
      description: 'perustekniikkaa',
      duration: 20,
      key: "unassigned",
      name: 'Päivän aihe',
      setupTime: 5
    },
    {
      color: "#5a5255",
      description: 'intervallit mitseihin täysillä',
      duration: 15,
      key: "unassigned",
      name: 'Loppujumppa',
      setupTime: 0
    }
  ],
  name: "Taidotreenit",
  preset: true,
  startTime: new Date(2018, 1, 1, 18, 30)
}

/**
 * simple testing for the time to degrees transformation
 */
test(`transform time to degrees`,
  () => {
    expect(ClockUtilities.timeToDegrees(new Date(0, 0, 0, 0, 1)))
      .toEqual(6)

// transform 1 hour 1 minute to degrees as seconds
    expect(ClockUtilities.timeToDegrees(new Date(0, 0, 0, 1, 1)))
      .toEqual(366)

// transform 23 hours 59 minutes to degrees as seconds
    expect(ClockUtilities.timeToDegrees(new Date(0, 0, 0, 23, 59)))
      .toEqual(23 * 360 + 354)

// transform 0 minutes to degrees as seconds
    expect(ClockUtilities.timeToDegrees(new Date(0, 0, 0, 0, 0)))
      .toEqual(0)

// transform 59 seconds to degrees as seconds, seconds should not matter
    expect(ClockUtilities.timeToDegrees(new Date(0, 0, 0, 0, 0, 59)))
      .toEqual(0)
  });

test(`current time is before the exercise (< 18:30)`,
  () =>
    expect(ClockUtilities.getActiveSectionIndex(testExercise, new Date(0, 0, 0, 18, 0)))
      .toEqual(-1));

test(`current time is during the exercise, returns correct section`,
  () =>{
// current time is during the first section of the exercise (18:0 - 18:39)
    expect(ClockUtilities.getActiveSectionIndex(testExercise, new Date(0, 0, 0, 18, 35)))
      .toEqual(0)

// current time is during the second section of the exercise (18:40 - 18:49)
    expect(ClockUtilities.getActiveSectionIndex(testExercise, new Date(0, 0, 0, 18, 41)))
      .toEqual(1)

// current time is during the third section of the exercise (18:50 - 19:04)
    expect(ClockUtilities.getActiveSectionIndex(testExercise, new Date(0, 0, 0, 19, 4)))
      .toEqual(2)

// current time is during the fourth section of the exercise (19:05 - 19:29)
    expect(ClockUtilities.getActiveSectionIndex(testExercise, new Date(0, 0, 0, 19, 5)))
      .toEqual(3)

// current time is during the last section of the exercise (19:30 - 19:45)
    expect(ClockUtilities.getActiveSectionIndex(testExercise, new Date(0, 0, 0, 19, 21)))
      .toEqual(4)
  });

test(`current time is after the end of the last minute of the last section of the exercise`,
  () =>
    expect(ClockUtilities.getActiveSectionIndex(testExercise, new Date(0, 0, 0, 20, 45)))
      .toEqual(5));

test(`test for date to HH:mm transformation`,
  () =>{

    expect(ClockUtilities.getTimeAsHHmmString(new Date(0, 0, 0, 20, 45)))
      .toEqual("20:45")

    expect(ClockUtilities.getTimeAsHHmmString(new Date(0, 0, 0, 0, 0)))
      .toEqual("00:00")
  });

/**
 * test bad input handling
 */
test(`test for null date to HH:mm transformation`,
  () =>
    expect(() => ClockUtilities.getTimeAsHHmmString(nullDate))
      .toThrow("Cannot transform time from null"));