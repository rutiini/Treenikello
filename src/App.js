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
    
    // defaults -> populate from props provided by the separate editor..
    this.setState({sections: [
      {
        name: 'Alkulämmittely',
        duration: 10,
        position: 1,
        description: '-'
      },
      {
        name: 'Alkuvenyttely',
        duration: 5,
        position: 2,
        description: '--'
      },
      {
        name: 'Tengi',
        duration: 10,
        position: 3,
        description: '---'
      },
      {
        name: 'Päivän aihe',
        duration: 50,
        position: 4,
        description: '----'
      },
      {
        name: 'Loppujumppa',
        duration: 15,
        position: 5,
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
        <Clock secHand="90"  sectionItems={this.state.sections}/>
      </div>
    );
  }
}

export default App;
