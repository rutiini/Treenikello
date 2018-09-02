import  {
  Button,
  createStyles,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  withStyles,
  WithStyles,
} from '@material-ui/core';
import { TimePicker } from 'material-ui-pickers';
import React, { ChangeEvent, Component } from 'react';
import { IExercise, IExerciseContext } from '../DataInterfaces';
import { withExerciseContext } from '../ExerciseContext';

const styles = createStyles({
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

interface IProps extends WithStyles<typeof styles>{
  exerciseContext: IExerciseContext
}

interface IState{
  errorText: string;
  exercise: IExercise,
  open: boolean
}


class EditExerciseDialog extends Component<IProps,IState> {

  // just initialize the controlled state from props and save that object on the save method, no need for this hook.
  public static getDerivedStateFromProps(nextProps: IProps, prevState: IState){
    // opening the dialog
    const { exercises,editExerciseOpen, editExerciseIndex } = nextProps.exerciseContext;
    
    let exercise: IExercise = exercises[editExerciseIndex];
    
    if(!prevState.open && editExerciseOpen){
      if(exercise){
        return {
          exercise: {...exercise},
          open: true
        };
      }else{
        exercise = {
          defaultSections: [],
          name: '',
          preset: false,
          startTime: new Date(),
        }
        return{
          exercise: {...exercise},
          open: true
        };
      }
    // default
    }else{
      return null;
    }

  }
  constructor(props: IProps){
    super(props);
    this.state = {
      errorText: '',
      exercise: {...emptyExercise},
      open: false,
    };
  }

  public render() {
    const { exercises, editExerciseIndex, editExerciseOpen } = this.props.exerciseContext;
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
        fullWidth={true}
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
        fullWidth={true}
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
          <TimePicker
          clearable={true}
          ampm={false}
          label="aseta"
          value={this.state.exercise.startTime}
          onChange={this.updateStart}
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
    const {exercises, editExerciseIndex, toggleExerciseDialog} = this.props.exerciseContext;
    toggleExerciseDialog(exercises[editExerciseIndex]);
    this.setState({
      open: false
    });
  };

  private updateStart = (newStart: Date) => {
    console.log('time set: ', newStart);

    // const time = new Date(event.target.value);

    this.setState({
      exercise: {
        ...this.state.exercise,
        startTime: newStart
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
    const { exercises, editExerciseIndex, validateExerciseName, submitExercise } = this.props.exerciseContext;
    // validate that the name is unique
    // for updates the same name should be allowed
    const nameOK = validateExerciseName(exercise.name);
    if ((nameOK || exercises[editExerciseIndex] ) && exercise.name !== '') {
      submitExercise(exercises[editExerciseIndex], exercise);
      this.handleClose();
      this.setState({
        open: false
      });
    } else {
      console.log(`invalid name`)
      this.setState({ errorText: 'virheellinen nimi' })
    }
  }
}

export default withExerciseContext(withStyles(styles)(EditExerciseDialog));