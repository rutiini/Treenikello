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

    let sections = document.getElementById("sectionConfig").value;
    let customStart = document.getElementById("customStart").value;
    // let customStartHours = 
    let customStartDate = new Date(2018,2,24,12,30)
    console.log("applying settings: " + customStartDate)
    //localStorage()
    if(sections !== ""){
      this.setState({
          sections: [sections]
      })
    }
    if(customStart){
      this.setState({
        startTime: customStartDate
    })
    }
  }

  addSection(){
    console.log("adding new section: "+ (this.state.sections.length + 1))
  }

  componentWillMount(){
    
    /*
    basic pastel colors:
    #1b85b8 -> dark blue
    #5a5255 -> dark grey
    #559e83 -> dark green
    #ae5a41 -> dark red
    #c3cb71 -> olive green
    */

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
        duration: 50,
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
      
      return <SectionInputBox name={sectionItem.name} description={sectionItem.description} duration={sectionItem.duration} position={sectionItem.position} color={sectionItem.color}/>
    })
    // let sampleSection = this.state.sections[1];
    
    return (
      <div className="App">
        {/* <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">React-treenikello</h1>
        </header> */}
        <Clock id="clock" sectionItems={this.state.sections} startTime={this.state.startTime}/>
        <div ClassName="ConfigBox" id="App-configbox">
        <textarea id="SectionConfig" type="textarea" name="sections" height="300" overflow="auto" wrap="soft" placeholder="add sections separated by commas: {
        name: 'Alkulämmittely',
        duration: 10,
        position: 1,
        color: '#1b85b8',
        description: '-'
      }"/>
        <input ClassName="ConfigBox" id="CustomStart" type="time" name="start-time"/>
        <input ClassName="ConfigBtn" type="Submit" value="apply" onClick={this.applySettings.bind(this)}/>
        {/* <SectionInputBox name={sampleSection.name} description={sampleSection.description} duration={sampleSection.duration} position={sampleSection.position} color={sampleSection.color}/> */}
        {currentSections}
        <button ClassName="ConfigBtn" id="AddSectionBtn" name="Add section" onClick={this.addSection.bind(this)}>Add Section</button>
        </div>
      </div>
    );
  }
}

export default App;
