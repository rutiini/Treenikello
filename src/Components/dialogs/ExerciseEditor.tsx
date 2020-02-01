import React, { useState, ChangeEvent } from 'react';
import { IExercise } from 'src/DataInterfaces';
import { TextField, createStyles, WithStyles, withStyles, Button } from '@material-ui/core';
import { GetTimeAsHHmmString } from '../Utils/ClockUtilities';

interface IExerciseEditorProps extends WithStyles<typeof styles> {
    readonly exercise: IExercise | null;
    updateExercise(exercise: IExercise): void;
    deleteExercise(exercise: IExercise): void;
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
        width: 80,
    }
});

const emptyExercise = {
    defaultSections: [],
    name: '',
    preset: false,
    startTime: new Date(),
  }

const SectionEditor: React.FC<IExerciseEditorProps> = (props) => {
    const initialExercise = props.exercise ? props.exercise : emptyExercise;
    const [exercise, setExercise] = useState(initialExercise);

    React.useEffect(() => {
        setExercise(initialExercise);
    },
    [props.exercise]);

    function setStartTime(event: ChangeEvent<HTMLInputElement>) {
        const newStart = event.target.value.split(':');
        const newStartTime = new Date();
        newStartTime.setHours(parseInt(newStart[0], 10), parseInt(newStart[1], 10));
        setExercise({
          ...exercise,
          startTime: newStartTime
        });
      }

    function updateName(event: ChangeEvent<HTMLInputElement>): void {
        const name = event.target.value;
        setExercise({
            ...exercise,
            name
        });
    }
    const apply = () => {
        props.updateExercise(exercise);
    }

    const deleteExercise = () => {
        props.deleteExercise(exercise);
    }

    return <div className={props.classes.inputContainer}>
        <TextField
        autoFocus={true}
        margin="dense"
        name="name"
        label="Nimi"
        type="text"
        value={exercise.name}
        onChange={updateName}
        helperText={validateName}
        variant="filled"
        error={!!validateName}
      />
      <TextField
          name="time"
          label="start"
          type="time"
          defaultValue={GetTimeAsHHmmString(exercise.startTime)}
          onChange={setStartTime}
          InputLabelProps={{
            shrink: true,
          }}
          inputProps={{
            step: 300, // 5 min
          }}
        />
        <div className={props.classes.inputGroup}>
            <Button size="large" color="primary" onClick={apply}>Tallenna</Button>
            <Button size="large" onClick={props.cancel}>Peruuta</Button>
            <Button size="large" onClick={deleteExercise}>Poista</Button>
        </div>
    </div>
}

function validateName(name: string): string | null {
    return null;
}

export default withStyles(styles)(SectionEditor);