import { BottomNavigationAction, withStyles } from '@material-ui/core';
import { BottomNavigation } from 'material-ui';
import React, { Component } from 'react';

const styles = {
  root: {
    // width: 500,
  },
};

interface IProps {
  classes: any
}

interface IState {
  value: number
}

class SimpleBottomNavigation extends Component<IProps, IState> {

  public componentDidMount() {
    this.setState({
      value: 0,
    });
  }

  public handleChange = (event: Event, value: number) => {
    this.setState({ value });
  };

  public render() {
    const { classes } = this.props;
    const { value } = this.state;
    const workoutIcon = <i className="material-icons">timer</i>
    const sectionsIcon = <i className="material-icons">build</i>
    const exercisesIcon = <i className="material-icons">fitness_center</i>

    return (
      <BottomNavigation
        selectedIndex={value}
        className={classes.root}
      >
        <BottomNavigationAction label="Workout" icon={workoutIcon} />
        <BottomNavigationAction label="Sections" icon={sectionsIcon} />
        <BottomNavigationAction label="Exercises" icon={exercisesIcon} />
      </BottomNavigation>
    );
  }
}


export default withStyles(styles)(SimpleBottomNavigation);