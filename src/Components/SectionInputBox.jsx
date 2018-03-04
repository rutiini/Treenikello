import React, {Component} from 'react';
import '../App.css';

class SectionInputBox extends Component {
  
  // const stuff can be declared here?
  colorOptions = [
    {"colorName":"dark blue","colorValue":"#1b85b8"}, //-> dark blue
    {"colorName":"dark grey","colorValue":"#5a5255"}, //-> dark grey
    {"colorName":"dark green","colorValue":"#559e83"}, //-> dark green
    {"colorName":"dark red","colorValue":"#ae5a41"}, //-> dark red
    {"colorName":"olive green","colorValue":"#c3cb71"}, //-> olive green
    {"colorName":"none","colorValue":"none"}
  ]
  
  constructor(props){
    super(props);
    this.state = {
      color: this.props.section.color,
      name: this.props.section.name,
      description: this.props.section.description,
      duration: this.props.section.duration,
      position: this.props.section.position
    }
    
  }
  
  // call the parents update function
  updateSectionState(){
    let stateSection = {
      key: this.props.id,
      color: this.state.color,
      name: this.state.name,
      description: this.state.description,
      duration: this.state.duration,
      position: this.state.position
    }
    console.log("sending updated section to app: " + stateSection.color)
    this.props.update(stateSection)
  }
  
  // call the parent remove function with current objects position
  // replace position with unique id for future purpose
  removeSelf(){
    this.props.remove(this.props.section.key)
  }
  
  nameChanged(e){
    this.setState({
      name: e.target.value
    }, () => 
    this.updateSectionState()
  )
}
descriptionChanged(e){
  this.setState({
    description: e.target.value
  }, () => 
  this.updateSectionState()
  )
}
positionChanged(e){
  this.setState({
    position: e.target.value
  }, () => 
  this.updateSectionState()
  )
}
durationChanged(e){
  this.setState({
    duration: e.target.value
  }, () => 
  this.updateSectionState()
  )
}
colorChanged(e){
  this.setState({
    color: e.target.value 
  }, () =>
  // run the call on parent update as a callback
  this.updateSectionState()
  )
}

// use this for customized color options?
getColorOptions(){
  
  var colorOptions = [
    {"colorName":"dark blue","colorValue":"#1b85b8"}, //-> dark blue
    {"colorName":"dark grey","colorValue":"#5a5255"}, //-> dark grey
    {"colorName":"dark green","colorValue":"#559e83"}, //-> dark green
    {"colorName":"dark red","colorValue":"#ae5a41"}, //-> dark red
    {"colorName":"olive green","colorValue":"#c3cb71"}, //-> olive green
    {"colorName":"none","colorValue":"none"}
  ]
  return colorOptions;
}

// use for updating?
getSelections(){
  var section = {
    position: document.getElementById("position"),
    name: "name",
    description: "asd",
    duration: 10
  }
  return section;
}

componentWillMount(){  
  this.options = this.colorOptions.map(optionItem => {
    let colorCode = optionItem.colorValue;
    let colorName = optionItem.colorName;
    
    return <option key={colorName} value={colorCode}>{colorName}</option>;
  })
}

render(){
  
  return(
    <div className="SectionItemBox" draggable="true" style={{backgroundColor: this.state.color}}>
    <div className="HeaderContainer">
    <div className="DeleteSectionBtn" onClick={this.removeSelf.bind(this)}>X</div>
    <input className="PositionSelector" value={this.state.position} onChange={this.positionChanged.bind(this)} type="number"></input>
    <textarea id="SectionName" className="NameInputBox" value={this.state.name} onChange={this.nameChanged.bind(this)} ></textarea>
    </div>
    <textarea className="DescriptionBox" onChange={this.descriptionChanged.bind(this)} value={this.state.description}/><br/>
    <input className="DurationSelector" onChange={this.durationChanged.bind(this)} type="number" value={this.state.duration}/><br/>
    <select className="ColorSelector" onChange={this.colorChanged.bind(this)} value={this.state.color}>
    {this.options}
    </select>
    </div>
  )
}
}

export default SectionInputBox;