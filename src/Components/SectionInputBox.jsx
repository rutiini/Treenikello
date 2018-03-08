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
  
  // call the parent remove function with current objects position
  // replace position with unique id for future purpose
  removeSelf(){
    // use obj instead.
    this.props.remove(this.props.section);
  }
  
  // geneate new version based on the given prop name and value..
  getNewSection = (key,value) => {
    
    let newSection = this.props.section;
    switch(key){
      case "color": newSection.color = value
      break;
      case "name": newSection.name = value
      break;
      case "description": newSection.description = value
      break;
      case "duration": newSection.duration = value
      break;
      default : console.log("no changes")
      break;
    }
    
    return newSection;
  }
  
  nameChanged(e){

    this.props.update(this.props.section,this.getNewSection("name",e.target.value))

  }
  
  descriptionChanged(e){
    
    this.props.update(this.props.section,this.getNewSection("description",e.target.value))

  }

  // unnecessary! use the array order to manage position!
  positionChanged(e){
  
  }

  durationChanged(e){

    this.props.update(this.props.section,this.getNewSection("duration",e.target.value))

  }
  colorChanged(e){

    this.props.update(this.props.section,this.getNewSection("color",e.target.value))

  }
  moveDown = () => {
    this.props.moveDown(this.props.section);
  }
  moveUp = () => {
    this.props.moveUp(this.props.section);
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
  
  componentWillMount(){  
    this.options = this.colorOptions.map(optionItem => {
      let colorCode = optionItem.colorValue;
      let colorName = optionItem.colorName;
      
      return <option key={colorName} value={colorCode}>{colorName}</option>;
    })
  }
  
  render(){
    
    return(
      <div className="SectionItemBox" draggable="true" style={{backgroundColor: this.props.section.color}}>
      <div className="MoveArrow" onClick={this.moveUp}>/\</div>
      <div className="HeaderContainer">
      <div className="DeleteSectionBtn" onClick={this.removeSelf.bind(this)}>X</div>
      {/* <input className="PositionSelector" value={this.props.section.position} onChange={this.positionChanged.bind(this)} type="number"></input> */}
      <textarea id="SectionName" className="NameInputBox" value={this.props.section.name} onChange={this.nameChanged.bind(this)} ></textarea>
      </div>
      <textarea className="DescriptionBox" onChange={this.descriptionChanged.bind(this)} value={this.props.section.description}/><br/>
      <input className="DurationSelector" onChange={this.durationChanged.bind(this)} type="number" value={this.props.section.duration}/><br/>
      <select className="ColorSelector" onChange={this.colorChanged.bind(this)} value={this.props.section.color}>
      {this.options}
      </select>
      <div className="MoveArrow" onClick={this.moveDown}>\/</div>
      </div>
    )
  }
}

export default SectionInputBox;