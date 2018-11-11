import { Button, createStyles, List, ListItem, withStyles, WithStyles } from '@material-ui/core';
import React, { Component } from 'react';
import { IExerciseContext, ISection } from '../../DataInterfaces';
import { withExerciseContext } from '../../ExerciseContext';
import CompactSectionLitItem from '../CompactSectionListItem';
import SectionListItem from '../SectionListItem';

const styles = createStyles({
  listItem: {
    justifyContent: 'center',
    textAlign: 'center',
  },
  root: {
    overflow: 'auto',
  }
});

interface IProps extends WithStyles{
  exerciseContext: IExerciseContext
}

class SectionListTab extends Component<IProps>{

  constructor(props: IProps) {
    super(props);

  }

  public render() {
    const { classes,
    } = this.props;
    const { 
      exercises, 
      selectedExerciseIndex, 
      moveSectionUp, 
      moveSectionDown, 
      deleteSection, 
      toggleSectionDialog 
    } = this.props.exerciseContext;

    const sections = exercises[selectedExerciseIndex].defaultSections.map((sectionItem, index) => {
      // MUI style elments
      // return(
      // <ListItem className={classes.listItem} key={index}>
      //   <CompactSectionLitItem section={sectionItem}/>
      // </ListItem>
      // )

      return (
        <ListItem className={classes.listItem} key={index}>
          <SectionListItem
            section={sectionItem}
            moveUp={moveSectionUp}
            moveDown={moveSectionDown}
            deleteSection={deleteSection}
            handleSectionEditToggle={toggleSectionDialog}
          />
        </ListItem>
      )
    })

    return (
      <div className={classes.root}>
        <List component="nav" className={classes.nav} style={{ paddingTop: 0, paddingBottom: 0 }}>
          {sections}
          <ListItem className={classes.listItem} key="add-section-button">
            <Button variant="fab" size="medium" color="primary" aria-label="add" onClick={this.addNewSection}><i className="material-icons">add</i></Button>
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
      setupTime: 0
    }
    this.props.exerciseContext.toggleSectionDialog(newSection);
  }
}


export default withExerciseContext(withStyles(styles)(SectionListTab));