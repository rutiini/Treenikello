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
    const addingNew = props.section === emptySection;
    const initialSection = props.section ? props.section : emptySection;
    const [section, setSection] = useState(initialSection);

    React.useEffect(() => {
        setSection(initialSection);
    }, [props.section]);

    /** updates a property with string value that matches the name of the sender element */
    const updateStringProp = React.useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            setSection({
                ...section,
                [event.target.name]: event.target.value
            });
        },
        [setSection, section]
    );

    /** updates a property with numeric value that matches the name of the sender element */
    const updateNumberProp = React.useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            setSection({
                ...section,
                [event.target.name]: parseInt(event.target.value, 10)
            });
        },
        [setSection, section]
    );

    const apply = React.useCallback(() => {
        props.updateSection(section);
    }, [props.updateSection, section]);

    const deleteSection = React.useCallback(() => {
        props.deleteSection(section);
    }, [props.deleteSection, section]);

    return (
        <div className={props.classes.inputContainer}>
            <TextField
                autoFocus={!!props.section}
                value={section.name}
                label="Nimi"
                name="name"
                type="text"
                onChange={updateStringProp}
                className={props.classes.input}
            />
            <TextField
                value={section.description}
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
                    value={section.setupTime}
                    label="Tauko/alustus"
                    name="setupTime"
                    type="number"
                    onChange={updateNumberProp}
                    className={props.classes.numericInput}
                />
                <TextField
                    value={section.duration}
                    label="Kesto"
                    name="duration"
                    type="number"
                    onChange={updateNumberProp}
                    className={props.classes.numericInput}
                />
                {/* add a label for this control */}
                <Select
                    style={{ backgroundColor: section.color }}
                    value={section.color}
                    onChange={updateStringProp}
                    name="color"
                >
                    {colorOptions.map((o, index) => {
                        return <MenuItem key={index} value={o.colorValue} style={{ backgroundColor: o.colorValue }} />;
                    })}
                </Select>
            </div>
            <div className={props.classes.inputGroup}>
                <Button size="large" color="primary" onClick={apply}>
                    {addingNew ? "Lisää" : "Päivitä"}
                </Button>
                <Button size="large" onClick={props.cancel}>
                    Peruuta
                </Button>
                {!addingNew && (
                    <Button size="large" onClick={deleteSection}>
                        Poista
                    </Button>
                )}
            </div>
        </div>
    );
};

export default withStyles(styles)(SectionEditor);
