import React, { useState, ChangeEvent } from "react";
import { ISection } from "../../DataInterfaces";
import { TextField, createStyles, WithStyles, withStyles, Button, Select, MenuItem } from "@material-ui/core";
import { colorOptions } from "../../Store";
import { emptySection } from "../Utils";

interface ISectionEditorProps extends WithStyles<typeof styles> {
    readonly section: ISection | null;
    updateSection(section: ISection): void;
    deleteSection(section: ISection): void;
    cancel(): void;
}

const styles = createStyles({
    input: {
        display: "inline-block",
        width: "80%",
        marginTop: 10,
        marginBottom: 10,
        "& div": {
            width: "100%"
        }
    },
    inputContainer: {
        padding: 20,
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
    },
    inputGroup: {
        margin: 10
    },
    numericInput: {
        marginLeft: 10,
        marginRight: 10,
        width: 80
    }
});

const SectionEditor: React.FC<ISectionEditorProps> = props => {
    const {section, updateSection, deleteSection} = props;
    const addingNew = section === emptySection;
    const initialSection = section ?? emptySection;
    const [currentSection, setSection] = useState(initialSection);

    React.useEffect(() => {
        setSection(initialSection);
    }, [props.section, initialSection]);

    /** updates a property with string value that matches the name of the sender element */
    const updateStringProp = React.useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            setSection({
                ...currentSection,
                [event.target.name]: event.target.value
            });
        },
        [setSection, currentSection]
    );

    /** updates a property with numeric value that matches the name of the sender element */
    const updateNumberProp = React.useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            setSection({
                ...currentSection,
                [event.target.name]: parseInt(event.target.value, 10)
            });
        },
        [setSection, currentSection]
    );

    const updateColor = React.useCallback(
        (event: ChangeEvent<{value: unknown}>) => {
            setSection({
                ...currentSection,
                color: event.target.value as string
            });
        },
        [setSection, currentSection]
    );

    const handleUpdate = React.useCallback(() => {
        updateSection(currentSection);
    }, [updateSection, currentSection]);

    const handleDelete = React.useCallback(() => {
        deleteSection(currentSection);
    }, [deleteSection, currentSection]);

    return (
        <div className={props.classes.inputContainer}>
            <TextField
                autoFocus={!!props.section}
                value={currentSection.name}
                label="Nimi"
                name="name"
                type="text"
                onChange={updateStringProp}
                className={props.classes.input}
            />
            <TextField
                value={currentSection.description}
                label="Sisältö"
                name="description"
                type="text"
                multiline={true}
                rows={4}
                onChange={updateStringProp}
                className={props.classes.input}
            />
            <div className={props.classes.inputGroup}>
                <TextField
                    value={currentSection.setupTime}
                    label="Tauko/alustus"
                    name="setupTime"
                    type="number"
                    onChange={updateNumberProp}
                    className={props.classes.numericInput}
                />
                <TextField
                    value={currentSection.duration}
                    label="Kesto"
                    name="duration"
                    type="number"
                    onChange={updateNumberProp}
                    className={props.classes.numericInput}
                />
                {/* add a label for this control */}
                <Select
                    style={{ backgroundColor: currentSection.color }}
                    value={currentSection.color}
                    onChange={updateColor}
                    name="color"
                >
                    {colorOptions.map((o, index) => {
                        return <MenuItem key={index} value={o.colorValue} style={{ backgroundColor: o.colorValue }} />;
                    })}
                </Select>
            </div>
            <div className={props.classes.inputGroup}>
                <Button size="large" color="primary" onClick={handleUpdate}>
                    {addingNew ? "Lisää" : "Päivitä"}
                </Button>
                <Button size="large" onClick={props.cancel}>
                    Peruuta
                </Button>
                {!addingNew && (
                    <Button size="large" onClick={handleDelete}>
                        Poista
                    </Button>
                )}
            </div>
        </div>
    );
};

export default withStyles(styles)(SectionEditor);
