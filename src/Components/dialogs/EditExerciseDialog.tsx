import {
  Button,
  createStyles,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  withStyles
} from '@material-ui/core';
import React, { ChangeEvent, FunctionComponent, useContext, useState } from 'react';
import { IExercise } from '../../DataInterfaces';
import ExerciseContext from '../AppReducer/ExerciseContext';
import { ActionType } from '../AppReducer/ExerciseReducer';
import { GetTimeAsHHmmString } from '../Utils/ClockUtilities';

const styles = () => createStyles({
  EditForm: {
    width: '75%'
  }
})

const emptyExercise = {
  defaultSections: [],
  name: '',
  preset: false,
  startTime: new Date(),
}

interface IProps {
  exercise: IExercise,
  open: boolean,
  submit: (exercise: IExercise) => void,
  validateExerciseName: (name: string) => boolean
}

const EditExerciseDialog: FunctionComponent<IProps> = (props: IProps) => {

  const [state, dispatch] = useContext(ExerciseContext);

  const [errorText, setErrorText] = useState();
  const [exercise, setExercise] = useState(state.editExercise ? state.editExercise : emptyExercise);

  const handleClose = () => {
    // props.submit(exercise);
    // replace with dispatch add / update
    dispatch({type: ActionType.UpdateExercise, payload: exercise});
    dispatch({type: ActionType.SetEditExercise, payload: null});
  };

  const setStartTime = (event: ChangeEvent<HTMLInputElement>) => {
    const newStart = event.target.value.split(':');
    const newStartTime = new Date();
    newStartTime.setHours(parseInt(newStart[0], 10), parseInt(newStart[1], 10));
    setExercise({
      ...exercise,
      startTime: newStartTime
    })

  }

  const updateExercise = (event: ChangeEvent<HTMLInputElement>) => {
    setExercise({
      ...exercise,
      [event.target.name]: event.target.value
    })
  }

  const handleSubmit = () => {
    const nameOK = state.exercises.map(e => e.name).indexOf(exercise.name) === -1;
    if ((nameOK || exercise) && exercise.name !== '') {
      handleClose();
    } else {
      setErrorText('virheellinen nimi');
    }
  }

  let submitBtnText = 'Lisää'
  let titleText = 'Uusi harjoitus'
  let descriptionText = 'Lisää harjoituksen tiedot'

  if (state.editExercise) {
    submitBtnText = 'Päivitä';
    titleText = 'Muokkaa harjoitusta';
    descriptionText = 'Päivitä harjoituksen tiedot';
  }
  let nameInput
  if (errorText) {
    nameInput =
      <TextField
        autoFocus={true}
        margin="dense"
        id="name"
        label="Nimi"
        type="text"
        value={exercise.name}
        onChange={updateExercise}
        helperText={errorText}
        variant="filled"
        error={true}
      />
  } else {
    nameInput =
      <TextField
        autoFocus={true}
        margin="dense"
        id="name"
        label="Nimi"
        type="text"
        value={exercise.name}
        onChange={updateExercise}
        variant="filled"
      />
  }
  return (
    <Dialog
      open={props.open}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">{titleText}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {descriptionText}
        </DialogContentText>
        {nameInput}
        <i className="material-icons">access_time</i>
        <TextField
          id="time"
          label="start"
          type="time"
          defaultValue={GetTimeAsHHmmString(state.editExercise ? state.editExercise.startTime : new Date())}
          onChange={setStartTime}
          InputLabelProps={{
            shrink: true,
          }}
          inputProps={{
            step: 300, // 5 min
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Peruuta
      </Button>
        <Button onClick={handleSubmit} color="primary">
          {submitBtnText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default withStyles(styles, { withTheme: true })(EditExerciseDialog)