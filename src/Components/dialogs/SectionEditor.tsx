import React, { useState, ChangeEvent } from 'react';
import { ISection } from 'src/DataInterfaces';
import { TextField } from '@material-ui/core';

interface ISectionEditorProps {
    readonly section: ISection;
    updateSection(section: ISection): void;
}

export const SectionEditor: React.FC<ISectionEditorProps> = (props) => {
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

    return <>
        <TextField
            value={section.name}
            label="Nimi"
            name="name"
            type="text"
            onChange={updateStringProp}
        />
        <TextField
            value={section.description}
            label="Sisältö"
            name="description"
            type="text"
            multiline={true}
            rows={4}
            onChange={updateStringProp}
        />
        <TextField
            value={section.setupTime}
            label="Tauko/alustus"
            name="setupTime"
            type="number"
            onChange={updateNumberProp}
        />
        <TextField
            value={section.duration}
            label="Kesto"
            name="duration"
            type="number"
            onChange={updateNumberProp}
        />
        {JSON.stringify(props.section, null, 2)}
    </>
}