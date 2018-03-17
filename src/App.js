import React, { Component } from 'react';
import './App.css';
import Clock from './Components/Clock';
import SectionInputBox from './Components/SectionInputBox';
import SectionInfo from './Components/SectionInfo';
import UniqueId from 'react-html-id';
import SectionListItem from './Components/SectionListItem';
import store, {exercises} from './Store';
// MUI stuff
import TimeInput from 'material-ui-time-picker'
import Button from 'material-ui/Button';
import Input from 'material-ui/Input';
import { FormControl } from 'material-ui/Form';
import Select from 'material-ui/Select';
import EditSectionForm from './Components/EditSectionForm';

class App extends Component {
  
  sumAngle = 0;
  
  constructor(props){
    super(props);
    // modify exercises with new unique ids
    UniqueId.enableUniqueIds(this);
    
    // to componentwillmount
    this.state = {
      exercises: exercises,
      selectedExerciseIndex: 0
    }
  }
  
  /* Section manipulation */
  
  setActiveSection(sectionItem){
    // TODO: should be coordinates for the section instead of separate object
    if(sectionItem != null){
      this.setState({
        activeSection: sectionItem
      });
    }
    
  }
  
  // returns a section with generated key.
  createSection(name, description, duration,color, key){
    
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
    const {exercises,selectedExerciseIndex} = this.state;
    
    const targetSectionIndex = exercises[selectedExerciseIndex].defaultSections.indexOf(oldSection);
    if(targetSectionIndex > -1){
      
      const newexercise = exercises[selectedExerciseIndex];
      let newSections = newexercise.defaultSections;
      
      newSections[targetSectionIndex] = newSection;
      newexercise.defaultSections = newSections;
      const newExercises = [...exercises]
      newExercises[selectedExerciseIndex].defaultSections = newSections;
      
      this.setState(
        {
          exercises: newExercises,
          selectedExercise: newexercise
        },
        store.saveSessionExercises(newExercises)
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
    const {exercises,selectedExerciseIndex} = this.state;
    
    const prevSelectedexercise = exercises[selectedExerciseIndex];
    if(prevSelectedexercise.preset){
      // create new as a copy of the selected..
      console.log("template modified, create a new exercise based on the selected one!");
    }
    
    let section = this.createSection('Uusi osio','lisää sisältö',5,"lightblue",prevSelectedexercise.name + 
    this.nextUniqueId())
    
    // rekey sections
    const newSections = this.reassignKeys([...prevSelectedexercise.defaultSections,section],prevSelectedexercise.name)
    // console.log("adding: ", section);
    
    const newExercises = [...exercises]
    newExercises[selectedExerciseIndex].defaultSections = newSections;
    
    this.setState(
      {
        exercises: newExercises
      },
      store.saveSessionExercises(newExercises)
    )
  }
  
  deleteSection(section){
    const {exercises, selectedExerciseIndex} = this.state;
    
    let newSections = [...exercises[selectedExerciseIndex].defaultSections];
    const index = newSections.indexOf(section);
    
    if(index > -1)
    {
      newSections.splice(index,1)
      const newexercise = {...exercises[selectedExerciseIndex],defaultSections: newSections};
      const newExercises = [...exercises];
      newExercises[selectedExerciseIndex] = newexercise;
      
      this.setState((prevState) =>
      {
        return {exercises: newExercises};
      },
      store.saveSessionExercises(newExercises))
    }
  }
  
  
  moveSectionUp(section){
    const {exercises,selectedExerciseIndex} = this.state;
    
    const exercise = exercises[selectedExerciseIndex];
    const moveIndex = exercise.defaultSections.indexOf(section)
    // if section is first we cant move up any more.
    if(moveIndex > 0){
      let sections = exercise.defaultSections;
      // remove and readd section to new position..
      sections.splice(moveIndex,1);
      sections.splice(moveIndex - 1,0,section);
      const newExercises = exercises;
      newExercises[selectedExerciseIndex] = exercise;
      
      this.setState(
        {
          exercises: newExercises
        },
        store.saveSessionExercises(newExercises)
      )
    }
  }
  
  moveSectionDown(section){
    const {exercises,selectedExerciseIndex} = this.state;
    
    const exercise = exercises[selectedExerciseIndex];
    const moveIndex = exercise.defaultSections.indexOf(section)
    // if section is last we cant move down any more.
    if(moveIndex < exercise.defaultSections.length - 1){
      let sections = exercise.defaultSections;
      // remove and readd section to new position..
      sections.splice(moveIndex,1);
      sections.splice(moveIndex + 1,0,section);
      
      const newExercises = exercises;
      newExercises[selectedExerciseIndex] = exercise;
      
      this.setState(
        {
          exercises: newExercises
        },
        store.saveSessionExercises(newExercises)
      )
    }
  }
  
  /* helper functions */
  
  applyCurrentTime = () => {
    const {exercises,selectedExerciseIndex} = this.state;
    
    const newExercise = exercises[selectedExerciseIndex];
    newExercise.startTime = new Date();
    this.setState(
      {
        selectedExercise: newExercise
      },
      store.saveSessionExercises(exercises)
    )
  }
  
  timeChanged = (time) =>{
    const {exercises,selectedExerciseIndex} = this.state;
    
    console.log(time)
    // time is coming in the right format
    const newExercises = [...exercises];
    
    newExercises[selectedExerciseIndex].startTime = time 
    this.setState(
      {
        exercises: newExercises
      }
    )
  }
  
  getExerciseIndex(exercises,identifier){
    return exercises.map(
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
    const {exercises} = this.state;
    
    // combobox selection should update state with new exercise
    const arrayIndex = this.getExerciseIndex(exercises,e.target.value)
    if(arrayIndex > -1){
      
      console.log("selected ", exercises[arrayIndex]);
      
      this.setState(
        {
          selectedExerciseIndex: arrayIndex
        }
      )
    }else{
      console.log("add new exercise requested.")
      this.newExercise();
    }
  }
  
  // start a new custom exercise. Later create a copy based on the previously selected exercise?
  newExercise = () => {
    const {exercises} = this.state;
    let reservedNames = exercises.map( exercise => {
      if(exercise !== undefined){
        return exercise.name;
      }else{
        return null;
      }
    }) 
    
    let name = ""
    
    while(true){
      name = prompt("Enter exercise name: ", "");
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
    
    const newexercise = 
    {
      name: name,
      startTime: new Date(),
      preset: false,
      defaultSections: []
    }
    
    let newExercises = [...exercises, newexercise];
    
    // add and select the new exercise
    this.setState(
      {
        ...this.state,
        exercises: newExercises,
        selectedExerciseIndex: newExercises.length - 1
      },
      store.saveSessionExercises(newExercises)
    ) 
  }
  
  // pass custom exercises for store to be saved
  saveExercises = () =>{
    const {exercises} = this.state;
    const nonPresets = exercises.filter((x) => {return x.preset !== true;})
    // save only here..
    store.saveExercises(nonPresets);
  }
  
  // updates the state, save will pass the change to store.
  deleteExercise = () => {
    const {exercises,selectedExerciseIndex} = this.state;
    
    const newExercises = [...exercises];
    if(!newExercises[selectedExerciseIndex].preset){
      // set selected to first in list (presets should always exist)
      const deleteIndex = selectedExerciseIndex;
      this.setState({
        selectedExerciseIndex: 0
      })
      console.log(`deleting exercise ${newExercises[deleteIndex].name}`)
      console.log(`exercises left:`,newExercises.splice(deleteIndex,1))
      
      this.setState(
        {
          exercises: newExercises
        }, store.saveSessionExercises(newExercises)
      )
    }
  }
  
  // use as callback for setState
  updateSectionInputBoxes = () => {
    const {exercises,selectedExerciseIndex} = this.state;
    
    this.currentSections = exercises[selectedExerciseIndex].defaultSections.map((sectionItem,index) => {
      let inputBoxKey = sectionItem.key;
      // console.log("input key:" + inputBoxKey + " name " + sectionItem.name)
      return <SectionInputBox key={inputBoxKey} id={inputBoxKey} name={sectionItem.name} section={sectionItem} remove={this.deleteSection.bind(this)} update={this.updateSection.bind(this)} moveUp={this.moveSectionUp.bind(this)} moveDown={this.moveSectionDown.bind(this)}/>
      
    })
  }
  
  updateExercisePresets = () => {
    const {exercises} = this.state;
    
    this.exercisePresets = exercises.map((exercise,index) => {
      // we should not have undefined exercises in the memory
      if(exercise !== undefined){
        // console.log(`exercise  added to menu `, exercise)
        return <option key={index} value={exercise.name}>{exercise.name}</option>
      }else{
        return null;
      }
    })
    this.exercisePresets.push(<option key="addNewexercise">+ new exercise</option>)
  }
  
  /* Lifecycle hools */
  
  componentWillMount(){
    // destructure from state to ease the syntax
    const {exercises} = this.state;
    
    // assign proper keys to exercises
    let newExercises = exercises.map(exercise => {
      // need to restart sequence under each exercise
      let rekeyedSections = this.reassignKeys(exercise.defaultSections,exercise.name);
      exercise.defaultSections = rekeyedSections;
      return exercise;
    })
    
    // add exercises that the user has created locally
    let customExercises = store.getSessionExercises();
    if(customExercises !== null && customExercises !== undefined && customExercises.length > 0){
      // console.log(`adding ${customExercises.length} custom exercises to list`)
      newExercises = newExercises.concat(customExercises);
    }
    
    this.setState(
      {
        exercises: newExercises
      }
    )
    
    this.updateExercisePresets();
  }
  
  // specify the correct props and state for this! recieves old and new props?!
  componentWillUpdate(nextProps, nextState){
    // updating sectioninput boxes should be called here
    //console.log("App: componentWillUpdate ran");
  }
  
  render() {
    // move to componentWillUpdate or componentWillrecieveprops?
    //console.log("rerendering app", new Date())
    this.updateExercisePresets();
    this.updateSectionInputBoxes();
    // deconstruct state for simpler syntax
    const {exercises,selectedExerciseIndex,activeSection} = this.state;
    
    return (
      <div className="App">
      <SectionInfo activeSection={activeSection}/>
      <Clock id="clock" sectionItems={exercises[selectedExerciseIndex].defaultSections} startTime={exercises[selectedExerciseIndex].startTime} canvasSide="100" activeSection={activeSection} setActive={this.setActiveSection.bind(this)}/>
      <div id="SettingsContainer">
      <div className="GeneralSettingsContainer">
      <div>
      <i className="material-icons">access_time</i>
      <TimeInput id="TimeInput" mode="24h" value={exercises[this.state.selectedExerciseIndex].startTime} onChange={this.timeChanged}/>
      </div>
      <div>
      <i className="material-icons">timelapse</i>
      <FormControl>
          <Select
            native
            value={exercises[selectedExerciseIndex].name}
            onChange={this.selectExercise}
            input={<Input id="exercise-selector" />}>
            {this.exercisePresets}
          </Select>
      </FormControl>
      </div>
      <Button variant="raised" onClick={this.applyCurrentTime}>
      Aloita nyt
      </Button>
      <Button variant="raised" onClick={this.saveExercises}>
      Tallenna
      </Button>
      <Button variant="raised" onClick={this.deleteExercise}>
      Poista
      </Button>
      <EditSectionForm exercise={exercises[selectedExerciseIndex]} edit={true}/>
      </div>
      <div className="ConfigBox" id="App-configbox">
      {this.currentSections}
      <div className="NewSection" id="AddSection" onClick={this.addSection.bind(this)}><div className="NewSectionContent">new</div>
      </div>
      <SectionListItem section={exercises[selectedExerciseIndex].defaultSections[0]}/>
      </div>
      </div>
      </div>
    );
  }
}

export default App;
