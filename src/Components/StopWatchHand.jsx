import React, {Component} from 'react';
import './StopWatchHand.css'

class StopWatchHand extends Component {
  
  // this should be a pure component probably since not much is going on in here, we just need to optimize rendering to handle the component alone.
  // pass stuff to props from the parent, remove state.
  render() {
    return (
      <g id="timerHand">
      <line id="timer" x1={this.props.x1} y1={this.props.y1} x2={this.props.x2} y2={this.props.y2} stroke={this.props.color}/>
      <line id="timerTip" x1={this.props.x1} y1={this.props.y2} x2={this.props.x2} y2={this.props.y3} stroke={this.props.tipColor} />
      </g>
    )   
  }
}

export default StopWatchHand;