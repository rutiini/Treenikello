import React, { useState, ChangeEvent } from "react";
import { IExercise } from "../../DataInterfaces";
import { TextField, createStyles, WithStyles, withStyles, Button } from "@material-ui/core";
import { GetTimeAsHHmmString } from "../../Utils/ClockUtilities";
import { emptyExercise } from "../../Utils";

interface IExerciseEditorProps extends WithStyles<typeof styles> {
    readonly exercise: IExercise | null;
    readonly usedNames: ReadonlyArray<string>;
    updateExercise(exercise: IExercise): void;
    deleteExercise(exercise: IExercise): void;
    cancel(): void;
}

const styles = createStyles({
    input: {
        "display": "inline-block",
        "width": "80%",
        "marginTop": 10,
        "marginBottom": 10,
        "& div": {
            width: "100%",
        },
    },
    inputContainer: {
        padding: 20,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
    inputGroup: {
        margin: 10,
    },
    numericInput: {
        marginLeft: 10,
        marginRight: 10,
        width: 80,
    },
});

const ExerciseEditor: React.FC<IExerciseEditorProps> = (props) => {
    const {exercise, updateExercise, deleteExercise} = props;
    const addingNew = exercise === emptyExercise;
    const initialExercise = props.exercise ? props.exercise : emptyExercise;
    const [currentExercise, setExercise] = useState(initialExercise);

    React.useEffect(() => {
        setExercise(initialExercise);
    }, [props.exercise, initialExercise]);

    const setStartTime = React.useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            const newStart = event.target.value.split(":");
            const newStartTime = new Date();
            newStartTime.setHours(parseInt(newStart[0], 10), parseInt(newStart[1], 10));
            setExercise({
                ...currentExercise,
                startTime: newStartTime,
            });
        },
        [setExercise, currentExercise],
    );

    const updateName = React.useCallback(
        (event: ChangeEvent<HTMLInputElement>): void => {
            const name = event.target.value;
            setExercise({
                ...currentExercise,
                name,
            });
        },
        [setExercise, currentExercise],
    );

    const handleUpdate = React.useCallback(() => {
        updateExercise(currentExercise);
    }, [updateExercise, currentExercise]);

    const handleDelete = React.useCallback(() => {
        deleteExercise(currentExercise);
    }, [deleteExercise, currentExercise]);

    return (
        <div className={props.classes.inputContainer}>
            <TextField
                autoFocus={!!props.exercise} // does not appear to work
                name="name"
                label="Nimi"
                type="text"
                value={currentExercise.name}
                onChange={updateName}
                error={!!validateName}
                className={props.classes.input}
            />
            <TextField
                name="time"
                label="start"
                type="time"
                defaultValue={GetTimeAsHHmmString(currentExercise.startTime)}
                onChange={setStartTime}
                InputLabelProps={{
                    shrink: true,
                }}
                inputProps={{
                    step: 300, // 5 min
                }}
            />
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

function validateName(name: string, usedNames: ReadonlyArray<string>): string | null {
    const index = usedNames.findIndex((n) => n === name);
    return index !== -1 ? null : `nimi käytetty: ${usedNames[index]}`;
}

export default withStyles(styles)(ExerciseEditor);
