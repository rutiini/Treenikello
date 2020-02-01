import { createStyles, Fab, List, ListItem, withStyles, WithStyles } from '@material-ui/core';
import React, { FunctionComponent, useContext, useState } from 'react';
import { arrayMove, SortableContainer, SortableElement } from 'react-sortable-hoc';
import { IExercise, ISection } from '../../DataInterfaces';
import CompactSectionListItem from '../CompactSectionListItem';
import ExerciseContext from '../AppReducer/ExerciseContext';
import SectionEditor from '../dialogs/SectionEditor';
import { ActionType } from '../AppReducer/ExerciseReducer';

const styles = createStyles({
  listItem: {
    justifyContent: 'center',
    textAlign: 'center',
  },
  root: {
    overflow: 'hidden',
    userSelect: 'none',
    height: "100%"
  },
  list: {
    height: "100%",
    overflow: "auto",
    transition: "transform 300ms ease-in-out",
    "$root.expanded>&": {
      transform: "translateY(-100%)",
      overflow: "hidden"
    }
  },
  editor: {
    height: "100%",
    overflow: "hidden",
    transition: "transform 300ms ease-in-out",
    "$root.expanded>&": {
      transform: "translateY(-100%)",
    }
  },
});

interface IProps extends WithStyles {
  exercise: IExercise,
  setEditSection(section: ISection): void,
  updateSectionOrder(sections: ReadonlyArray<ISection>): void
}

const SectionListTab: FunctionComponent<IProps> = (props: IProps) => {

  const [state, dispatch] = useContext(ExerciseContext);
  const [addingNewSection, setAddingNewSection] = useState(false);

  const { classes,
  } = props;
  const {
    exercise,
    setEditSection,
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
    dispatch({ type: ActionType.SetEditSection, payload: newSection });
    setAddingNewSection(true);
  }

  const sorted = ({ oldIndex, newIndex }: { oldIndex: number, newIndex: number }) => {
    const rearranged: ReadonlyArray<ISection> = arrayMove([...exercise.defaultSections], oldIndex, newIndex);
    updateSectionOrder(rearranged);
  }

  const updateSection = (section: ISection) => {
    // if section is new, add it to the exercise.
    if (addingNewSection) {
      dispatch({ type: ActionType.AddSection, payload: section });
    } else {
      dispatch({ type: ActionType.UpdateSection, payload: section });
    }
    dispatch({ type: ActionType.SetEditSection, payload: null });
    setAddingNewSection(false);
  }

  const deleteSection = (section: ISection) => {
    dispatch({ type: ActionType.DeleteSection, payload: section });
    dispatch({ type: ActionType.SetEditSection, payload: null });
  }

  const closeEditor = () => {
    dispatch({ type: ActionType.SetEditSection, payload: null });
    setAddingNewSection(false);
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
      index={index}
      editSection={setEditSection}
    />)
  })

  const addNewButton = <ListItem
    className={classes.listItem}
    key="add-section-button">
    <Fab
      size="medium"
      color="primary"
      aria-label="add"
      onClick={addNewSection}
    >
      <i className="material-icons">add</i>
    </Fab>
  </ListItem>

  return (
    <div className={`${classes.root} ${state.editSection ? "expanded" : "collapsed"}`}>
      <div className={`${props.classes.list}`}>
        <SortableList
          items={sections}
          onSortEnd={sorted}
          lockAxis={"y"}
          pressDelay={300}
          useDragHandle={true}
        />
        {addNewButton}
      </div>
      <div className={`${props.classes.editor}`}>
        <SectionEditor
          section={state.editSection}
          updateSection={updateSection}
          deleteSection={deleteSection}
          cancel={closeEditor}
        />
      </div>
    </div>
  );
}

export default withStyles(styles)(SectionListTab);