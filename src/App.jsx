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
      selectedExercise: excercise1
    }
  }
  
  // make save button for custom exercises
  applySettings(){
    
  }
  
  setActiveSection(sectionItem){
    // don't set null.
    // if(sectionItem == null){
    //   console.log("create dummy section")
    //   sectionItem = this.createSection("","",0,"","none")
    // }
    // TODO: update can cause infinite loop, fix!
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
    // console.log("updating section: " + oldSection.name)
    const targetSectionIndex = this.state.selectedExercise.defaultSections.indexOf(oldSection);
    if(targetSectionIndex > -1){
      
      let newSections = this.state.selectedExercise.defaultSections;
      let newExcercise = this.state.selectedExercise;
      
      newSections[targetSectionIndex] = newSection;
      newExcercise.defaultSections = newSections;
      
      // update customs to local memory.
      if(!newExcercise.preset){
        this.saveCustomExcercises(newExcercise);
      }
      
      
      this.setState(
        {
          selectedExercise: newExcercise
        }
        ,this.updateSectionInputBoxes()
      )
    }
  }
  
  reassignKeys = (itemArr,groupId) =>{
    let rekeyedArr = itemArr.map(item => {
      item.key = groupId + this.nextUniqueId(groupId);
      return item;
    })
    return rekeyedArr;
  }
  
  addSection(){
    
    // check wheher current exercise is a template, if it is create a new excercise!
    if(this.state.selectedExercise.preset){
      // this.newExcercise()
      console.log("template modified, create a new excercise based on the selected one!");
    }
    
    // reassign keys when the collection is modified..
    let newSections = this.reassignKeys(this.state.selectedExercise.defaultSections, this.state.selectedExercise.name);
    
    let section = this.createSection('Uusi osio','lisää sisältö',5,"lightblue",this.state.selectedExercise.name + this.nextUniqueId())
    newSections.push(section);
    
    let newExercise = this.state.selectedExercise;
    
    newExercise.defaultSections = newSections;
    
    this.setState(
      {
        selectedExercise: newExercise
      }
      ,this.updateSectionInputBoxes()
    )
  }
  
  deleteSection(section){
    let newSections = this.state.selectedExercise.defaultSections;
    
    const index = newSections.indexOf(section);
    
    if(index > -1){
      
      newSections.splice(index,1);
      
      let newExercise = this.state.selectedExercise;
      newExercise.defaultSections = newSections;
      
      this.setState(
        {
          selectedExercise: newExercise
        }
        ,this.updateSectionInputBoxes()
      );
    }
  }
  
  applyCurrentTime = () => {
    let newExercise = this.state.selectedExercise;
    newExercise.startTime = new Date();
    this.setState({
      selectedExercise: newExercise
    }) // update clock face?
  }
  
  timeChanged = (time) =>{
    // console.log(`time changed to ${time}`)
    const patt = /([0-2][0-9]):([0-5][0-9])/
    const timeComponents = patt.exec(time);
    const hours = timeComponents[1];
    const minutes = timeComponents[2];
    
    // console.log(`time components ${timeComponents[1]} ${timeComponents[2]}`)
    let newTime = this.state.selectedExercise.startTime;
    
    newTime.setHours(hours);
    newTime.setMinutes(minutes);
    // console.log(`time set to ${newTime}`);
  }
  
  getExerciseIndex(sections,identifier){
    return sections.map(
      function(x){
        return x.name
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
  
  moveSectionUp(section){
    // implement
    // console.log(`move section ${section.name} up`)
    //
    const moveIndex = this.state.selectedExercise.defaultSections.indexOf(section)
    // if section is first we cant move up any more.
    if(moveIndex > 0){
      let sections = this.state.selectedExercise.defaultSections;
      // remove and readd section to new position..
      sections.splice(moveIndex,1);
      sections.splice(moveIndex - 1,0,section);
      // this.printSections(sections);
      this.setState({
        selectedExercise:{
          startTime: this.state.selectedExercise.startTime,
          name: this.state.selectedExercise.name,
          defaultSections : sections
        }
      },this.updateSectionInputBoxes())
    }
  }
  
  moveSectionDown(section){
    // implement
    // console.log(`move section ${section.name} down`)
    
    const moveIndex = this.state.selectedExercise.defaultSections.indexOf(section)
    // if section is last we cant move down any more.
    if(moveIndex < this.state.selectedExercise.defaultSections.length - 1){
      let sections = this.state.selectedExercise.defaultSections;
      // remove and readd section to new position..
      sections.splice(moveIndex,1);
      sections.splice(moveIndex + 1,0,section);
      // this.printSections(sections);
      this.setState({
        selectedExercise:{
          startTime: this.state.selectedExercise.startTime,
          name: this.state.selectedExercise.name,
          defaultSections : sections
        }
      },this.updateSectionInputBoxes())
    }
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
    let arrayIndex = this.getExerciseIndex(this.state.excercises,e.target.value)
    if(arrayIndex > -1){
      
      console.log("selected " + this.state.excercises[arrayIndex].name)
      
      this.setState(
        {
          selectedExercise: this.state.excercises[arrayIndex]
        }
        ,() => {
          this.updateSectionInputBoxes();
          this.forceUpdate();
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
      return excercise.name; 
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
    
    let newExcercise = 
    {
      name: name,
      startTime: new Date(),
      preset: false,
      defaultSections: []
    }
    
    let newExercises = this.state.excercises;
    newExercises.push(newExcercise);
    
    let customs = 
    [
      newExcercise,
    ]
    this.saveCustomExcercises(customs)
    // add and select the new excercise
    this.setState({
      excercises: newExercises
    }, /*this.setState({
      selectedExercise: newExcercise
    }),this.updateSectionInputBoxes()*/) // fix to update sectioninputboxes as well!
    // update the selecor and select the new exercise by default?
  }
  // updates the locally stored excercises
  saveCustomExcercises = (excercises) =>{
    localStorage.setItem("customExcercises",JSON.stringify(excercises));
  }
  // returns an array of the locally stored excercises
  getCustomExcercises = () => {
    
    if(localStorage.getItem("customExcercises") === "undefined"){
      localStorage.clear();
    }
    
    // need to parse the date objects sepaprately
    let customs = JSON.parse(localStorage.customExcercises || null) || {};
    console.log(customs)
    for(let i = 0; i < customs.length; i++){
      customs[i].startTime = new Date(customs[i].startTime);
      console.log(customs[i]);
      
      return customs;
    }
  }
  // use as callback for setState
  updateSectionItemsForClock = () => {
    // unimplemented.
  }
  // use as callback for setState
  updateSectionInputBoxes = () => {
    this.currentSections = this.state.selectedExercise.defaultSections.map((sectionItem,index) => {
      let inputBoxKey = sectionItem.key;
      // console.log("input key:" + inputBoxKey + " name " + sectionItem.name)
      return <SectionInputBox key={inputBoxKey} id={inputBoxKey} name={sectionItem.name} section={sectionItem} remove={this.deleteSection.bind(this)} update={this.updateSection.bind(this)} moveUp={this.moveSectionUp.bind(this)} moveDown={this.moveSectionDown.bind(this)}/>
      
    })
    // call render?
  }
  
  updateExercisePresets = () => {
    this.exercisePresets = this.state.excercises.map((excercise,index) => {
      console.log(`excercise  added to menu ${excercise.name}`)
      return <option key={index} value={excercise.name}>{excercise.name}</option>
    })
    this.exercisePresets.push(<option key="addNewSection">+new exercise</option>)
  }
  
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
    console.log(`found ${JSON.stringify(customExcercises)} from local storage`);
    newExcercises = newExcercises.concat(customExcercises);
    
    this.setState(
      {
        excercises: newExcercises,
        selectedExercise: newExcercises[0]
      }
      ,this.updateSectionInputBoxes()
    )
    
    this.updateExercisePresets();
  }
  
  componentWillUpdate(){
    this.updateExercisePresets();
    console.log("App: componentWillUpdate ran");
    // updating sectioninput boxes should be called here
    // this.updateSectionInputBoxes();
  }
  
  render() {
    // move to componentWillUpdate or componentWillrecieveprops?
    //console.log("rerendering app")
    
    return (
      <div className="App">
      <SectionInfo activeSection={this.state.activeSection}/>
      <Clock id="clock" sectionItems={this.state.selectedExercise.defaultSections} startTime={this.state.selectedExercise.startTime} canvasSide="100" activeSection={this.state.activeSection} setActive={this.setActiveSection.bind(this)}/>
      <div id="SettingsContainer">
      <div className="GeneralSettingsContainer">
      <span>aloitusaika:</span>
      <div id="StartTimePicker" className="SettingsControlTime">
      <TimePicker id="TimeInput" value={this.state.selectedExercise.startTime} onChange={this.timeChanged}/>
      </div>
      {/* <div id="ApplyBtn" className="SettingsControl" value="apply" onClick={this.applySettings.bind(this)}>Aseta</div> */}
      <div id="QuickStartBtn" className="SettingsControl" onClick={this.applyCurrentTime}><span>Aloita nyt</span></div>
      <span>valitse pohja:</span>
      <select id="ExcerciseSelector" className="SettingsCombox" name="selectExcercise" value={this.state.selectedExercise.name} onChange={this.selectExercise}>
      {this.exercisePresets}
      </select>
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
