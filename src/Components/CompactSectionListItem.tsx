import { createStyles, ExpansionPanel, ExpansionPanelDetails, ExpansionPanelSummary, WithStyles, withStyles } from '@material-ui/core';
import {Typography} from '@material-ui/core';
import React from 'react';
import { ISection } from 'src/DataInterfaces';


const styles = createStyles({
  justifyCenter:{
    justifyContent: "center"
  }
})

interface IProps{
  classes: {
    justifyCenter: string
  },
  section: ISection,
}

/**
 * This is an evolved version fo the sectionList item which has a cumbersome look and does not scale
 * well to mobile UI.
 * Role of this component is to serve as the content of a list item representing an exercise sections properties
 */
const CompactSectionLitItem: React.SFC<IProps & WithStyles<'justifyCenter'>> = (props: IProps) => {
  const {setupTime,duration,name,description} = props.section  

  const text = `${name} | ${setupTime} | ${duration}`
  const content = 
  <ExpansionPanel  defaultExpanded={false}>
    <ExpansionPanelSummary className={props.classes.justifyCenter}>
    <Typography variant="h4" className={props.classes.justifyCenter}>{text}</Typography>
    </ExpansionPanelSummary>
    <ExpansionPanelDetails className={props.classes.justifyCenter}>
      <Typography component="p">{description}</Typography>
    </ExpansionPanelDetails>
  </ExpansionPanel>

  return (
    <div style={{width: "100%", userSelect:"none"}}>
      {content}
    </div>
  );
}


export default withStyles(styles)(CompactSectionLitItem);