import React, { Component } from 'react';
import './App.css';
import Clock from './Components/Clock';
import SectionInputBox from './Components/SectionInputBox';

class App extends Component {

  constructor(){
    super();
    this.state = {
      sections: []
    }
  }

  applySettings(){

     let customHour = document.getElementById("HourPicker").value;
     let customMin = document.getElementById("MinutePicker").value;
    // let customStartHours = 
    let customStartDate = new Date(2018,2,24,customHour,customMin)
    console.log("applying settings: " + customStartDate)
    //localStorage()
    
      this.setState({
        startTime: customStartDate
    })
  }

  timeChanged(){
    console.log("time changed")
  }
  // section manipulation
  addSection(){
    console.log("adding new section: "+ (this.state.sections.length + 1))
    let section = {
      name: 'new',
        duration: 5,
        position: this.state.sections.length + 1,
        color: "#1b85b8",
        description: 'new'
    }
    let newSections = this.state.sections;
    newSections.push(section);
    this.setState({
      sections: newSections
    })
  }
  removeSection(el){
    // --> remove the element that sends this request
    console.log("removing section")
    let newSections = this.state.sections;
    // remove the section from state..
    newSections.findIndex()
  }

  findBySectionByPosition(element,position){
    if(element.position === position){
      return element;
    }
  }

  componentWillMount(){
    
    // defaults -> populate from props provided by the separate editor..
    let date = new Date();
    date.setHours(18);
    date.setMinutes(30);
    this.setState({
      startTime: date,
      sections: [
      {
        name: 'Alkulämmittely',
        duration: 10,
        position: 1,
        color: "#1b85b8",
        description: '-'
      },
      {
        name: 'Alkuvenyttely',
        duration: 5,
        position: 2,
        color: "#559e83",
        description: '--'
      },
      {
        name: 'Tengi',
        duration: 10,
        position: 3,
        color: "#ae5a41",
        description: '---'
      },
      {
        name: 'Päivän aihe',
        duration: 10,
        position: 4,
        color: "#c3cb71",
        description: '----'
      },
      {
        name: 'Loppujumppa',
        duration: 15,
        position: 5,
        color: "#5a5255",
        description: '-----'
      },
    
    ]})
  }

  render() {
    
    let currentSections = this.state.sections.map(sectionItem => {
      
      return <SectionInputBox key={sectionItem.position} name={sectionItem.name} description={sectionItem.description} duration={sectionItem.duration} position={sectionItem.position} color={sectionItem.color} remove={this.removeSection}/>
    })
    // let sampleSection = this.state.sections[1];
    
    return (
      <div className="App">
        <Clock id="clock" sectionItems={this.state.sections} startTime={this.state.startTime}/>
        <div className="ConfigBox" id="App-configbox">
        <div className="StartPickerContainer">
        <h3>aloitusaika</h3>
        <input className="TimePickerBox" id="HourPicker" type="number" defaultValue="18" min="0" max="23" onChange={this.timeChanged}/><input className="TimePickerBox" id="MinutePicker" type="number" defaultValue="30" min="0" max="59" onChange={this.timeChanged}/><br/>
        <button id="ApplyBtn" value="apply" onClick={this.applySettings.bind(this)}>Apply</button>
        </div>
        {currentSections}
        <button className="ConfigBtn" id="AddSectionBtn" name="Add section" onClick={this.addSection.bind(this)}>Add Section</button>
        </div>
      </div>
    );
  }
}

export default App;
