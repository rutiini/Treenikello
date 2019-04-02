import { createStyles, Fab, List, ListItem, withStyles, WithStyles } from '@material-ui/core';
import React, { FunctionComponent, useState } from 'react';
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
  exercise: IExercise,
  selected: number,
  toggleSectionDialog(section: ISection): void,
  deleteSection(section: ISection): void,
  updateSectionOrder(sections: ReadonlyArray<ISection>): void
}

const SectionListTab: FunctionComponent<IProps> = (props: IProps) => {

  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const { classes,
  } = props;
  const {
    exercise,
    deleteSection,
    toggleSectionDialog,
    updateSectionOrder
  } = props;

  const addNewSection = () => {
    const newSection: ISection = {
      color: "",
      description: "",
      duration: 0,
      key: "",
      name: "",
      setupTime: 0
    }
    props.toggleSectionDialog(newSection);
  }

  const setSelectedIndex = (index: number) => {
    setExpandedIndex(index === expandedIndex ? -1 : index);
  }

  const sorted = ({ oldIndex, newIndex }: { oldIndex: number, newIndex: number }) => {
    const rearranged: ReadonlyArray<ISection> = arrayMove([...exercise.defaultSections], oldIndex, newIndex);
    updateSectionOrder(rearranged);
  }

  const SortableItem = SortableElement(({ value }: { value: JSX.Element }) =>
    <ListItem className={classes.listItem}>
      {value}
    </ListItem>
  );

  const SortableList = SortableContainer(({ items }: { items: JSX.Element[] }) =>
    <List component="nav" className={classes.nav} style={{ paddingTop: 0, paddingBottom: 0 }}>
      {items.map((value: JSX.Element, index: number) => (
        <SortableItem key={`item-${index}`} index={index} value={value} />
      ))}
    </List>);

  const sections = exercise.defaultSections.map((sectionItem: ISection, index: number) => {
    // MUI style elments
    return (<CompactSectionListItem
      key={`item-${index}`}
      section={sectionItem}
      expanded={index === expandedIndex}
      index={index}
      setIndex={setSelectedIndex}
      editSection={toggleSectionDialog}
      deleteSection={deleteSection}
    />)
  })

  const addNewButton = <ListItem className={classes.listItem} key="add-section-button">
    <Fab size="medium" color="primary" aria-label="add"
      onClick={addNewSection}
    ><i className="material-icons">add</i>
    </Fab>
  </ListItem>

  // const list = SortableContainer(() => <List component="nav" className={classes.nav} style={{ paddingTop: 0, paddingBottom: 0 }}>{[...sections, addNewButton]}</List>)

  return (
    <div className={classes.root}>
      <SortableList items={sections} onSortEnd={sorted} lockAxis={"y"} pressDelay={300} useDragHandle={true} />
      {addNewButton}
    </div>
  );
}

export default withStyles(styles)(SectionListTab);