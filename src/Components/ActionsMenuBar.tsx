import { 
  AppBar,
  createStyles, 
  Fab, 
  Toolbar, 
  Typography, 
  withStyles} from '@material-ui/core';
import React, { Component } from 'react';
import { IExercise } from '../DataInterfaces';

const styles = createStyles({
  button: {
    marginRight: 10,
  },
  flex: {
    flex: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  root: {
    alignContent: "center",
    flexGrow: 1,
    userSelect: "none",
  },
  timeInput: {
    fontSize: 20,
    textColor: '#ffffff',
  },
});

interface IProps {
  classes: any,
  exercises: IExercise[],
  selectedExerciseIndex: number,
  setTime: (time: Date) => void,
  title: string,
  saveExercises: (exercises: IExercise[]) => void
}

interface IState {
  open: boolean
}

export default withStyles(styles)(class ActionsMenuBar extends Component<IProps, IState> {
  
  public componentDidMount(){

    this.setState({
      open: false
    });
  }

  public render() {
    const { 
      classes,
      title,
    } = this.props;

    return (
      <div className={classes.root}>
        <AppBar position="static" color="secondary">
          <Toolbar>
            <Fab color="primary" onClick={this.saveAllExercises}><i className="material-icons">save</i></Fab>
            <Typography variant="h4" color="inherit" className={classes.flex}>
              {title}
            </Typography>
            <Fab color="primary" onClick={this.setTimeNow}><i className="material-icons">play_circle_outline</i></Fab>
          </Toolbar>
        </AppBar>
      </div>
    );
  }
  
  private setTimeNow = () => {
    this.props.setTime(new Date());
  }

  private saveAllExercises = () => {
    this.props.saveExercises(this.props.exercises)
  }
});
