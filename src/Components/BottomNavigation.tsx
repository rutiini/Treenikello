// import BottomNavigation, { BottomNavigationAction } from '@material-ui/core';
import { withStyles } from '@material-ui/core';
// import PropTypes from 'prop-types';
import React, { Component } from 'react';
// import RestoreIcon from 'material-ui-icons/Restore';
// import FavoriteIcon from 'material-ui-icons/Favorite';
// import LocationOnIcon from 'material-ui-icons/LocationOn';

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
      // <BottomNavigation
      //   value={value}
      //   onChange={this.handleChange}
      //   showLabels={true}
      //   className={classes.root}
      // >
      //   <BottomNavigationAction label="Workout" icon={workoutIcon} />
      //   <BottomNavigationAction label="Sections" icon={sectionsIcon} />
      //   <BottomNavigationAction label="Exercises" icon={exercisesIcon} />
      // </BottomNavigation>
      <>
      unused component.
      </>
    );
  }
}


export default withStyles(styles)(SimpleBottomNavigation);