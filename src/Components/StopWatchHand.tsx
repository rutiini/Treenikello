import { createStyles, withStyles, WithStyles } from '@material-ui/core';
import React, { PureComponent } from 'react';

interface IProps extends WithStyles<typeof styles> {
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

const styles = createStyles({
  timerHand: {
    stroke: 'yellow'
  },
  timerHandTip: {
    stroke: 'red'
  }
})

class StopWatchHand extends PureComponent<IProps, {}> {

  public render() {
    const { classes } = this.props;
    return (
      this.props.visible ?
        <g id="timerHand" transform={`rotate(${this.props.rotation} 50 50)`}>
          <line id="timer" x1={this.props.x1} y1={this.props.y1} x2={this.props.x2} y2={this.props.y2} className={classes.timerHand} />
          <line id="timerTip" x1={this.props.x1} y1={this.props.y2} x2={this.props.x2} y2={this.props.y3} className={classes.timerHandTip} />
        </g>
        : null
    )
  }
}

export default withStyles(styles)(StopWatchHand);