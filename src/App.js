import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Clock from './Clock';

class App extends Component {

  constructor(){
    super();
    this.state = {
      sections: []
    }
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
    this.setState({
      startTime: new Date(2018,2,23,22,15,0),
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
    return (
      <div className="App">
        {/* <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">React-treenikello</h1>
        </header> */}
        <Clock sectionItems={this.state.sections} startTime={this.state.startTime}/>
      </div>
    );
  }
}

export default App;
