import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core';
import {
  AppBar,
  Tab,
  Tabs
} from '@material-ui/core';
import React, { ChangeEvent, Component, Context } from 'react';
import SwipeableViews from 'react-swipeable-views';
// import { IExercise } from 'src/DataInterfaces';
// import { IExerciseContext } from '../../DataInterfaces';
// import { ExerciseContext } from '../../ExerciseContext';
import ActionsMenuBar from '../ActionsMenuBar';
import { AppContext, IAppContext } from '../AppContext';
import ExerciseListTab from './ExerciseListTab';
import SectionListTab from './SectionListTab';
import WorkoutMonitorTab from './WorkoutMonitorTab';

// TODO: remove state, make sfc
interface IState {
  value: number
}

interface IProps extends WithStyles<typeof styles> {
}

const styles = (theme: Theme) => createStyles({
  buttonRight: {
    flex: 1
  },
  controlsContainer: {
    height: "100%",
    [theme.breakpoints.between("md", "xl")]: {
      borderLeftStyle: 'solid',
      borderLeftWidth: 2,
  }
  },
  menuBlock: {
    [theme.breakpoints.up('sm')]: {
      height: "calc(55vh - 64px - 72px)"
    },
    [theme.breakpoints.down('xs')]: {
      height: "calc(55vh - 56px - 72px)"
    },
    [theme.breakpoints.between("md", "xl")]: {
      float: "right",
      height: "calc(100vh - 64px - 72px)",
      width: "49vw",
    }
  },
  root: {
    // backgroundColor: theme.palette.background.paper,
  },
  tabContent: {
    alignContent: 'center'
  },
  // check which of these properties are necessary
  tabRoot: {
    '&$tabSelected': {
      color: theme.palette.primary.main,
      // fontWeight: theme.typography.fontWeightMedium,
    },
    '&:focus': {
      color: theme.palette.primary.main,
    },
    '&:hover': {
      color: theme.palette.primary.main,
      opacity: 1,
    },
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    // fontWeight: theme.typography.fontWeightRegular,
    // marginRight: theme.spacing.unit * 4,
    // minWidth: 72,
    // textTransform: 'initial',
  },
  tabSelected: {},
  tabsIndicator: {
    backgroundColor: theme.palette.primary.main,
  },
  tabsRoot: {
    borderBottom: '1px solid #e8e8e8',
  },
  typography: {
    padding: theme.spacing.unit * 3,
  },
});

class BottomNavTabs extends Component<IProps, IState> {
  public static contextType: Context<IAppContext> = AppContext;
  public context!: React.ContextType<typeof AppContext>

  constructor(props: IProps) {
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
    const { classes } = this.props;
    const {
      activeSection,
      exercises,
      selectedExercise,
      selectedSection
    } = this.context.state;

    const {
      setTime,
      setEditSection,
      deleteSection,
      updateSectionOrder,
      setEditExercise,
      setSelectedExercise,
      deleteExercise,
      save
    } = this.context.dispatch;

    const tabLabels = ["Treeni", "Osiot", "Harjoitukset"]
    const workoutIcon = <i className="material-icons">timer</i>
    const sectionsIcon = <i className="material-icons">build</i>
    const exercisesIcon = <i className="material-icons">fitness_center</i>

    return (
      <div className={classes.menuBlock}>
        <ActionsMenuBar
          title={tabLabels[this.state.value]}
          // TODO: replace with just exercise?
          exercise={selectedExercise}
          setTime={setTime}
          saveExercises={save} 
          />
        <div className={classes.controlsContainer}>
          <SwipeableViews containerStyle={{height: '100%'}}
            style={{ height: '100%' }}
            // axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
            axis={'x'}
            index={this.state.value}
            onChangeIndex={this.handleChangeIndex}
          >
            <WorkoutMonitorTab
              exercise={selectedExercise}
              activeSection={activeSection}
            />
            <SectionListTab 
              selected={exercises.indexOf(selectedExercise)}
              exercise={selectedExercise}
              expandedIndex={selectedSection ? selectedExercise.defaultSections.indexOf(selectedSection) : -1}
              toggleSectionDialog={setEditSection}
              deleteSection={deleteSection}
              updateSectionOrder={updateSectionOrder}/>
            <ExerciseListTab 
              exercises={exercises}
              selected={exercises.indexOf(selectedExercise)}
              toggleExerciseDialog={setEditExercise}
              deleteExercise={deleteExercise}
              selectExercise={setSelectedExercise}/>
          </SwipeableViews>
        </div>
        <AppBar
          position="static"
          color="default">
          <Tabs
            value={this.state.value}
            onChange={this.handleChange}
            indicatorColor="secondary"
            textColor="secondary"
            variant="standard"
            centered={true}
          >
            <Tab classes={{root: classes.tabRoot, selected: classes.tabSelected}} label={tabLabels[0]} icon={workoutIcon} />
            <Tab classes={{root: classes.tabRoot, selected: classes.tabSelected}} label={tabLabels[1]} icon={sectionsIcon} />
            <Tab classes={{root: classes.tabRoot, selected: classes.tabSelected}} label={tabLabels[2]} icon={exercisesIcon} />
          </Tabs>
        </AppBar>
      </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(BottomNavTabs);
