import React, { Component } from 'react';
import './App.css';
import Clock from './Components/Clock';
import SectionInputBox from './Components/SectionInputBox';
import SectionInfo from './Components/SectionInfo';
import UniqueId from 'react-html-id';
import TimePicker from 'react-time-picker';

class App extends Component {
  
  sumAngle = 0;
  
  constructor(props){
    super(props);
    // modify exercises with new unique ids
    UniqueId.enableUniqueIds(this);
    
    const excercise1 = {
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
    }
    
    const excercise2 = {
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
      ]
    }
    // to componentwillmount
    this.state = {
      excercises: [excercise1,excercise2],
      selectedExerciseIndex: 0
    }
  }
  
  // make save button for custom exercises
  applySettings(){
    
  }
  
  /* Section manipulation */
  
  setActiveSection(sectionItem){
    // TODO: update can cause infinite loop, fix!
    // TODO: should be coordinates for the section instead of separate object
    if(sectionItem != null){
      this.setState({
        activeSection: sectionItem
      });
    }
    
  }
  
  // returns a section with generated key.
  createSection(name, description, duration,color, key){
    
    this.sumAngle = this.sumAngle + duration*6;
    
    const section = {
      key: key,
      name: name,
      duration: duration,
      color: color,
      description: description
    }
    return section;
  }
  
  updateSection(oldSection,newSection){
    
    const targetSectionIndex = this.state.excercises[this.state.selectedExerciseIndex].defaultSections.indexOf(oldSection);
    if(targetSectionIndex > -1){
      
      const newExcercise = this.state.excercises[this.state.selectedExerciseIndex];
      let newSections = newExcercise.defaultSections;
      
      newSections[targetSectionIndex] = newSection;
      newExcercise.defaultSections = newSections;
      const newExcercises = [...this.state.excercises]
      newExcercises[this.state.selectedExerciseIndex].defaultSections = newSections;

      this.setState(
        {
          excercises: newExcercises,
          selectedExercise: newExcercise
        }
        ,this.saveCustomExcercises()
      )
    }
  }
  
  reassignKeys = (itemArr,groupId) =>{
    let rekeyedArr = itemArr.map((item,index) => {
      item.key = groupId + `-${index}-` + this.nextUniqueId(groupId);
      return item;
    })
    return rekeyedArr;
  }
  
  addSection(){

    const prevSelectedExcercise = this.state.excercises[this.state.selectedExerciseIndex];
    if(prevSelectedExcercise.preset){
      // create new as a copy of the selected..
      console.log("template modified, create a new excercise based on the selected one!");
    }
    
    let section = this.createSection('Uusi osio','lisää sisältö',5,"lightblue",prevSelectedExcercise.name + 
    this.nextUniqueId())
    
    // rekey sections
    const newSections = this.reassignKeys([...prevSelectedExcercise.defaultSections,section],prevSelectedExcercise.name)
    console.log("adding: ", section);
    
    const newExcercises = [...this.state.excercises]
    newExcercises[this.state.selectedExerciseIndex].defaultSections = newSections;
    
    this.setState({
      excercises: newExcercises
      },() => {this.saveCustomExcercises()
        console.log(this.state.excercises)
        console.log(this.state.selectedExerciseIndex)
        }
    )
  }
  
  deleteSection(section){
    
    let newSections = [...this.state.excercises[this.state.selectedExerciseIndex].defaultSections];
    const index = newSections.indexOf(section);
    
    if(index > -1){

      newSections.splice(index,1);
      
      const newExcercise = {...this.state.excercises[this.state.selectedExerciseIndex],defaultSections: newSections};
      const newExcercises = [...this.state.excercises];
      newExcercises[this.state.selectedExerciseIndex] = newExcercise;
      
      this.setState( (prevState) =>
      {
        return {excercises: newExcercises}
      },this.saveCustomExcercises()
    );
    
    // update customs to local memory.
  }
}


moveSectionUp(section){
  const excercise = this.state.excercises[this.state.selectedExerciseIndex];
  const moveIndex = excercise.defaultSections.indexOf(section)
  // if section is first we cant move up any more.
  if(moveIndex > 0){
    let sections = excercise.defaultSections;
    // remove and readd section to new position..
    sections.splice(moveIndex,1);
    sections.splice(moveIndex - 1,0,section);
    // this.printSections(sections);
    const newExcercises = this.state.excercises;
    newExcercises[this.state.selectedExerciseIndex] = excercise;

    this.setState({
      excercises: newExcercises
    })
  }
}

moveSectionDown(section){
  const excercise = this.state.excercises[this.state.selectedExerciseIndex];
  const moveIndex = excercise.defaultSections.indexOf(section)
  // if section is last we cant move down any more.
  if(moveIndex < excercise.defaultSections.length - 1){
    let sections = excercise.defaultSections;
    // remove and readd section to new position..
    sections.splice(moveIndex,1);
    sections.splice(moveIndex + 1,0,section);
    
    const newExcercises = this.state.excercises;
    newExcercises[this.state.selectedExerciseIndex] = excercise;

    this.setState({
      excercises: newExcercises
    })
  }
}

/* helper functions */

applyCurrentTime = () => {
  const newExercise = this.state.excercises[this.state.selectedExerciseIndex];
  newExercise.startTime = new Date();
  this.setState({
    selectedExercise: newExercise
  })
}

timeChanged = (time) =>{
  console.log(time)
  if(time == null){
    time = "00:00";
  }
  const patt = /([0-2][0-9]):([0-5][0-9])/
  const timeComponents = patt.exec(time);
  const hours = timeComponents[1];
  const minutes = timeComponents[2];
  
  let newTime = this.state.excercises[this.state.selectedExerciseIndex].startTime;
  
  newTime.setHours(hours);
  newTime.setMinutes(minutes);
}

getExerciseIndex(excercises,identifier){
  return excercises.map(
    function(x){
      if(x !== undefined){
        return x.name
      }else{
        return "";
      }
    }
  ).indexOf(identifier);
}

// do a general id/key getter
getArrayElementIndex(array,id){
  return array.map(
    function(x){
      return x.id
    }
  ).indexOf(id);
}
// just for debugging stuff
printSections = (sections) => {
  sections.map((section,index) => {
    console.log(`pos: ${index} name: ${section.name} color: ${section.color} duration: ${section.duration}`);
    return true;
  })
}

selectExercise = (e) =>{
  // combobox selection should update state with new exercise
  const arrayIndex = this.getExerciseIndex(this.state.excercises,e.target.value)
  if(arrayIndex > -1){
    
    console.log("selected ", this.state.excercises[arrayIndex]);
    
    this.setState(
      {
        selectedExerciseIndex: arrayIndex
      }
    )
  }else{
    console.log("add new exercise requested.")
    this.newExcercise();
  }
}

// start a new custom exercise. Later create a copy based on the previously selected exercise?
newExcercise = () => {
  
  let reservedNames = this.state.excercises.map( excercise => {
    if(excercise !== undefined){
      return excercise.name;
    }else{
      return null;
    }
  }) 
  
  let name = ""
  
  while(true){
    name = prompt("Enter excercise name: ", "");
    if(name === ""){
      alert("enter a name");
    }else if(name == null){
      // canceled
      return;
    }else if(reservedNames.indexOf(name) === -1){
      break;
    }else{
      alert("Name already exists!");
    }
  }
  
  const newExcercise = 
  {
    name: name,
    startTime: new Date(),
    preset: false,
    defaultSections: []
  }
  
  let newExercises = [...this.state.excercises, newExcercise];
  
  let customs = 
  [
    newExcercise,
  ]
  this.saveCustomExcercises(customs)
  
  // add and select the new excercise
  this.setState({
    ...this.state,
    excercises: newExercises,
    selectedExerciseIndex: newExercises.length - 1
  }) 
}

// get saved excercises from browser cache
getSavedExcercises = () =>{
  const customsJSON = localStorage.customExcercises;
  if(customsJSON !== undefined){
    let customs = JSON.parse(customsJSON);
    if(customs === undefined || customs == null){
      console.log("local storage corrupted. clearing cached data.")
      localStorage.clear();
      return null;
    }
    
    console.log("custom excercises: ", customs);
    // need to parse the date objects sepaprately
    for(let i = 0; i < customs.length; i++){
      customs[i].startTime = new Date(customs[i].startTime);
      console.log(customs[i]);
      
    }
    return customs;
  }
}
// save users custom excercises to browser cache
saveExcercises = () =>{
  const excercises = this.state.excercises;
  const nonPresets = excercises.filter((x) => {return x.preset !== true;})
  localStorage.setItem("customExcercises",JSON.stringify(nonPresets));
}
deleteExcercise = () => {
  const newExcercises = [...this.state.excercises];
  if(!newExcercises[this.state.selectedExerciseIndex].preset){
    console.log(`deleting excercise ${newExcercises[this.state.selectedExerciseIndex].name}`)
  }
}

// updates the locally stored excercises
saveCustomExcercises = () =>{
  const excercises = this.state.excercises;
  const nonPresets = excercises.filter((x) => {return x.preset !== true;})
  sessionStorage.setItem("customExcercises",JSON.stringify(nonPresets));
}
// returns an array of the locally stored excercises
getCustomExcercises = () => {
  const customsJSON = sessionStorage.customExcercises;
  if(customsJSON !== undefined){
    let customs = JSON.parse(customsJSON);
    if(customs === undefined || customs == null){
      console.log("local storage corrupted. clearing cached data.")
      sessionStorage.clear();
      return null;
    }
    
    console.log("custom excercises: ", customs);
    // need to parse the date objects sepaprately
    for(let i = 0; i < customs.length; i++){
      customs[i].startTime = new Date(customs[i].startTime);
      console.log(customs[i]);
      
    }
    return customs;
  }
}

// use as callback for setState
updateSectionInputBoxes = () => {
  
  this.currentSections = this.state.excercises[this.state.selectedExerciseIndex].defaultSections.map((sectionItem,index) => {
    let inputBoxKey = sectionItem.key;
    // console.log("input key:" + inputBoxKey + " name " + sectionItem.name)
    return <SectionInputBox key={inputBoxKey} id={inputBoxKey} name={sectionItem.name} section={sectionItem} remove={this.deleteSection.bind(this)} update={this.updateSection.bind(this)} moveUp={this.moveSectionUp.bind(this)} moveDown={this.moveSectionDown.bind(this)}/>
    
  })
}

updateExercisePresets = () => {
  this.exercisePresets = this.state.excercises.map((excercise,index) => {
    // we should not have undefined excercises in the memory
    if(excercise !== undefined){
      // console.log(`excercise  added to menu `, excercise)
      return <option key={index} value={excercise.name}>{excercise.name}</option>
    }else{
      return null;
    }
  })
  this.exercisePresets.push(<option key="addNewExcercise">+new exercise</option>)
}

/* Lifecycle hools */

componentWillMount(){
  // have a state container which handles all the available saved presets
  
  // assign proper keys to exercises
  let newExcercises = this.state.excercises.map(exercise => {
    // need to restart sequence under each exercise
    let rekeyedSections = this.reassignKeys(exercise.defaultSections,exercise.name);
    exercise.defaultSections = rekeyedSections;
    return exercise;
  })
  
  // add excercises that the user has created locally
  let customExcercises = this.getCustomExcercises();
  if(customExcercises !== null && customExcercises !== undefined && customExcercises.length > 0){
    console.log(`adding ${customExcercises.length} custom excercises to list`)
    newExcercises = newExcercises.concat(customExcercises);
  }
  
  this.setState(
    {
      excercises: newExcercises
    }
  )
  
  this.updateExercisePresets();
}

// specify the correct props and state for this! recieves old and new props?!
componentWillUpdate(nextProps, nextState){
  // updating sectioninput boxes should be called here
  console.log("App: componentWillUpdate ran");
}

render() {
  // move to componentWillUpdate or componentWillrecieveprops?
  console.log("rerendering app", new Date())
  this.updateExercisePresets();
  this.updateSectionInputBoxes();
  
  return (
    <div className="App">
    <SectionInfo activeSection={this.state.activeSection}/>
    <Clock id="clock" sectionItems={this.state.excercises[this.state.selectedExerciseIndex].defaultSections} startTime={this.state.excercises[this.state.selectedExerciseIndex].startTime} canvasSide="100" activeSection={this.state.activeSection} setActive={this.setActiveSection.bind(this)}/>
    <div id="SettingsContainer">
    <div className="GeneralSettingsContainer">
    <span>aloitus:</span>
    <div id="StartTimePicker" className="SettingsControlTime">
    <TimePicker id="TimeInput" value={this.state.excercises[this.state.selectedExerciseIndex].startTime} onChange={this.timeChanged}/>
    </div>
    {/* <div id="ApplyBtn" className="SettingsControl" value="apply" onClick={this.applySettings.bind(this)}>Aseta</div> */}
    <div id="QuickStartBtn" className="SettingsControl" onClick={this.applyCurrentTime}><span>Aloita nyt</span></div>
    <span>treeni:</span>
    <select id="ExcerciseSelector" className="SettingsCombox" name="selectExcercise" value={this.state.excercises[this.state.selectedExerciseIndex].name} onChange={this.selectExercise}>
    {this.exercisePresets}
    </select>
    <div className="SettingsControl SettingsBtn" onClick={this.saveExcercises}>save</div>
    <div className="SettingsControl SettingsBtn" onClick={this.deleteExcercise}>delete</div>
    </div>
    <div className="ConfigBox" id="App-configbox">
    {this.currentSections}
    <div className="NewSection" id="AddSection" onClick={this.addSection.bind(this)}><div className="NewSectionContent">new</div></div>
    </div>
    </div>
    </div>
  );
}
}

export default App;
