import React, { Component } from 'react';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';
import { withStyles } from 'material-ui/styles';
import TimeInput from 'material-ui-time-picker';

const styles = theme => ({
  EditForm: {
    width: '75%'
  }
})
const emptyExercise = {
  name: '',
  startTime: new Date(),
  preset: false,
  defaultSections: []
}

export default withStyles(styles)(class EditExerciseDialog extends Component {
  state = {
    open: false,
    exercise: {...emptyExercise},
    errorText: ''
  };

  handleClose = () => {
    this.props.handleToggle();
    this.setState({
      open: false
    });
  };

  handleTimeChange = (time) => {
    const { exercise } = this.state;
    exercise.startTime = time;
    this.setState({
      exercise: exercise
    })
  }
  // magical generic prop handling:
  handleChange = name => ({ target: { value } }) => {
    this.setState({
      exercise: {
        ...this.state.exercise,
        [name]: value
      }
    })

  }
  handleSubmit = () => {
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

  static getDerivedStateFromProps(nextProps, prevState){
    // opening the dialog
    if(!prevState.open && nextProps.open){
      if(nextProps.exercise){
        return {
          open: true,
          exercise: {...nextProps.exercise}
        };
      }else{
        return{
          open: true,
          exercise: {...emptyExercise}
        };
      }
    // default
    }else{
      return null;
    }

  }

  render() {
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
        autoFocus
        margin="dense"
        id="name"
        label="Nimi"
        type="text"
        value={exercise.name}
        onChange={this.handleChange('name')}
        helperText={errorText}
        fullWidth
        error
      />
      }else{
        nameInput =
        <TextField
        autoFocus
        margin="dense"
        id="name"
        label="Nimi"
        type="text"
        value={exercise.name}
        onChange={this.handleChange('name')}
        fullWidth
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
          <TimeInput color="inherit" id="TimeInput" mode="24h" value={exercise.startTime} onChange={this.handleTimeChange} />
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
})