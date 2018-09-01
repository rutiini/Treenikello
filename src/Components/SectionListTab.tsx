import { Button, createStyles, List, ListItem, withStyles, WithStyles } from '@material-ui/core';
import React, { Component } from 'react';
import { IExerciseContext, ISection } from '../DataInterfaces';
import { withExerciseContext } from '../ExerciseContext';
import SectionListItem from './SectionListItem';

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
  exerciseContext?: IExerciseContext
}

class SectionListTab extends Component<IProps>{

  constructor(props: IProps) {
    super(props);

  }

  public render() {
    const { classes,
    } = this.props;

    const sections = this.ctxt().exercises[this.ctxt().selectedExerciseIndex].defaultSections.map((sectionItem, index) => {
      // MUI style elments
      return (
        <ListItem className={classes.listItem} key={index}>
          <SectionListItem
            section={sectionItem}
            moveUp={this.ctxt().moveSectionUp}
            moveDown={this.ctxt().moveSectionDown}
            deleteSection={this.ctxt().deleteSection}
            handleSectionEditToggle={this.ctxt().toggleSectionDialog}
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

  private ctxt = () => this.props.exerciseContext as IExerciseContext;

  // binds automagically!
  private addNewSection = () => {
    const newSection: ISection = {
      color: "",
      description: "",
      duration: 0,
      key: "",
      name: "",
    }
    this.ctxt().toggleSectionDialog(newSection);
  }
}


export default withExerciseContext(withStyles(styles)(SectionListTab));