import React, { Component } from 'react';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';
// import { FormControl } from 'material-ui/Form';
// import { InputLabel } from 'material-ui/Input';
import { withStyles } from 'material-ui/styles';
import TimeInput from 'material-ui-time-picker';

const styles = theme => ({
  EditForm: {
    width: '75%'
  }
})

export default withStyles(styles)(class EditExerciseDialog extends Component {
  state = {
    exercise: {
      name: '',
      preset: false,
      defaultSections: []
    },
    errorText: ''
  };

  handleClose = () => {
    this.props.handleToggle();
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
    // console.log(`${[name]} set ${value}`);

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
    const nameOK = validateName(exercise.name);
    if (nameOK && exercise.name !== '') {
      handleSubmit(this.props.exercise, exercise);
      this.handleClose();
    } else {
      console.log(`invalid name`)
      this.setState({ errorText: 'virheellinen nimi' })
    }
  }
  // set initial state
  componentWillReceiveProps(nextProps) {

    let exerciseInEdit = nextProps.exercise;
    if (!nextProps.exercise) {
      // add new exercise!
      exerciseInEdit = {
        name: '',
        preset: false,
        defaultSections: [],
        startTime: new Date()
      }
    }
    this.setState({
      exercise: exerciseInEdit,
      open: nextProps.open,
      errorText: ''
    })
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
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Nimi"
            type="text"
            value={exercise.name}
            onChange={this.handleChange('name')}
            // errorText={errorText}
            fullWidth
          />
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