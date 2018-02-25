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
  
  // call the parent remove function with current objects position
  // replace position with unique id for future purpose
  removeSelf(){
    console.log("removing section " + this.props.section.position)
    // remove the section from state..
    this.props.remove(this.props.section.position)
  }
  
  nameChanged(el){
    let newState = this.props.section;
    newState.name = this.
    this.props.update(newState);
  }
  descriptionChanged(el){
    let newState = this.props.section;
    newState.description = el.value;
    this.props.update(newState);
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
      <div className="SectionItemBox" onChange={this.descriptionChanged.bind(this)} style={{backgroundColor: this.props.section.color}}>
      <div className="HeaderContainer">
      <input className="PositionSelector" defaultValue={this.props.section.position} onChange={this.descriptionChanged.bind(this)} type="number"></input>
      <textarea id="SectionName" className="NameInputBox" defaultValue={this.props.section.name} onChange={this.nameChanged.bind(this)}></textarea>
      <div height="2em" width="2em" onClick={this.removeSelf.bind(this)}>X</div>
      </div>
      <textarea className="DescriptionBox" onChange={this.descriptionChanged.bind(this)} defaultValue={this.props.section.description}/><br/>
      <input className="DurationSelector" onChange={this.descriptionChanged.bind(this)} type="number" defaultValue={this.props.section.duration}/><br/>
      <select className="ColorSelector" onChange={this.descriptionChanged.bind(this)} defaultValue={this.props.section.color}>
      {this.options}
      </select>
      </div>
    )
  }
}

export default SectionInputBox;