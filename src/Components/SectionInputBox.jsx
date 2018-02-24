import React, {Component} from 'react';

class SectionInputBox extends Component {

  constructor(){
    super();
    this.state = {
      
    }
    // var colorOptions = [
    //   {"dark blue":"#1b85b8"}, //-> dark blue
    //   {"dark grey":"#5a5255"}, //-> dark grey
    //   {"dark green":"#559e83"}, //-> dark green
    //   {"dark red":"#ae5a41"}, //-> dark red
    //   {"olive green":"#c3cb71"}, //-> olive green
    //   {"none":"none"}
    // ]

  }

  getColorOptions(){
    
    var colorOptions = [
      {"colorName":"dark blue","colorValue":"#1b85b8"}, //-> dark blue
      {"colorName":"dark grey","colorValue":"#5a5255"}, //-> dark grey
      {"colorName":"dark green","colorValue":"#559e83"}, //-> dark green
      {"colorName":"dark red","colorValue":"#ae5a41"}, //-> dark red
      {"colorName":"olive green","colorValue":"#c3cb71"}, //-> olive green
      {"colorName":"none","colorValue":"none"}
    ]

    // let colorArrLen = colorOptions.len;
    // let options = [];
    // for(let i=0; i< colorArrLen; i++){
    //   let colorCode = colorOptions[i].value;
    //   let colorName = colorOptions[i].key;
    //   options[i] = <option value={colorCode}>colorName</option>
    // }
    // console.log("created " + options.len +" options")
    return colorOptions;
  }


  render(){

    let options = this.getColorOptions().map(optionItem => {
      let colorCode = optionItem.colorValue;
      let colorName = optionItem.colorName;
      let bgColor = "background-color="+{colorCode};
      return <option value={colorCode}><span style={{backgroundColor: colorCode}}> {colorName} </span></option>;
    })

    return(
      <div width="100px" height="100px" style={{backgrounColor: this.props.color}}>
        <textbox height="10px" value={this.props.name}/>
        <textarea height="10px" value={this.props.description}/>
        <textbox height="10px" value={this.props.position}/>
        <select>
        {options}
        </select>
      </div>
    )
  }
}

export default SectionInputBox;