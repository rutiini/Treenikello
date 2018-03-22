import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import SwipeableViews from 'react-swipeable-views';
import AppBar from 'material-ui/AppBar';
import Tabs, { Tab } from 'material-ui/Tabs';
import Typography from 'material-ui/Typography';
import SectionListTab from './SectionListTab';
import ExerciseListTab from './ExerciseListTab';
import WorkoutMonitorTab from './WorkoutMonitorTab';
import ActionsMenuBar from './ActionsMenuBar';

function TabContainer({ children, dir }) {
  return (
    <Typography component="div" dir={dir} style={{ padding: 8 * 3 }}>
      {children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
  dir: PropTypes.string.isRequired,
};

const styles = theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    width: "100%",
  },
  buttonRight: {
    flex: 1
  }
});

class BottomNavTabs extends Component {
  state = {
    value: 0,
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };

  handleChangeIndex = index => {
    this.setState({ value: index });
  };

  render() {
    const { 
      classes, 
      theme, 
      exercises, 
      selectedExerciseIndex, 
      moveUp, 
      moveDown, 
      updateSection, 
      deleteSection,
      setTime,
      selectExercise,
      activeSectionIndex,
      handleSectionEditToggle,
      handleSubmit
    } = this.props;

    const tabLabels = ["Treeni","Osiot","Harjoitukset"]
    const workoutIcon = <i className="material-icons">timer</i>
    const sectionsIcon = <i className="material-icons">build</i>
    const exercisesIcon = <i className="material-icons">fitness_center</i>

    return (
      <div className={classes.root}>
      <ActionsMenuBar title={tabLabels[this.state.value]} 
      exercises={exercises} 
      selectedExerciseIndex={selectedExerciseIndex} 
      setTime={setTime} 
      handleSubmit={handleSubmit}/>
      <SwipeableViews
          axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
          index={this.state.value}
          onChangeIndex={this.handleChangeIndex}
          >
          <TabContainer dir={theme.direction}><WorkoutMonitorTab exercise={exercises[selectedExerciseIndex]} activeSectionIndex={activeSectionIndex}/></TabContainer>
          <TabContainer dir={theme.direction}><SectionListTab 
          exercise={exercises[selectedExerciseIndex]} 
          moveUp={moveUp} 
          moveDown={moveDown} 
          update={updateSection} 
          deleteSection={deleteSection}
          handleSectionEditToggle={handleSectionEditToggle}
          /></TabContainer>
          <TabContainer dir={theme.direction}><ExerciseListTab exercises={exercises} selectedExerciseIndex={selectedExerciseIndex} selectExercise={selectExercise}/></TabContainer>
        </SwipeableViews>
        <AppBar position="static" color="default">
          <Tabs
            value={this.state.value}
            onChange={this.handleChange}
            indicatorColor="primary"
            textColor="primary"
            fullWidth
            centered
          >
            <Tab label={tabLabels[0]} icon={workoutIcon} />
            <Tab label={tabLabels[1]} icon={sectionsIcon} />
            <Tab label={tabLabels[2]} icon={exercisesIcon} />
          </Tabs>
        </AppBar>
      </div>
    );
  }
}

BottomNavTabs.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(BottomNavTabs);
