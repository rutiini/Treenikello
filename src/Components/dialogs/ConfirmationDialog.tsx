import { Button } from '@material-ui/core';
import  { Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@material-ui/core';
import React, { Context, PureComponent } from 'react';
import { IExerciseContext } from '../../DataInterfaces';
import { ExerciseContext } from '../../ExerciseContext';

class ConfirmationDialog extends PureComponent<{}, {}> {
  
  public static contextType: Context<IExerciseContext> = ExerciseContext;

  public render() {
    const { confirmationDialogOpen, exercises, deleteExerciseIndex } = this.context;
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
    
    private accept = () => {
      this.context.acceptDeleteExercise();
      this.context.deleteExercise(-1);
    }
    private cancel = () => {
      this.context.handleToggle(-1);
      this.context.deleteExercise(-1);
    }
  }
  
  export default ConfirmationDialog;