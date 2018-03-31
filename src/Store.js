// session / localstorage functionality
class Store{
  
  // get saved exercises from browser cache
  getSavedExercises = () =>{
    const customsJSON = localStorage.customExercises;
    if(customsJSON !== undefined){
      let customs = JSON.parse(customsJSON);
      if(customs === undefined || customs == null){
        console.log("local storage corrupted. clearing cached data.")
        localStorage.clear();
        return null;
      }
      
      // need to parse the date objects sepaprately
      for(let i = 0; i < customs.length; i++){
        customs[i].startTime = new Date(customs[i].startTime);
        
      }
      return customs;
    }
  }
  
  // save users custom exercises to browser cache
  saveExercises = (exercises) =>{
    const nonPresets = exercises.filter((x) => {return x.preset !== true;})
    console.log(`saving ${nonPresets.length} exercises`)
    localStorage.setItem("customExercises",JSON.stringify(nonPresets));
  }
  
  // updates the locally stored exercises
  saveSessionExercises = (exercises) =>{
    const nonPresets = exercises.filter((x) => {return x.preset !== true;})
    sessionStorage.setItem("customExercises",JSON.stringify(nonPresets));
  }
  
  // returns an array of the locally stored exercises
  getSessionExercises = () => {
    let customsJSON = sessionStorage.customExercises;
    if(customsJSON === undefined){
      console.log("sessionStorage is empty. checking localStorage");
      customsJSON = localStorage.customExercises;
    }
    
    if(customsJSON !== undefined){
      let customs = JSON.parse(customsJSON);
      if(customs === undefined || customs == null){
        console.log("local storage corrupted. clearing cached data.")
        sessionStorage.clear();
        return null;
      }
      
      // need to parse the date objects sepaprately
      for(let i = 0; i < customs.length; i++){
        customs[i].startTime = new Date(customs[i].startTime);
        // console.log(customs[i]);
      }
      console.log("store: found custom exercises: ", customs);
      return customs;
    }
    
  }
  
  // not necessary, we only load and save in the store, state management is in the app (for now)
  // deleteexercise = () => {
  //   const newExercises = [...this.state.exercises];
  //   if(!newExercises[this.state.selectedExerciseIndex].preset){
  //     // set selected to first in list (presets should always exist)
  //     const deleteIndex = this.state.selectedExerciseIndex;
  //     this.setState({
  //       selectedExerciseIndex: 0
  //     })
  //     console.log(`deleting exercise ${newExercises[deleteIndex].name}`)
  //     console.log(`exercises left:`,newExercises.splice(deleteIndex,1))
  
  //     this.setState(
  //       {
  //         exercises: newExercises
  //       }
  //     )
  //   }
  // }
  
}

const store = new Store({});
export default store;

export const exercises = [
  {
    name: "Taidotreenit",
    startTime: new Date(2018,1,1,18,30),
    preset: true,
    defaultSections: [
      {
        key: "unassigned",
        name: 'Alkulämmittely',
        duration: 10,
        color: "#1b85b8",
        description: 'nilkat lämpimiksi, käsipallo'
      },
      {
        key: "unassigned",
        name: 'Alkuvenyttely',
        duration: 5,
        color: "#559e83",
        description: 'erityisesti jalat vetreiksi'
      },
      {
        key: "unassigned",
        name: 'Tengi',
        duration: 10,
        color: "#ae5a41",
        description: 'kokeilkaa uutta korkeaa'
      },
      {
        key: "unassigned",
        name: 'Päivän aihe',
        duration: 20,
        color: "#c3cb71",
        description: 'perustekniikkaa'
      },
      {
        key: "unassigned",
        name: 'Loppujumppa',
        duration: 15,
        color: "#5a5255",
        description: 'intervallit mitseihin täysillä'
      }
    ]
  },
  {
    name: "Intervallitreeni",
    startTime: new Date(2018,1,1,17,30),
    preset: true,
    defaultSections: [
      {
        key: "unassigned",
        name: 'Sarja',
        duration: 5,
        color: "#ae5a41",
        description: 'kyykyt'
      },
      {
        key: "unassigned",
        name: 'tauko',
        duration: 5,
        color: "#559e83",
        description: 'lepoa'
      },
      {
        key: "unassigned",
        name: 'Sarja',
        duration: 5,
        color: "#ae5a41",
        description: 'vatsat'
      },
      {
        key: "unassigned",
        name: 'tauko',
        duration: 5,
        color: "#559e83",
        description: 'lepoa'
      },
      {
        key: "unassigned",
        name: 'Sarja',
        duration: 5,
        color: "#ae5a41",
        description: 'punnerrukset'
      },
      {
        key: "unassigned",
        name: 'tauko',
        duration: 5,
        color: "#559e83",
        description: 'lepoa'
      },
    ],
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