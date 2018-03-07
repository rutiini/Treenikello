import React, { Component } from 'react';
import './App.css';
import Clock from './Components/Clock';
import SectionInputBox from './Components/SectionInputBox';
import SectionInfo from './Components/SectionInfo';
import UniqueId from 'react-html-id';

class App extends Component {
  
  sumAngle = 0;
  
  constructor(props){
    super(props);
    // modify exercises with new unique ids
    UniqueId.enableUniqueIds(this);
    
    this.nextID = () => this.nextUniqueId();

    const excercise1 = {
      name: "Taidotreenit",
      startTime: new Date(2018,1,1,18,30),
      defaultSections: [
        {
          key: this.nextUniqueId(),
          name: 'Alkulämmittely',
          duration: 10,
          position: 1,
          color: "#1b85b8",
          description: 'nilkat lämpimiksi, käsipallo'
        },
        {
          key: this.nextUniqueId(),
          name: 'Alkuvenyttely',
          duration: 5,
          position: 2,
          color: "#559e83",
          description: 'erityisesti jalat vetreiksi'
        },
        {
          key: this.nextUniqueId(),
          name: 'Tengi',
          duration: 10,
          position: 3,
          color: "#ae5a41",
          description: 'kokeilkaa uutta korkeaa'
        },
        {
          key: this.nextUniqueId(),
          name: 'Päivän aihe',
          duration: 20,
          position: 4,
          color: "#c3cb71",
          description: 'perustekniikkaa'
        },
        {
          key: this.nextUniqueId(),
          name: 'Loppujumppa',
          duration: 15,
          position: 5,
          color: "#5a5255",
          description: 'intervallit mitseihin täysillä'
        }
      ]  
    }
    
    const excercise2 = {
      name: "Intervallitreeni",
      startTime: new Date(2018,1,1,17,30),
      defaultSections: [
        {
          key: this.nextUniqueId(),
          name: 'Sarja',
          duration: 5,
          position: 1,
          color: "#ae5a41",
          description: 'kyykyt'
        },
        {
          key: this.nextUniqueId(),
          name: 'tauko',
          duration: 5,
          position: 2,
          color: "#559e83",
          description: 'lepoa'
        },
        {
          key: this.nextUniqueId(),
          name: 'Sarja',
          duration: 5,
          position: 3,
          color: "#ae5a41",
          description: 'vatsat'
        },
        {
          key: this.nextUniqueId(),
          name: 'tauko',
          duration: 5,
          position: 4,
          color: "#559e83",
          description: 'lepoa'
        },
        {
          key: this.nextUniqueId(),
          name: 'Sarja',
          duration: 5,
          position: 5,
          color: "#ae5a41",
          description: 'punnerrukset'
        },
        {
          key: this.nextUniqueId(),
          name: 'tauko',
          duration: 5,
          position: 6,
          color: "#559e83",
          description: 'lepoa'
        },
      ]
    }

    this.state = {
      excercises: [excercise1,excercise2],
      selectedExercise: excercise1
    }
  }
  
  applySettings(){
    
    let customHour = document.getElementById("HourPicker").value;
    let customMin = document.getElementById("MinutePicker").value;
    // let customStartHours = 
    let customStartDate = new Date(2018,2,24,customHour,customMin)
    console.log("applying settings: " + customStartDate)
    //localStorage()
    let newExcercise = this.state.selectedExercise
    newExcercise.startTime = customStartDate;
    this.setState({
      selectedExercise: newExcercise
    })
  }
  
  getLastSectionStopAngle(){
    let angle = 0;
    if(this.state.selectedExercise.defaultSections){
      
      for(let i  = 0; i < this.state.selectedExercise.defaultSections; i++ ){
        angle = angle + this.state.selectedExercise.defaultSections[i].duration*6;
      }
      return angle;
    }
  }
  
  setActiveSection(sectionItem){
    this.setState({
      activeSection: sectionItem
    },() =>{
      console.log("Currently active section: " + sectionItem.name);
    });
    
  }
  
  // returns a section with generated key.
  createSection(name, description, duration,position,color){
    
    this.sumAngle = this.sumAngle + duration*6;
    let key = "new"; // TODO: here we need to get a new globally unique key --> use it in the section item box constructor, not the parent!
    let section = {
      key: key,
      name: name,
      duration: duration,
      position: position,
      color: color,
      description: description
    }
    return section;
  }
  
  updateSection(section){
    console.log("updating section: " + section.name)
    let targetSectionIndex = this.getSectionIndex(this.state.selectedExercise.defaultSections,section.position);
    let newSections = this.state.selectedExercise.defaultSections;
    let newExercise = this.state.selectedExercise;
    
    newSections[targetSectionIndex] = section;
    newExercise.defaultSections = newSections;
    
    this.setState(
      {
        selectedExercise: newExercise
      }
    )
  }
  
  addSection(){
    // cant use section.length for position? -> deprecate position and use the json ordering.
    let section = this.createSection('nimi','sisältö',5,this.state.selectedExercise.defaultSections.length + 1,"lightblue")
    let newSections = this.state.selectedExercise.defaultSections;
    let newExercise = this.state.selectedExercise;
    
    newSections.push(section);
    newExercise.defaultSections = newSections;
    
    this.setState({
      selectedExercise: newExercise
    },this.updateSectionInputBoxes())
  }
  
  deleteSection(key){
    console.log("deleting " + key)
    let newSections = this.state.selectedExercise.defaultSections;
    
    var removeSectionIndex = newSections.map(
      function(x){ 
        return x.key 
      }
    ).indexOf(key);
    
    if(removeSectionIndex > -1){
      
      newSections.splice(removeSectionIndex,1)
      let newExercise = this.state.selectedExercise;
      newExercise.defaultSections = newSections;
      
      this.setState({
        selectedExercise: newExercise
      },this.updateSectionInputBoxes())
    }
  }
  
  applyCurrentTime = () => {
    let newExercise = this.state.selectedExercise;
    newExercise.startTime = new Date();
    this.setState({
      selectedExercise: newExercise
    }) // update clock face?
  }
  
  timeChanged(){
    console.log("time changed")
  }
  
  // modify to use a better, unique identifier
  getSectionIndex(sections,identifier){
    return sections.map(
      function(x){ 
        return x.position 
      }
    ).indexOf(identifier);
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
  
  moveSectionUp(){
    // implement
  }
  moveSectionDown(){
    // implement
  }
  
  selectExercise = (e) =>{
    // combobox selection should update state with new exercise
    let arrayIndex = this.getExerciseIndex(this.state.excercises,e.target.value)
    
    this.setState({
      selectedExercise: this.state.excercises[arrayIndex]
    }, () => {
      this.updateSectionInputBoxes();
    })
  }
  
  // use as callback for setState
  updateSectionItemsForClock = () => {
    // unimplemented.
  }
  // use as callback for setState
  updateSectionInputBoxes = () => {
    this.currentSections = this.state.selectedExercise.defaultSections.map((sectionItem,index) => {
      let inputBoxKey = sectionItem.key;//this.nextUniqueId(this.state.selectedExercise.name);
      console.log("input key:" + inputBoxKey)
      return <SectionInputBox key={inputBoxKey} id={inputBoxKey} name={sectionItem.name} section={sectionItem} remove={this.deleteSection.bind(this)} update={this.updateSection.bind(this)} moveUp={this.moveSectionUp.bind(this)} moveDown={this.moveSectionDown.bind(this)}/>
      
    })
    this.forceUpdate() // TODO: handle the state change better to avoid using this?
  }
  updateExercisePresets = () => {
    this.exercisePresets = this.state.excercises.map((excercise,index) => {
      return <option key={index} value={excercise.name}>{excercise.name}</option>
    })
  }
  
  componentWillMount(){
    // have a state container which handles all the available saved presets
    
    this.updateSectionInputBoxes();
    
    this.exercisePresets = this.state.excercises.map((excercise,index) => {
      return <option key={index} value={excercise.name}>{excercise.name}</option>
    })
  }
  
  componentWillUpdate(){
    console.log("App: componentWillUpdate ran");
    
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
      <input id="HourPicker" type="number" defaultValue="18" min="0" max="23" onChange={this.timeChanged}/>:
      <input id="MinutePicker" type="number" defaultValue="30" min="0" max="59" onChange={this.timeChanged}/>
      </div>
      <div id="ApplyBtn" className="SettingsControl" value="apply" onClick={this.applySettings.bind(this)}>Aseta</div>
      <div id="QuickStartBtn" className="SettingsControl" onClick={this.applyCurrentTime}><span>Aloita nyt</span></div>
      <span>valmiit:</span>
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
