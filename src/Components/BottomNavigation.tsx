import { createStyles, Theme, WithStyles, withStyles } from '@material-ui/core';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction  from '@material-ui/core/BottomNavigationAction';
import React, { Component } from 'react';

interface IProps extends WithStyles<typeof styles> {
}

interface IState {
  selectedTab: number
}

const styles = (theme: Theme) => createStyles({
  root: {
    // '&$selected': {
    //   color: theme.palette.primary.contrastText,
    // },
    color: theme.palette.primary.main,
  },
})

class SimpleBottomNavigation extends Component<IProps, IState> {

  public componentDidMount() {
    this.setState({
      selectedTab: 0,
    });
  }

  public handleChange = (event: Event, selectedTab: number) => {
    this.setState({ selectedTab });
  };

  public render() {
    return (
      <BottomNavigation
        value={this.state.selectedTab}
      >
        <BottomNavigationAction classes={{root: this.props.classes.root}} label="Workout" icon={<i className="material-icons">timer</i>} />
        <BottomNavigationAction classes={{root: this.props.classes.root}} label="Sections" icon={<i className="material-icons">build</i>} />
        <BottomNavigationAction classes={{root: this.props.classes.root}} label="Exercises" icon={<i className="material-icons">fitness_center</i>} />
      </BottomNavigation>
    );
  }
}


export default withStyles(styles)(SimpleBottomNavigation);