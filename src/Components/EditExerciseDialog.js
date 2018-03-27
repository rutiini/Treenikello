import React, {Component} from 'react';
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
import { withStyles} from 'material-ui/styles';

const styles = theme => ({
  EditForm: {
    width: '75%'
  }
})

export default withStyles(styles) (class EditExerciseDialog extends Component {
  state = {
    exercise: {
      name: '',
      preset: false,
      defaultSections: []
    }
  };

  handleClose = () => {
    this.props.handleToggle();
  };

  // magical generic prop handling:
  handleChange = name => ({target: { value }}) => {
    console.log(`${[name]} set ${value}`);
    
    this.setState({
      exercise:{
        ...this.state.exercise,
        [name]: value
      }
    })
    
  }
  // set initial state
  componentWillReceiveProps(nextProps){
    this.setState({
      exercise: nextProps.exercise,
      open: nextProps.open
    })
  }

  render() {
    const { open } = this.props;
    
    return (
      <Dialog
      open={open}
      onClose={this.handleClose}
      aria-labelledby="form-dialog-title"
      >
      <DialogTitle id="form-dialog-title">title</DialogTitle>
      <DialogContent>
      <DialogContentText>
      description
      </DialogContentText>
      <TextField
      autoFocus
      margin="dense"
      id="name"
      label="Nimi"
      type="text"
      value={this.state.exercise.name}
      onChange={this.handleChange('name')}
      fullWidth
      />
      </DialogContent>
      <DialogActions>
      <Button onClick={this.handleClose} color="primary">
      Peruuta
      </Button>
      <Button onClick={this.handleClose} color="primary">
      Lisää
      </Button>
      </DialogActions>
      </Dialog>
    );
  }
})