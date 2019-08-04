import { createStyles, IconButton, WithStyles, withStyles } from '@material-ui/core';
import { Typography } from '@material-ui/core';
import React from 'react';
import { SortableHandle } from 'react-sortable-hoc';
import { ISection } from 'src/DataInterfaces';

const styles = createStyles({
  content:{
    width: "100%", 
    userSelect: "none",
    display: "flex",
    flexDirection: "row",
    justifyItems: "space-between",
    maxHeight:"50px",
    overflow: "hidden"
  },
  rightContainer: {
    width: "15%"
  },
  leftContainer: {
    width: "15%"
  },
  middleContainer: {
    width: "70%"
  },
})

interface IProps extends WithStyles {
  section: ISection,
  index: number,
  editSection: (section: ISection) => void
}

/**
 * This is an evolved version fo the sectionList item which has a cumbersome look and does not scale
 * well to mobile UI.
 * Role of this component is to serve as the content of a list item representing an exercise sections properties
 */
const CompactSectionListItem: React.FC<IProps & WithStyles> = (props: IProps) => {
  const { 
    classes,
    editSection,
    section } = props;
  const { setupTime, duration, name, description } = section;

  const editSectionClicked = (e: never) => {
    editSection(section);
  }

  const DragHandle = SortableHandle(() => <i className="material-icons" style={{ color: "white", fontSize: 40, cursor: "row-resize" }}>unfold_more</i>);

  const text = `${name} | ${setupTime} | ${duration}`
  return (
    <div className={classes.content}>
        <div className={classes.leftContainer}>
        <DragHandle/>
        </div>
        <div className={classes.middleContainer}>
        <Typography variant="h5" className={classes.justifyCenter}>{text}</Typography>
        <Typography component="h6" style={{overflow: "ellipsis"}}>{description}</Typography>
        </div>
        <div className={classes.rightContainer}>
          <IconButton onClick={editSectionClicked}>
            <i className="material-icons">edit</i>
          </IconButton>
        </div>
    </div>
  );
}

export default withStyles(styles)(CompactSectionListItem);