import React, { PureComponent } from 'react';

interface IProps {
  x1: number,
  x2: number,
  y1: number,
  y2: number,
  y3: number
  color: string,
  tipColor: string,
  rotation: number,
  visible: boolean
}

class StopWatchHand extends PureComponent<IProps, {}> {

  public render() {
    return (
      this.props.visible ?
      <g id="timerHand" transform={`rotate(${this.props.rotation} 50 50)`}>
        <line id="timer" x1={this.props.x1} y1={this.props.y1} x2={this.props.x2} y2={this.props.y2} stroke={this.props.color} />
        <line id="timerTip" x1={this.props.x1} y1={this.props.y2} x2={this.props.x2} y2={this.props.y3} stroke={this.props.tipColor} />
      </g>
      : null
    )
  }
}

export default StopWatchHand;