import { createStyles, ExpansionPanel, ExpansionPanelDetails, ExpansionPanelSummary, IconButton, WithStyles, withStyles } from '@material-ui/core';
import { Typography } from '@material-ui/core';
import React from 'react';
import { SortableHandle } from 'react-sortable-hoc';
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
    iconButtonContainer: string,
  },
  section: ISection,
  expanded: boolean,
  index: number,
  setIndex: (index: number) => void,
  deleteSection: (section: ISection) => void,
  editSection: (section: ISection) => void
}

/**
 * This is an evolved version fo the sectionList item which has a cumbersome look and does not scale
 * well to mobile UI.
 * Role of this component is to serve as the content of a list item representing an exercise sections properties
 */
const CompactSectionListItem: React.SFC<IProps & WithStyles<'justifyCenter' | 'actionButtonContainer' | 'iconButtonContainer'>> = (props: IProps) => {
  const { 
    classes, 
    expanded, 
    index, 
    setIndex, 
    deleteSection, 
    editSection,
    section } = props;
  const { setupTime, duration, name, description, color } = section;

  const sectionCliked = (e: never) => {
    setIndex(index);
  }
  const deleteSectionClicked = () => {
    deleteSection(section);
  }
  const editSectionClicked = (e: never) => {
    editSection(section);
  }

  const expandIcon = <div onClick={sectionCliked}><i className="material-icons">expand_more</i></div>
  const DragHandle = SortableHandle(() => <i className="material-icons" style={{ color: "white", fontSize: 40, cursor: "row-resize" }}>unfold_more</i>);

  // TODO: implement optional icon property for section, find a suitable set of icons
  const exerciseIcon = <i className="material-icons" style={{ color, fontSize: 40 }}>fitness_center</i>
  // TODO: change expand behavior so that only one section can be open?

  const text = `${name} | ${setupTime} | ${duration}`
  const content =
    <ExpansionPanel defaultExpanded={false} expanded={expanded}>
      <ExpansionPanelSummary className={classes.justifyCenter} expandIcon={expandIcon}>
      <DragHandle/>
        <div className={classes.iconButtonContainer}>
        {exerciseIcon}
        </div>
        <Typography variant="h6" className={classes.justifyCenter}>{text}</Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails className={props.classes.justifyCenter}>
        <Typography component="p" style={{width: "inherit"}}>{description}</Typography>
        <div className={classes.actionButtonContainer}>
          <IconButton onClick={editSectionClicked}>
            <i className="material-icons">edit</i>
          </IconButton>
          <IconButton onClick={deleteSectionClicked}>
            <i className="material-icons">delete</i>
          </IconButton>
        </div>
      </ExpansionPanelDetails>
    </ExpansionPanel>

  return (
    <div style={{ width: "100%", userSelect: "none" }}>
      {content}
    </div>
  );
}

export default withStyles(styles)(CompactSectionListItem);