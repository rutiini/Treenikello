import { Button, createStyles, List, ListItem, withStyles, WithStyles } from '@material-ui/core';
import React, { Component } from 'react';
import { arrayMove, SortableContainer, SortableElement } from 'react-sortable-hoc';
import { IExerciseContext, ISection } from '../../DataInterfaces';
import { withExerciseContext } from '../../ExerciseContext';
import CompactSectionLitItem from '../CompactSectionListItem';

const styles = createStyles({
  listItem: {
    justifyContent: 'center',
    textAlign: 'center',
  },
  root: {
    overflow: 'auto',
    userSelect: 'none',
  }
});

interface IProps extends WithStyles {
  exerciseContext: IExerciseContext
}

interface IState {
  expandedIndex: number
}

class SectionListTab extends Component<IProps, IState>{

  constructor(props: IProps) {
    super(props);
    this.state = {
      expandedIndex: -1
    }
  }

  public render() {
    const { classes,
    } = this.props;
    const {
      exercises,
      selectedExerciseIndex,
      deleteSection,
      toggleSectionDialog
    } = this.props.exerciseContext;

    const SortableItem = SortableElement(({value}: {value: JSX.Element}) =>
      <ListItem className={classes.listItem}>
      {value}
      </ListItem>
    );

    const SortableList = SortableContainer(({items}: {items: JSX.Element[]}) => {
      return (
        <List component="nav" className={classes.nav} style={{ paddingTop: 0, paddingBottom: 0 }}>
          {items.map((value: JSX.Element, index: number) => (
            <SortableItem key={`item-${index}`} index={index} value={value}/>
          ))}
        </List>
      );
    });

    const sections = exercises[selectedExerciseIndex].defaultSections.map((sectionItem, index) => {
      // MUI style elments
      return (<CompactSectionLitItem
        key={`item-${index}`}
        section={sectionItem}
        expanded={index === this.state.expandedIndex}
        index={index}
        setIndex={this.setSelectedIndex}
        editSection={toggleSectionDialog}
        deleteSection={deleteSection}
      />)
    })

    const addNewButton = <ListItem className={classes.listItem} key="add-section-button">
      <Button variant="fab" size="medium" color="primary" aria-label="add" onClick={this.addNewSection}><i className="material-icons">add</i></Button>
    </ListItem>

    // const list = SortableContainer(() => <List component="nav" className={classes.nav} style={{ paddingTop: 0, paddingBottom: 0 }}>{[...sections, addNewButton]}</List>)

    return (
      <div className={classes.root}>
        <SortableList items={sections} onSortEnd={this.sorted} lockAxis={"y"} pressDelay={300} useDragHandle={true}/>
        {addNewButton}
      </div>
    );
  }

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

  private setSelectedIndex = (index: number) => {
    this.setState(
      {
        expandedIndex: index === this.state.expandedIndex ? -1 : index
      }
    )
  }
  
  private sorted = ({oldIndex, newIndex}:{oldIndex: number, newIndex: number}) => {
    const {exercises, selectedExerciseIndex, updateSectionOrder} = this.props.exerciseContext;
    const rearranged = arrayMove(exercises[selectedExerciseIndex].defaultSections,oldIndex,newIndex);
    updateSectionOrder(rearranged);
  }
}


export default withExerciseContext(withStyles(styles)(SectionListTab));