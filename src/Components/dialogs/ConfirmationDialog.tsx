import { Button } from '@material-ui/core';
import  { Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@material-ui/core';
import React, { PureComponent } from 'react'
import { IExercise } from '../../DataInterfaces';

interface IProps{
  open: boolean,
  exercise: IExercise,
  deleteExercise: (exercise: IExercise) => void,
  setConfirmOpen: (open: boolean) => void
}

class ConfirmationDialog extends PureComponent<IProps, {}> {
  
  public render() {
    const {exercise} = this.props;
    return (
      <Dialog
      open={this.props.open}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      >
      <DialogTitle id="alert-dialog-title">Vahvista</DialogTitle>
      <DialogContent>
      <DialogContentText id="alert-dialog-description">
      {`Haluatko varmasti poistaa valitun harjoituksen ${exercise ? exercise.name : ''}?`}
      </DialogContentText>
      </DialogContent>
      <DialogActions>
      <Button onClick={this.cancel} color="primary">
      Peruuta
      </Button>
      <Button onClick={this.accept} color="primary" autoFocus={true}>
      Poista
      </Button>
      </DialogActions>
      </Dialog>
      );
    }
    
    private accept = () => {
      this.props.deleteExercise(this.props.exercise); // this could be done internally?
    }
    private cancel = () => {
      this.props.setConfirmOpen(false);
    }
  }
  
  export default ConfirmationDialog;