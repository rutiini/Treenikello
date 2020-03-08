import React, { useState, ChangeEvent } from "react";
import { IExercise } from "src/DataInterfaces";
import { TextField, createStyles, WithStyles, withStyles, Button } from "@material-ui/core";
import { GetTimeAsHHmmString } from "../Utils/ClockUtilities";
import { emptyExercise } from "../Utils";

interface IExerciseEditorProps extends WithStyles<typeof styles> {
    readonly exercise: IExercise | null;
    readonly usedNames: ReadonlyArray<string>;
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
        width: 80
    }
});

const ExerciseEditor: React.FC<IExerciseEditorProps> = props => {
    const addingNew = props.exercise === emptyExercise;
    const initialExercise = props.exercise ? props.exercise : emptyExercise;
    const [exercise, setExercise] = useState(initialExercise);

    React.useEffect(() => {
        setExercise(initialExercise);
    }, [props.exercise]);

    const setStartTime = React.useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            const newStart = event.target.value.split(":");
            const newStartTime = new Date();
            newStartTime.setHours(parseInt(newStart[0], 10), parseInt(newStart[1], 10));
            setExercise({
                ...exercise,
                startTime: newStartTime
            });
        },
        [setExercise, exercise]
    );

    const updateName = React.useCallback(
        (event: ChangeEvent<HTMLInputElement>): void => {
            const name = event.target.value;
            setExercise({
                ...exercise,
                name
            });
        },
        [setExercise, exercise]
    );

    const apply = React.useCallback(() => {
        props.updateExercise(exercise);
    }, [props.updateExercise, exercise]);

    const deleteExercise = React.useCallback(() => {
        props.deleteExercise(exercise);
    }, [props.deleteExercise, exercise]);

    return (
        <div className={props.classes.inputContainer}>
            <TextField
                autoFocus={!!props.exercise} // does not appear to work
                name="name"
                label="Nimi"
                type="text"
                value={exercise.name}
                onChange={updateName}
                error={!!validateName}
                className={props.classes.input}
            />
            <TextField
                name="time"
                label="start"
                type="time"
                defaultValue={GetTimeAsHHmmString(exercise.startTime)}
                onChange={setStartTime}
                InputLabelProps={{
                    shrink: true
                }}
                inputProps={{
                    step: 300 // 5 min
                }}
            />
            <div className={props.classes.inputGroup}>
                <Button size="large" color="primary" onClick={apply}>
                    {addingNew ? "Lisää" : "Päivitä"}
                </Button>
                <Button size="large" onClick={props.cancel}>
                    Peruuta
                </Button>
                {!addingNew && (
                    <Button size="large" onClick={deleteExercise}>
                        Poista
                    </Button>
                )}
            </div>
        </div>
    );
};

function validateName(name: string, usedNames: ReadonlyArray<string>): string | null {
    const index = usedNames.findIndex(n => n === name);
    return index !== -1 ? null : `nimi käytetty: ${usedNames[index]}`;
}

export default withStyles(styles)(ExerciseEditor);
