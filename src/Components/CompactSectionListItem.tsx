import { Button, createStyles, ExpansionPanel, ExpansionPanelDetails, ExpansionPanelSummary, IconButton, WithStyles, withStyles } from '@material-ui/core';
import { Typography } from '@material-ui/core';
import React from 'react';
import { ISection } from 'src/DataInterfaces';

const styles = createStyles({
  actionButtonContainer: {
    display: "flex",
    flexDirection: "column",
    float: "right",
  },
  iconButtonContainer: {
    display: "flex",
    flexDirection: "column",
    float: "left",
  },
  justifyCenter: {
    justifyContent: "space-between",
    width: "100%"
  },
})

interface IProps {
  classes: {
    justifyCenter: string,
    actionButtonContainer: string,
    iconButtonContainer: string
  },
  section: ISection,
}

/**
 * This is an evolved version fo the sectionList item which has a cumbersome look and does not scale
 * well to mobile UI.
 * Role of this component is to serve as the content of a list item representing an exercise sections properties
 */
<<<<<<< HEAD
const CompactSectionLitItem: React.SFC<IProps & WithStyles<'justifyCenter'>> = (props: IProps) => {
  const {setupTime,duration,name,description} = props.section;
=======
const CompactSectionLitItem: React.SFC<IProps & WithStyles<'justifyCenter' | 'actionButtonContainer' | 'iconButtonContainer'>> = (props: IProps) => {
  const { setupTime, duration, name, description, color } = props.section;
  const { classes } = props;
  const deleteIcon = <i className="material-icons">delete</i>
  const editIcon = <i className="material-icons">edit</i>

  // TODO: add icon and color selector for the button on the left
  const exerciseIcon = <i className="material-icons">fitness_center</i>
  // TODO: move the icon to the summary, it can be a simple icon, not a button. The icon will only indicate type and color of exercise.
  // TODO: change expand behavior so that only one section can be open?
>>>>>>> d85043bd9102b426396bdaf011f898e007a77400

  const text = `${name} | ${setupTime} | ${duration}`
  const content =
    <ExpansionPanel defaultExpanded={false}>
      <ExpansionPanelSummary className={classes.justifyCenter}>
        <Typography variant="h4" className={classes.justifyCenter}>{text}</Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails className={props.classes.justifyCenter}>
        <div className={classes.iconButtonContainer}>
          <Button variant="fab" style={{ background: color }}>{exerciseIcon}</Button>
        </div>
        <Typography component="p" style={{width: "inherit"}}>{description}</Typography>
        <div className={classes.actionButtonContainer}>
          <IconButton>{editIcon}</IconButton>
          <IconButton>{deleteIcon}</IconButton>
        </div>
      </ExpansionPanelDetails>
    </ExpansionPanel>

  return (
    <div style={{ width: "100%", userSelect: "none" }}>
      {content}
    </div>
  );
}

export default withStyles(styles)(CompactSectionLitItem);