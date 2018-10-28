import { IExercise } from "./DataInterfaces";

// session / localstorage functionality
class Store{
  
  // get saved exercises from browser cache
  public getSavedExercises = () =>{
    const customsJSON = localStorage.getItem("customExercises");
    if(customsJSON !== undefined){
      const customs : IExercise[] = JSON.parse(customsJSON as string);
      if(customs === null){
        return null;
      }
      if(customs === undefined){
        console.log(`local storage value was ${customs}. clearing cached data.`)
        localStorage.clear();
        return null;
      }

      customs.map( (customExercise : IExercise) => {
        customExercise.startTime = new Date(customExercise.startTime);
      })

      return customs;
    }

    return null;
  }
  
  // save users custom exercises to browser cache
  public saveExercises = (modifiedExercises : IExercise[]) =>{

    const nonPresets = modifiedExercises.filter((x : IExercise) => x.preset !== true)
    console.log(`saving ${nonPresets.length} exercises`)
    localStorage.setItem("customExercises",JSON.stringify(nonPresets));
  }
  
  // use session storage only for caching
  public saveSessionExercises = (sessionExercises : IExercise[]) =>{

    const nonPresets = sessionExercises.filter((x) => x.preset !== true)
    sessionStorage.setItem("customExercises",JSON.stringify(nonPresets));
  }
  
  // returns an array of the locally stored exercises
  public getSessionExercises = () => {
    let customsJSON = sessionStorage.getItem("customExercises");
    if(customsJSON === undefined){
      console.log("sessionStorage is empty. checking localStorage");
      customsJSON = localStorage.getItem("customExercises");
    }
    
    if(customsJSON !== undefined){
      const customs = JSON.parse(customsJSON as string);
      if(customs === undefined || customs == null){
        console.log("local storage corrupted. clearing cached data.")
        sessionStorage.clear();
        return null;
      }
      
      customs.map( (customExercise : IExercise) => {
        customExercise.startTime = new Date(customExercise.startTime);
      })

      console.log("store: found custom exercises: ", customs);
      return customs;
    }
    
    return null;
  }
  
}

const store = new Store();
export default store;

export const exercises : IExercise[] = [
  {
    defaultSections: [
      {
        color: "#1b85b8",
        description: 'nilkat lämpimiksi, käsipallo',
        duration: 10,
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
        setupTime: 2
      },
      {
        color: "#ae5a41",
        description: 'kokeilkaa uutta korkeaa',
        duration: 10,
        key: "unassigned",
        name: 'Tengi',
        setupTime: 2
      },
      {
        color: "#c3cb71",
        description: 'perustekniikkaa',
        duration: 20,
        key: "unassigned",
        name: 'Päivän aihe',
        setupTime: 2
      },
      {
        color: "#5a5255",
        description: 'intervallit mitseihin täysillä',
        duration: 15,
        key: "unassigned",
        name: 'Loppujumppa',
        setupTime: 2
      }
    ],
    name: "Taidotreenit",
    preset: true,
    startTime: new Date(2018,1,1,18,30)
  },
  {
    defaultSections: [
      {
        color: "#ae5a41",
        description: 'kyykyt',
        duration: 5,
        key: "unassigned",
        name: 'Sarja',
        setupTime: 2
      },
      {
        color: "#559e83",
        description: 'lepoa',
        duration: 5,
        key: "unassigned",
        name: 'tauko',
        setupTime: 2
      },
      {
        color: "#ae5a41",
        description: 'vatsat',
        duration: 5,
        key: "unassigned",
        name: 'Sarja',
        setupTime: 2
      },
      {
        color: "#559e83",
        description: 'lepoa',
        duration: 5,
        key: "unassigned",
        name: 'tauko',
        setupTime: 2
      },
      {
        color: "#ae5a41",
        description: 'punnerrukset',
        duration: 5,
        key: "unassigned",
        name: 'Sarja',
        setupTime: 2
      },
      {
        color: "#559e83",
        description: 'lepoa',
        duration: 5,
        key: "unassigned",
        name: 'tauko',
        setupTime: 2
      },
    ],
    name: "Intervallitreeni",
    preset: true,
    startTime: new Date(2018,1,1,17,30)
  }
]
export const colorOptions = 
[
  // {"colorName":"none","colorValue":"none"},
  // {"colorName":"dark blue","colorValue":"#1b85b8"},
  // {"colorName":"dark grey","colorValue":"#5a5255"},
  // {"colorName":"dark green","colorValue":"#559e83"},
  // {"colorName":"dark red","colorValue":"#ae5a41"},
  // {"colorName":"olive green","colorValue":"#c3cb71"},
  {"colorName":"red","colorValue":"#ee4035"},
  {"colorName":"orange","colorValue":"#f37736"},
  {"colorName":"yellow","colorValue":"#fdf498"},
  {"colorName":"green","colorValue":"#7bc043"},
  {"colorName":"blue","colorValue":"#0392cf"},
]
/*
// original color palette
[
  {"colorName":"none","colorValue":"none"},
  {"colorName":"dark blue","colorValue":"#1b85b8"},
  {"colorName":"dark grey","colorValue":"#5a5255"},
  {"colorName":"dark green","colorValue":"#559e83"},
  {"colorName":"dark red","colorValue":"#ae5a41"},
  {"colorName":"olive green","colorValue":"#c3cb71"},
]
// brighter color palette (rainbow dash)
[
  {"colorName":"none","colorValue":"none"},
  {"colorName":"red","colorValue":"#ee4035"},
  {"colorName":"orange","colorValue":"#f37736"},
  {"colorName":"yellow","colorValue":"#fdf498"},
  {"colorName":"green","colorValue":"#7bc043"},
  {"colorName":"blue","colorValue":"#0392cf"},
]
// alternative pastel colors (beach)
[
  {"colorName":"none","colorValue":"none"},
  {"colorName":"grass","colorValue":"#ffeead"},
  {"colorName":"sand","colorValue":"#f37736"},
  {"colorName":"salmon","colorValue":"#ff6f69"},
  {"colorName":"pine","colorValue":"#ffcc5c"},
  {"colorName":"algae","colorValue":"#88d8b0"},
]
*/