import { createStyles, Fab, List, ListItem, withStyles, WithStyles } from "@material-ui/core";
import React, { FunctionComponent, useContext, useState } from "react";
import { arrayMove, SortableContainer, SortableElement } from "react-sortable-hoc";
import { IExercise, ISection } from "../../DataInterfaces";
import CompactSectionListItem from "../CompactSectionListItem";
import ExerciseContext from "../AppReducer/ExerciseContext";
import SectionEditor from "../dialogs/SectionEditor";
import { ActionType } from "../AppReducer/ExerciseReducer";
import { emptySection } from "../Utils";

const styles = createStyles({
    listItem: {
        justifyContent: "center",
        textAlign: "center"
    },
    root: {
        overflow: "hidden",
        userSelect: "none",
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
        overflow: "auto",
        transition: "transform 300ms ease-in-out",
        "$root.expanded>&": {
            transform: "translateY(-100%)"
        }
    }
});

interface IProps extends WithStyles {
    exercise: IExercise;
    setEditSection(section: ISection): void;
    updateSectionOrder(sections: ReadonlyArray<ISection>): void;
}

const SectionListTab: FunctionComponent<IProps> = (props: IProps) => {
    const [state, dispatch] = useContext(ExerciseContext);
    const [addingNewSection, setAddingNewSection] = useState(false);

    const { exercise, setEditSection, updateSectionOrder, classes } = props;

    const addNewSection = React.useCallback(() => {
        const newSection: ISection = emptySection;
        dispatch({ type: ActionType.SetEditSection, payload: newSection });
        setAddingNewSection(true);
    }, [dispatch, setAddingNewSection]);

    const sorted = React.useCallback(
        ({ oldIndex, newIndex }: { oldIndex: number; newIndex: number }) => {
            const rearranged: ReadonlyArray<ISection> = arrayMove([...exercise.defaultSections], oldIndex, newIndex);
            updateSectionOrder(rearranged);
        },
        [updateSectionOrder]
    );

    const updateSection = React.useCallback(
        (section: ISection) => {
            // if section is new, add it to the exercise.
            if (addingNewSection) {
                dispatch({ type: ActionType.AddSection, payload: section });
            } else {
                dispatch({ type: ActionType.UpdateSection, payload: section });
            }
            dispatch({ type: ActionType.SetEditSection, payload: null });
            setAddingNewSection(false);
        },
        [dispatch, addingNewSection, setAddingNewSection]
    );

    const deleteSection = React.useCallback(
        (section: ISection) => {
            dispatch({ type: ActionType.DeleteSection, payload: section });
            dispatch({ type: ActionType.SetEditSection, payload: null });
        },
        [dispatch]
    );

    const closeEditor = React.useCallback(() => {
        dispatch({ type: ActionType.SetEditSection, payload: null });
        setAddingNewSection(false);
    }, [dispatch, setAddingNewSection]);

    /** TODO: extract these to own components? */
    const SortableItem = SortableElement(({ value }: { value: JSX.Element }) => (
        <ListItem className={classes.listItem}>{value}</ListItem>
    ));

    const SortableList = SortableContainer(({ items }: { items: JSX.Element[] }) => (
        <List component="nav" className={classes.nav} style={{ paddingTop: 0, paddingBottom: 0 }}>
            {items.map((value: JSX.Element, index: number) => (
                <SortableItem key={`item-${index}`} index={index} value={value} />
            ))}
        </List>
    ));

    const sections = React.useMemo(
        () =>
            exercise.defaultSections.map((sectionItem: ISection, index: number) => {
                // MUI style elments
                return (
                    <CompactSectionListItem
                        key={`item-${index}`}
                        section={sectionItem}
                        index={index}
                        editSection={setEditSection}
                    />
                );
            }),
        [exercise.defaultSections]
    );

    return (
        <div className={`${classes.root} ${state.editSection ? "expanded" : "collapsed"}`}>
            <div className={classes.list}>
                <SortableList
                    items={sections}
                    onSortEnd={sorted}
                    lockAxis={"y"}
                    pressDelay={300}
                    useDragHandle={true}
                />
                <ListItem className={classes.listItem} key="add-section-button">
                    <Fab size="medium" color="primary" aria-label="add" onClick={addNewSection}>
                        <i className="material-icons">add</i>
                    </Fab>
                </ListItem>
            </div>
            <div className={classes.editor}>
                <SectionEditor
                    section={state.editSection}
                    updateSection={updateSection}
                    deleteSection={deleteSection}
                    cancel={closeEditor}
                />
            </div>
        </div>
    );
};

export default withStyles(styles)(SectionListTab);
