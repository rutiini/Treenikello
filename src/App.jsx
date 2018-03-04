import React, { Component } from 'react';
import './App.css';
import Clock from './Components/Clock';
import SectionInputBox from './Components/SectionInputBox';

class App extends Component {
  
  defaultSections = [
    {
      name: 'Alkulämmittely',
      duration: 10,
      position: 1,
      color: "#1b85b8",
      description: 'nilkat lämpimiksi, käsipallo'
    },
    {
      name: 'Alkuvenyttely',
      duration: 5,
      position: 2,
      color: "#559e83",
      description: 'erityisesti jalat vetreiksi'
    },
    {
      name: 'Tengi',
      duration: 10,
      position: 3,
      color: "#ae5a41",
      description: 'kokeilkaa uutta korkeaa'
    },
    {
      name: 'Päivän aihe',
      duration: 20,
      position: 4,
      color: "#c3cb71",
      description: 'perustekniikkaa'
    },
    {
      name: 'Loppujumppa',
      duration: 15,
      position: 5,
      color: "#5a5255",
      description: 'intervallit mitseihin täysillä'
    }]
    
    defaultSections2 = [
      {
        name: 'Sarja',
        duration: 5,
        position: 1,
        color: "#ae5a41",
        description: 'kyykyt'
      },
      {
        name: 'tauko',
        duration: 5,
        position: 2,
        color: "#559e83",
        description: 'lepoa'
      },
      {
        name: 'Sarja',
        duration: 5,
        position: 3,
        color: "#ae5a41",
        description: 'vatsat'
      },
      {
        name: 'tauko',
        duration: 5,
        position: 4,
        color: "#559e83",
        description: 'lepoa'
      },
      {
        name: 'Sarja',
        duration: 5,
        position: 5,
        color: "#ae5a41",
        description: 'punnerrukset'
      },
      {
        name: 'tauko',
        duration: 5,
        position: 6,
        color: "#559e83",
        description: 'lepoa'
      },
    ]

    sumAngle = 0;
    
    
    constructor(props){
      super(props);
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
    
    getLastSectionStopAngle(){
      let angle = 0;
      if(this.sections){
        
        for(let i  = 0; i < this.sections.lenght; i++ ){
          angle = angle + this.sections[i].duration*6;
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
      
      let key = "section-" + this.sumAngle;
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
      // console.log("section: " + section.key + " found at: " + targetSectionIndex + " updated -> name:" + section.name + " Description: " + section.description + " color: " + section.color + " duration: " + section.duration)
    }
    
    // modify to use a better, unique identifier
    getSectionIndex(sections,identifier){
      return sections.map(
        function(x){ 
          return x.position 
        }).indexOf(identifier);
      }
      
      addSection(){
        
        let section = this.createSection('new','section',5,this.state.sections.length + 1,"#1b85b8")
        let newSections = this.state.sections;
        newSections.push(section);
        this.setState({
          sections: newSections
        })
      }
      
      deleteSection(key){
        
        let newSections = this.state.sections; // parent sections?
        var removeSectionIndex = newSections.map(
          function(x){
            return x.key;
          }).indexOf(key);
          
          if(removeSectionIndex > -1){
            
            newSections.splice(removeSectionIndex,1)
            
            this.setState(
              {
                sections: newSections
              }
            )
          }
        }
        
        componentWillMount(){
          //console.log("App ComponentWillMount triggered")
          // defaults -> populate from props provided by the separate editor..
          let date = new Date();
          date.setHours(18);
          date.setMinutes(30);
          
          let sectionsWithKeys = this.defaultSections.map(sectionItem => {
            return this.createSection(sectionItem.name,sectionItem.description,sectionItem.duration,sectionItem.position,sectionItem.color);
          })
          // stop angle is a good unique identifier for these objects
          this.setState({
            startTime: date,
            sections: sectionsWithKeys})
          }
          
          render() {
            let currentSections = this.state.sections.map(sectionItem => {
              
              // Just pass the sectionitem, no point in givin all the props separately!
              // let inputBoxKey = "input-"+sectionItem.key;´
              let inputBoxKey = sectionItem.key;
              return <SectionInputBox key={inputBoxKey} id={inputBoxKey} name={sectionItem.name} section={sectionItem} remove= {this.deleteSection.bind(this)} update={this.updateSection.bind(this)}/>

            })
            let activeName = "";
            if(this.state.activeSection != null){
              activeName = "nyt menossa " + this.state.activeSection.name + ": " +this.state.activeSection.description;
            }
            
            return (
              <div className="App">
              <div id="SectionInfo">{activeName}</div>
              <Clock id="clock" sectionItems={this.state.sections} startTime={this.state.startTime} canvasSide="100" activeSection={this.state.activeSection} setActive={this.setActiveSection.bind(this)}/>
              <div id="SettingsContainer">
              <div className="GeneralSettingsContainer">
              <span>aloitusaika:</span> 
              <input className="SettingsControl" id="HourPicker" type="number" defaultValue="18" min="0" max="23" onChange={this.timeChanged}/><input className="SettingsControl" id="MinutePicker" type="number" defaultValue="30" min="0" max="59" onChange={this.timeChanged}/><br/>
              <div id="ApplyBtn" className="SettingsControl" value="apply" onClick={this.applySettings.bind(this)}>Aseta</div>
              <div id="QuickStartBtn" className="SettingsControl" onClick={() => this.setState({startTime: new Date()})}><span>Aloita nyt</span></div>
              </div>
              <div className="ConfigBox" id="App-configbox">
              {currentSections}
              <div className="NewSection" id="AddSection" onClick={this.addSection.bind(this)}><div className="NewSectionContent">new</div></div>
              </div>
              </div>
              </div>
            );
          }
        }
        
        export default App;
        