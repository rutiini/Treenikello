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
      return <option value={colorCode}><span style={{backgroundColor: colorCode}}> {colorName} </span></option>;
    })

    return(
      <div className="SectionItemBox" style={{backgroundColor: this.props.color}}>
        <input className="PositionSelector" type="number" height="10px" value={this.props.position}></input>
        <textbox className="NameInputBox"/>{this.props.name}<br/>
        <textarea className="DescriptionBox" height="10px" width="90%" onChange={this.descriptionChanged.bind(this)} value={this.props.description}/><br/>
        <input className="DurationSelector" type="number" height="10px" value={this.props.duration}/><br/>
        <select className="ColorSelector">
        {options}
        </select>
      </div>
    )
  }
}

export default SectionInputBox;