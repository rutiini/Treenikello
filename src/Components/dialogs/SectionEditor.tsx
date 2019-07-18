import React, { useState, ChangeEvent } from 'react';
import { ISection } from 'src/DataInterfaces';
import { TextField, createStyles, WithStyles, withStyles, Button } from '@material-ui/core';

interface ISectionEditorProps extends WithStyles<typeof styles> {
    readonly section: ISection;
    updateSection(section: ISection): void;
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
        width: 80,
    }
});

const SectionEditor: React.FC<ISectionEditorProps> = (props) => {
    const [section, setSection] = useState(props.section);

    /** updates a property with string value that matches the name of the sender element */
    const updateStringProp = (event: ChangeEvent<HTMLSelectElement>) => {
        setSection({
            ...section,
            [event.target.name]: event.target.value
        })
    }

    /** updates a property with numeric value that matches the name of the sender element */
    const updateNumberProp = (event: ChangeEvent<HTMLSelectElement>) => {
        setSection({
            ...section,
            [event.target.name]: parseInt(event.target.value, 10)
        })
    }

    const apply = () => {
        props.updateSection(section);
    }

    const cancel = () => {
        props.updateSection(props.section);
    }

    return <div className={props.classes.inputContainer}>
        <TextField
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
        </div>
        <div className={props.classes.inputGroup}>
            <Button size="large" color="primary" onClick={apply}>OK</Button>
            <Button size="large" onClick={cancel}>Peruuta</Button>
        </div>
    </div>
}

export default withStyles(styles)(SectionEditor);