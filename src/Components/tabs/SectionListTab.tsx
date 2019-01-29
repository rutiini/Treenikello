import { createStyles, Fab, List, ListItem, withStyles, WithStyles } from '@material-ui/core';
import React, { Component } from 'react';
import { arrayMove, SortableContainer, SortableElement } from 'react-sortable-hoc';
import { IExercise, ISection } from '../../DataInterfaces';
import CompactSectionListItem from '../CompactSectionListItem';

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
  toggleSectionDialog: (section: ISection) => void,
  deleteSection: (section: ISection) => void,
  exercise: IExercise,
  expandedIndex: number,
  selected: number,
  updateSectionOrder: (sections: ISection[]) => void
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
      exercise,
      deleteSection,
      toggleSectionDialog
    } = this.props;

    const SortableItem = SortableElement(({value}: {value: JSX.Element}) =>
      <ListItem className={classes.listItem}>
      {value}
      </ListItem>
    );

    const SortableList = SortableContainer(({items}: {items: JSX.Element[]}) => 
        <List component="nav" className={classes.nav} style={{ paddingTop: 0, paddingBottom: 0 }}>
          {items.map((value: JSX.Element, index: number) => (
            <SortableItem key={`item-${index}`} index={index} value={value}/>
          ))}
        </List>);

    const sections = exercise.defaultSections.map((sectionItem: ISection, index: number) => {
      // MUI style elments
      return (<CompactSectionListItem
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
      <Fab size="medium" color="primary" aria-label="add" onClick={this.addNewSection}><i className="material-icons">add</i></Fab>
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
    this.props.toggleSectionDialog(newSection);
  }

  private setSelectedIndex = (index: number) => {
    this.setState(
      {
        expandedIndex: index === this.state.expandedIndex ? -1 : index
      }
    )
  }
  
  private sorted = ({oldIndex, newIndex}:{oldIndex: number, newIndex: number}) => {
    const {exercise, updateSectionOrder} = this.props;
    const rearranged = arrayMove(exercise.defaultSections,oldIndex,newIndex);
    updateSectionOrder(rearranged);
  }
}


export default withStyles(styles)(SectionListTab);