import  {
  Button,
  createStyles,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Theme,
  withStyles
} from '@material-ui/core';
import React, { ChangeEvent, Component, Context } from 'react';
import { IExercise, IExerciseContext } from '../../DataInterfaces';
import { ExerciseContext } from '../../ExerciseContext';
import { GetTimeAsHHmmString } from '../Utils/ClockUtilities';

const styles = (theme: Theme) => createStyles({
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

interface IProps{
  exercise: IExercise,
  open: boolean,
  submit: (exercise: IExercise) => void,
  validateExerciseName: (name: string) => boolean
}

interface IState{
  errorText: string,
  exercise: IExercise,
}


class EditExerciseDialog extends Component<IProps,IState> {

  // just initialize the controlled state from props and save that object on the save method, no need for this hook.
  public static contextType: Context<IExerciseContext> = ExerciseContext;
  
  public static getDerivedStateFromProps(nextProps: IProps, prevState: IState){
    // opening the dialog
    const { exercise } = nextProps;

    if(exercise){
      return {
         exercise
      }
    }else{
      return {
        exercise: {...emptyExercise}
      }
    }

  }
  constructor(props: IProps){
    super(props);
    this.state = {
      errorText: '',
      exercise: {...emptyExercise}
    };
  }

  public render() {
    const { exercises, editExerciseIndex, editExerciseOpen } = this.context;
    const originalExercise = exercises[editExerciseIndex];
    const { errorText } = this.state;

    let submitBtnText = 'Lisää'
    let titleText = 'Uusi harjoitus'
    let descriptionText = 'Lisää harjoituksen tiedot'
    
    if (exercises[editExerciseIndex]) {
      submitBtnText = 'Päivitä';
      titleText = 'Muokkaa harjoitusta';
      descriptionText = 'Päivitä harjoituksen tiedot';
    }
    let nameInput
    if(errorText){
      nameInput =
      <TextField
        autoFocus={true}
        margin="dense"
        id="name"
        label="Nimi"
        type="text"
        value={this.state.exercise.name}
        onChange={this.updateName}
        helperText={errorText}
        variant="filled"
        error={true}
      />
      }else{
        nameInput =
        <TextField
        autoFocus={true}
        margin="dense"
        id="name"
        label="Nimi"
        type="text"
        value={this.state.exercise.name}
        onChange={this.updateName}
        variant="filled"
      />
      }

    return (
      <Dialog
        open={editExerciseOpen}
        onClose={this.handleClose}
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
        defaultValue={GetTimeAsHHmmString(originalExercise ? originalExercise.startTime : new Date())}
        onChange={this.setStartTime}
        InputLabelProps={{
          shrink: true,
        }}
        inputProps={{
          step: 300, // 5 min
        }}
      />
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleClose} color="primary">
            Peruuta
      </Button>
          <Button onClick={this.handleSubmit} color="primary">
            {submitBtnText}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  private handleClose = () => {
    this.props.submit(this.state.exercise);
  };
  
  private setStartTime = (event: ChangeEvent<HTMLInputElement>) => {
    const newStart = event.target.value.split(':');
    const newStartTime = new Date();
    newStartTime.setHours(parseInt(newStart[0],10),parseInt(newStart[1],10));
    this.setState({
      exercise:{
        ...this.state.exercise,
        startTime: newStartTime
      }
    })

  }

  private updateName = (event: ChangeEvent<HTMLInputElement>) => {
    
    this.setState({
      exercise: {
        ...this.state.exercise,
        name: event.target.value
      }
    })
  }

  private handleSubmit = () => {
    
    const { exercise } = this.state;
    // validate that the name is unique
    // for updates the same name should be allowed
    const nameOK = this.context.validateExerciseName(exercise.name);
    if ((nameOK || exercise ) && exercise.name !== '') {
      this.handleClose();
    } else {
      console.log(`invalid name`)
      this.setState({ errorText: 'virheellinen nimi' })
    }
  }
}

export default withStyles(styles, { withTheme: true })(EditExerciseDialog)