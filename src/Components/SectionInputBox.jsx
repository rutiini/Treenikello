import React, {Component} from 'react';
import '../App.css';
import {colorOptions} from '../Store'

class SectionInputBox extends Component {

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
  
  componentWillMount(){  
    this.options = colorOptions.map(optionItem => {
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