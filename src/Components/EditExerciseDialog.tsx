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
} from '@material-ui/core';
import React, { ChangeEvent, Component } from 'react';
import { IExercise } from '../DataInterfaces';

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

interface IProps{
  open: boolean,
  exercise: IExercise,
  handleToggle: (exercise: IExercise) => void,
  handleSubmit: (oldExercise: IExercise, newExercise: IExercise) => void,
  validateName: (name: string) => boolean,
  // injected classes need to be declared in props!
  classes: {
    EditForm: string
  }
}

interface IState{
  errorText: string;
  exercise: IExercise,
  open: boolean
}


class EditExerciseDialog extends Component<IProps,IState> {

  public static getDerivedStateFromProps(nextProps: IProps, prevState: IState){
    // opening the dialog
    if(!prevState.open && nextProps.open){
      if(nextProps.exercise){
        return {
          exercise: {...nextProps.exercise},
          open: true
        };
      }else{
        return{
          exercise: {...emptyExercise},
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
    const { open } = this.props;
    const { exercise, errorText } = this.state;

    let submitBtnText = 'Lisää'
    let titleText = 'Uusi harjoitus'
    let descriptionText = 'Lisää harjoituksen tiedot'
    // edit mode if
    if (this.props.exercise) {
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
        value={exercise.name}
        // onChange={this.handleChange('name')}
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
        value={exercise.name}
        // onChange={this.handleChange('name')}
        fullWidth={true}
      />
      }

    return (
      <Dialog
        open={open}
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
          {/* <TimeInput color="inherit" id="TimeInput" mode="24h" value={exercise.startTime} onChange={this.handleTimeChange} /> */}
          <TextField id="time"
        label="Alarm clock"
        type="time"
        defaultValue="07:30"
        // className={classes.textField}
        InputLabelProps={{
          shrink: true,
        }}
        inputProps={{
          step: 300, // 5 min
        }}
      />
          {/* value={exercises[selectedExerciseIndex].startTime} onChange={setTime} className={classes.flex}  */}
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
    this.props.handleToggle(this.props.exercise);
    this.setState({
      open: false
    });
  };

  // private handleTimeChange = (time: Date) => {
  //   const { exercise } = this.state;
  //   exercise.startTime = time;
  //   this.setState({
  //     exercise
  //   })
  // }
  
  private updateName(event: ChangeEvent){
    // event.preventDefault()
    
    this.setState({
      exercise: {
        ...this.state.exercise,
        name
      }
    })
  }

  private handleSubmit = () => {
    const { handleSubmit, validateName } = this.props;
    const { exercise } = this.state;
    // validate that the name is unique
    // for updates the same name should be allowed
    const nameOK = validateName(exercise.name);
    if ((nameOK || this.props.exercise ) && exercise.name !== '') {
      handleSubmit(this.props.exercise, exercise);
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

export default withStyles(styles)(EditExerciseDialog);