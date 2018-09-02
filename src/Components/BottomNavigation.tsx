import { BottomNavigationAction } from '@material-ui/core';
import { BottomNavigation } from 'material-ui';
import React, { Component } from 'react';

interface IState {
  selectedTab: number
}

class SimpleBottomNavigation extends Component<{}, IState> {

  public componentDidMount() {
    this.setState({
      selectedTab: 0,
    });
  }

  public handleChange = (event: Event, selectedTab: number) => {
    this.setState({ selectedTab });
  };

  public render() {
    const { selectedTab } = this.state;
    const workoutIcon = <i className="material-icons">timer</i>
    const sectionsIcon = <i className="material-icons">build</i>
    const exercisesIcon = <i className="material-icons">fitness_center</i>

    return (
      <BottomNavigation
        selectedIndex={selectedTab}
      >
        <BottomNavigationAction label="Workout" icon={workoutIcon} />
        <BottomNavigationAction label="Sections" icon={sectionsIcon} />
        <BottomNavigationAction label="Exercises" icon={exercisesIcon} />
      </BottomNavigation>
    );
  }
}


export default SimpleBottomNavigation;