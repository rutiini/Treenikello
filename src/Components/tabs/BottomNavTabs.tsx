import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core';
import {
  AppBar,
  Tab,
  Tabs
} from '@material-ui/core';
import React, { ChangeEvent, Component } from 'react';
import SwipeableViews from 'react-swipeable-views';
import { IExerciseContext } from '../../DataInterfaces';
import { withExerciseContext } from '../../ExerciseContext';
import ActionsMenuBar from '../ActionsMenuBar';
import ExerciseListTab from './ExerciseListTab';
import SectionListTab from './SectionListTab';
import WorkoutMonitorTab from './WorkoutMonitorTab';

// TODO: remove state, make sfc
interface IState {
  value: number
}

interface IProps extends WithStyles<typeof styles> {
  exerciseContext?: IExerciseContext
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
      exercises,
      selectedExerciseIndex,
      activeSectionIndex,
      setTime, 
      saveExercises
    } = this.ctxt();

    const tabLabels = ["Treeni", "Osiot", "Harjoitukset"]
    const workoutIcon = <i className="material-icons">timer</i>
    const sectionsIcon = <i className="material-icons">build</i>
    const exercisesIcon = <i className="material-icons">fitness_center</i>

    return (
      <div className={classes.menuBlock}>
        <ActionsMenuBar
          title={tabLabels[this.state.value]}
          exercises={exercises}
          selectedExerciseIndex={selectedExerciseIndex}
          setTime={setTime}
          saveExercises={saveExercises} />
        <div className={classes.controlsContainer}>
          <SwipeableViews containerStyle={{height: '100%'}}
            style={{ height: '100%' }}
            // axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
            axis={'x'}
            index={this.state.value}
            onChangeIndex={this.handleChangeIndex}
          >
            <WorkoutMonitorTab
              exercise={exercises[selectedExerciseIndex]}
              activeSectionIndex={activeSectionIndex}
            />
            <SectionListTab/>
            <ExerciseListTab/>
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
            fullWidth={true}
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
  
  // todo: refactor the context to come directly from props..
  private ctxt = () => this.props.exerciseContext as IExerciseContext;
}

export default withExerciseContext(withStyles(styles, { withTheme: true })(BottomNavTabs));
