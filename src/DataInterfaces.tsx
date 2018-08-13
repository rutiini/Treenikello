// this file contains all the commonly used data interfaces needed for the project

interface ISection {
  color: string
  description: string,
  duration: number,
  key: string,
  name: string,
}

interface IExercise {
  defaultSections: ISection[]
  name: string,
  preset: boolean,
  startTime: Date,
}


export { ISection, IExercise }