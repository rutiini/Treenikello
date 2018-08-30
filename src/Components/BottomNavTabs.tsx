import { Theme, withStyles } from '@material-ui/core';
import { AppBar,
  Tab,
  Tabs
} from '@material-ui/core';
import React, { ChangeEvent, Component } from 'react';
import SwipeableViews from 'react-swipeable-views';
import { IExercise, ISection } from '../DataInterfaces';
import ActionsMenuBar from './ActionsMenuBar';
import ExerciseListTab from './ExerciseListTab';
import SectionListTab from './SectionListTab';
import WorkoutMonitorTab from './WorkoutMonitorTab';


interface IState {
  value: number
}

interface IProps {
  classes: any, // TODO find out type
  // theme: any,
  exercises: IExercise[],
  selectedExerciseIndex: number,
  moveUp: (section: ISection) => void,
  moveDown: (section: ISection) => void,
  deleteSection: (section: ISection) => void,
  setTime: (time: Date) => void,
  selectExercise: (name: string) => void,
  activeSectionIndex: number,
  handleSectionEditToggle: (section: ISection) => void,
  handleSubmit: (oldsection: ISection, newsection: ISection) => void,
  handleExerciseEditToggle: (exercise: IExercise) => void,
  deleteExercise: (deleteIndex: number) => void,
  saveExercises: (exercise: IExercise[]) => void,
  editSectionOpen: boolean
}

const styles = (theme: Theme) =>({
  buttonRight: {
    flex: 1
  },
  controlsContainer:{
    overflow: "auto",
    [theme.breakpoints.between("md","xl")]: {
      height: "calc(100vh - 64px - 72px)",
      width:"50vw",
    },
    [theme.breakpoints.up('sm')]: {
      height: "calc(55vh - 64px - 72px - 4px)"
    },
    [theme.breakpoints.down('xs')]: {
      height: "calc(55vh - 56px - 72px - 4px)"
    }
  },
  menuBlock: {
    [theme.breakpoints.between("md","xl")]: {
    // float: "right",
    height: "100vh",
    width: "50vw",
    }
  },
  root: {
    // backgroundColor: theme.palette.background.paper,
  },
  tabContent: {
    alignContent: 'center'
  }
});

class BottomNavTabs extends Component<IProps, IState> {
  constructor(props: IProps){
    super(props);
    this.state = {
      value: 0,
    };
  }

  public handleChange = (event: ChangeEvent<{}>, value: number) => {
    this.setState({ value });
  };

  public handleChangeIndex = (index: number) => {
    this.setState({ value: index });
  };

  public render() {
    const {
      classes,
      exercises,
      selectedExerciseIndex,
      moveUp,
      moveDown,
      deleteSection,
      setTime,
      selectExercise,
      activeSectionIndex,
      handleSectionEditToggle,
      // handleSubmit,
      handleExerciseEditToggle,
      deleteExercise,
      saveExercises
    } = this.props;

    const tabLabels = ["Treeni", "Osiot", "Harjoitukset"]
    const workoutIcon = <i className="material-icons">timer</i>
    const sectionsIcon = <i className="material-icons">build</i>
    const exercisesIcon = <i className="material-icons">fitness_center</i>

    return (
      // <div className="menuBlock">
      <div className={classes.menuBlock}>
        <ActionsMenuBar
          title={tabLabels[this.state.value]}
          exercises={exercises}
          selectedExerciseIndex={selectedExerciseIndex}
          setTime={setTime}
          // handleSubmit={handleSubmit}
          saveExercises={saveExercises} />
        {/* <div className="controlsContainer"> */}
        <div className={classes.controlsContainer}>
          <SwipeableViews
            style={{ height: '100%' }}
            // axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
            axis={'x'}
            index={this.state.value}
            onChangeIndex={this.handleChangeIndex}
          >
              <WorkoutMonitorTab
                exercise={exercises[selectedExerciseIndex]}
                activeSectionIndex={activeSectionIndex}
                // className={classes.tabContent}
                />
              <SectionListTab
                exercise={exercises[selectedExerciseIndex]}
                moveUp={moveUp}
                moveDown={moveDown}
                deleteSection={deleteSection}
                handleSectionEditToggle={handleSectionEditToggle}
              />
              <ExerciseListTab
                exercises={exercises}
                selectedExerciseIndex={selectedExerciseIndex}
                selectExercise={selectExercise}
                handleExerciseEditToggle={handleExerciseEditToggle}
                deleteExercise={deleteExercise} />
          </SwipeableViews>
        </div>
        <AppBar
          position="static"
          color="default">
          <Tabs
            value={this.state.value}
            onChange={this.handleChange}
            indicatorColor="primary"
            textColor="primary"
            fullWidth={true}
            centered={true}
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

export default withStyles(styles, { withTheme: true })(BottomNavTabs);
