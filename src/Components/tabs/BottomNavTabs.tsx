import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core';
import {
  AppBar,
  Tab,
  Tabs
} from '@material-ui/core';
import React, { FunctionComponent, useContext, useState } from 'react';
import SwipeableViews from 'react-swipeable-views';
import { IExercise, ISection } from 'src/DataInterfaces';
import ActionsMenuBar from '../ActionsMenuBar';
import ExerciseContext from '../AppReducer/ExerciseContext';
import { ActionType } from '../AppReducer/ExerciseReducer';
import ExerciseListTab from './ExerciseListTab';
import SectionListTab from './SectionListTab';
import WorkoutMonitorTab from './WorkoutMonitorTab';

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
  },
  tabSelected: {},
  tabsIndicator: {
    backgroundColor: theme.palette.primary.main,
  },
  tabsRoot: {
    borderBottom: '1px solid #e8e8e8',
  },
  typography: {
    padding: theme.spacing.length * 3,
  },
});

const BottomNavTabs: FunctionComponent<IProps> = (props: IProps) => {

  // local state
  const [activeTab, setActiveTab] = useState<number>(0);

  const handleTabChange = (event: React.ChangeEvent, value: number) => {
    setActiveTab(value);
  }

  // app state
  const [state, dispatch] = useContext(ExerciseContext);

  // used state properties
  const { exercises, activeExercise, activeSection } = state;

  // dispatch functions
  const setTime = (time: Date) => dispatch({ type: ActionType.UpdateStartTime, payload: time });
  const save = () => dispatch({ type: ActionType.SaveExercises });
  const setEditSection = (section: ISection) => dispatch({ type: ActionType.SetEditSection, payload: section }); // TODO: should we move this from app to here?
  const deleteSection = (section: ISection) => dispatch({ type: ActionType.DeleteSection, payload: section });
  const updateSectionOrder = (sections: ReadonlyArray<ISection>) => dispatch({ type: ActionType.UpdateAllSections, payload: sections });
  const setEditExercise = (exercise: IExercise) => dispatch({ type: ActionType.SetEditExercise, payload: exercise });
  const deleteExercise = (exercise: IExercise) => { dispatch({ type: ActionType.DeleteExercise, payload: exercise }); return true; };
  const selectExercise = (exercise: IExercise) => dispatch({ type: ActionType.SetActiveExercise, payload: exercise });

  const tabLabels = ["Treeni", "Osiot", "Harjoitukset"];
  const workoutIcon = <i className="material-icons">timer</i>;
  const sectionsIcon = <i className="material-icons">build</i>;
  const exercisesIcon = <i className="material-icons">fitness_center</i>;


  const { classes } = props;
  return (
    <div className={classes.menuBlock}>
      <ActionsMenuBar
        title={tabLabels[activeTab]}
        exercise={state.activeExercise}
        setTime={setTime}
        saveExercises={save}
      />
      <div className={classes.controlsContainer}>
        <SwipeableViews containerStyle={{ height: '100%' }}
          style={{ height: '100%' }}
          axis={'x'}
          index={activeTab}
          onChangeIndex={setActiveTab}
        >
          <WorkoutMonitorTab
            exercise={activeExercise}
            activeSection={activeSection}
          />
          <SectionListTab
            selected={exercises.indexOf(activeExercise)}
            exercise={activeExercise}
            setEditSection={setEditSection}
            deleteSection={deleteSection}
            updateSectionOrder={updateSectionOrder} />
          <ExerciseListTab
            exercises={exercises}
            selected={exercises.indexOf(activeExercise)}
            toggleExerciseDialog={setEditExercise}
            deleteExercise={deleteExercise}
            selectExercise={selectExercise} />
        </SwipeableViews>
      </div>
      <AppBar
        position="static"
        color="default">
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          indicatorColor="secondary"
          textColor="secondary"
          variant="standard"
          centered={true}
        >
          <Tab classes={{ root: classes.tabRoot, selected: classes.tabSelected }} label={tabLabels[0]} icon={workoutIcon} />
          <Tab classes={{ root: classes.tabRoot, selected: classes.tabSelected }} label={tabLabels[1]} icon={sectionsIcon} />
          <Tab classes={{ root: classes.tabRoot, selected: classes.tabSelected }} label={tabLabels[2]} icon={exercisesIcon} />
        </Tabs>
      </AppBar>
    </div>
  );
}

export default React.memo(withStyles(styles, { withTheme: true })(BottomNavTabs));
