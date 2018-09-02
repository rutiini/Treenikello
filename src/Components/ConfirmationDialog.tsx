import { Button } from '@material-ui/core';
import  { Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@material-ui/core';
import React, { PureComponent } from 'react';
import { IExerciseContext } from '../DataInterfaces';
import { withExerciseContext } from '../ExerciseContext';

interface IProps{
  exerciseContext: IExerciseContext
}

class ConfirmationDialog extends PureComponent<IProps, {}> {

  public render() {
    const { confirmationDialogOpen, exercises, deleteExerciseIndex } = this.props.exerciseContext
    return (
        <Dialog
          open={confirmationDialogOpen}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Vahvista</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {`Haluatko varmasti poistaa valitun harjoituksen ${deleteExerciseIndex !== -1 ? exercises[deleteExerciseIndex].name : ''}?`}
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
  
  // private ctxt = () => this.props.exerciseContext as IExerciseContext;

  private accept = () => {
    this.props.exerciseContext.acceptDeleteExercise();
    this.props.exerciseContext.deleteExercise(-1);
  }
  private cancel = () => {
    // this.props.handleToggle(-1);
    this.props.exerciseContext.deleteExercise(-1);
  }
}

export default withExerciseContext(ConfirmationDialog);