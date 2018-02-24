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
      
    }
    
  }
  
  nameChanged(el){
    this.setState({
      position: el.value
    })
  }
  descriptionChanged(el){
    this.setState({
      description: el.value
    })
  }
  positionChanged(el){
    this.setState({
      position: el.value
    })
  }
  durationChanged(el){
    this.setState({
      duration: el.value
    })
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
  
  getSelections(){
    var section = {
      position: document.getElementById("position"),
      name: "name",
      description: "asd",
      duration: 10
    }
    return section;
  }
  
  render(){
    
    let options = this.colorOptions.map(optionItem => {
      let colorCode = optionItem.colorValue;
      let colorName = optionItem.colorName;
      
      return <option key={colorName} value={colorCode}>{colorName}</option>;
    })
    
    return(
      <div className="SectionItemBox" onChange={this.descriptionChanged.bind(this)} style={{backgroundColor: this.props.color}}>
      <div className="HeaderContainer">
      <input className="PositionSelector" defaultValue={this.props.position} onChange={this.descriptionChanged.bind(this)} type="number"></input>
      <textarea className="NameInputBox" defaultValue={this.props.name}></textarea>
      <div height="2em" width="2em" onClick={this.props.remove.bind(this)}>X</div>
      </div>
      <textarea className="DescriptionBox" onChange={this.descriptionChanged.bind(this)} defaultValue={this.props.description}/><br/>
      <input className="DurationSelector" onChange={this.descriptionChanged.bind(this)} type="number" defaultValue={this.props.duration}/><br/>
      <select className="ColorSelector" onChange={this.descriptionChanged.bind(this)} defaultValue={this.props.color}>
      {options}
      </select>
      </div>
    )
  }
}

export default SectionInputBox;