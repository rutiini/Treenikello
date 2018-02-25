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

  updateSection(section){
    
    let targetSectionIndex = this.getSectionIndex(this.state.sections,section.position);
    let newSections = this.state.sections;
    newSections[targetSectionIndex] = section;

    this.setState(
      {
        sections: newSections
      }
    )
    console.log("section " + targetSectionIndex + "updated: " + section.name)
  }

  // modify to use a better, unique identifier
  getSectionIndex(sections,identifier){
    return sections.map(
      function(x){ 
        return x.position 
      }).indexOf(identifier);
  }

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
  
  deleteSection(position){
    
    let newSections = this.state.sections; // parent sections?
    var removeSectionIndex = newSections.map(
      function(x){
        return x.position;
      }).indexOf(position);
      
      if(removeSectionIndex > -1){

        newSections.splice(removeSectionIndex,1)
        console.log("remaining sections " + newSections.length)
        
        this.setState(
          {
            sections: newSections
          }
        )
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
          
          // Just pass the sectionitem, no point in givin all the props separately!

          return <SectionInputBox key={sectionItem.position} name={sectionItem.name} section={sectionItem} remove= {this.deleteSection.bind(this)} update={this.updateSection.bind(this)}/>
        })
        
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
    