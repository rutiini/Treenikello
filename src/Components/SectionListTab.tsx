import { Button, createStyles, List, ListItem, withStyles } from '@material-ui/core';
import React, { PureComponent } from 'react';
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

class SectionListTab extends PureComponent<IProps>{

  private sections: JSX.Element[];

  constructor(props: IProps) {
    super(props);

    const { classes,
      exercise,
      moveUp,
      moveDown,
      deleteSection,
      handleSectionEditToggle } = props;

    this.sections = exercise.defaultSections.map((sectionItem, index) => {
      const inputBoxKey = sectionItem.key;
      // MUI style elments
      return (
        <ListItem className={classes.listItem} key={inputBoxKey}>
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
  }
  public render() {
    const {classes} = this.props;
    return (
      <div className={classes.root}>
        <List component="nav" className={classes.nav} style={{ paddingTop: 0, paddingBottom: 0 }}>
          {this.sections}
          <ListItem className={classes.listItem} key="add-section-button">
            <Button variant="fab" size="medium" color="secondary" aria-label="add" onClick={this.addNewSection}><i className="material-icons">add</i></Button>
          </ListItem>
        </List>
      </div>
    );
  }

  private addNewSection(){
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