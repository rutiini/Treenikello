import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import BottomNavigation, { BottomNavigationAction } from 'material-ui/BottomNavigation';
// import RestoreIcon from 'material-ui-icons/Restore';
// import FavoriteIcon from 'material-ui-icons/Favorite';
// import LocationOnIcon from 'material-ui-icons/LocationOn';

const styles = {
  root: {
    // width: 500,
  },
};

class SimpleBottomNavigation extends React.Component {
  state = {
    value: 0,
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };

  render() {
    const { classes } = this.props;
    const { value } = this.state;
    const workoutIcon = <i className="material-icons">timer</i>
    const sectionsIcon = <i className="material-icons">build</i>
    const exercisesIcon = <i className="material-icons">fitness_center</i>

    return (
      <BottomNavigation
        value={value}
        onChange={this.handleChange}
        showLabels
        className={classes.root}
      >
      
      <BottomNavigationAction label="Workout" icon={workoutIcon} />
        <BottomNavigationAction label="Sections" icon={sectionsIcon} />
        <BottomNavigationAction label="Exercises" icon={exercisesIcon} />
      </BottomNavigation>
    );
  }
}

SimpleBottomNavigation.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SimpleBottomNavigation);