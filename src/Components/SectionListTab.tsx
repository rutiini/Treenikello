import { Button, createStyles, List, ListItem, withStyles } from '@material-ui/core';
import React, { Component } from 'react';
import { IExercise, ISection } from '../DataInterfaces';
import SectionListItem from './SectionListItem';

const styles = createStyles({
  listItem: {
    justifyContent: 'center',
    textAlign: 'center',
  },
  root: {
    // height: '100%',
    // backgroundColor: theme.palette.background.paper,
    overflow: 'auto',
  }
});

interface IProps {
  classes: any,
  exercise: IExercise,
  moveUp: (section: ISection) => void,
  moveDown: (section: ISection) => void,
  deleteSection: (section: ISection) => void,
  handleSectionEditToggle: (section: ISection) => void
}

class SectionListTab extends Component<IProps>{

  constructor(props: IProps) {
    super(props);

  }

  public render() {
    const { classes,
      exercise,
      moveUp,
      moveDown,
      deleteSection,
      handleSectionEditToggle } = this.props;

    const sections = exercise.defaultSections.map((sectionItem, index) => {
      // MUI style elments
      return (
        <ListItem className={classes.listItem} key={index}>
          <SectionListItem 
            section={sectionItem}
            moveUp={moveUp}
            moveDown={moveDown}
            deleteSection={deleteSection}
            handleSectionEditToggle={handleSectionEditToggle}
          />
        </ListItem>
      )
    })

    return (
      <div className={classes.root}>
        <List component="nav" className={classes.nav} style={{ paddingTop: 0, paddingBottom: 0 }}>
          {sections}
          <ListItem className={classes.listItem} key="add-section-button">
            <Button variant="fab" size="medium" color="secondary" aria-label="add" onClick={this.addNewSection}><i className="material-icons">add</i></Button>
          </ListItem>
        </List>
      </div>
    );
  }
  
  // binds automagically!
  private addNewSection = () => {
    const newSection: ISection = {
      color: "",
      description: "",
      duration: 0,
      key: "",
      name: "",
    }
    this.props.handleSectionEditToggle(newSection);
  }
}

export default withStyles(styles)(SectionListTab);