import { Button } from '@material-ui/core';
import  { Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@material-ui/core';
import React, { PureComponent } from 'react';
import { IExercise } from '../DataInterfaces';

interface IProps{
  exercise: IExercise,
  handleToggle: (deleteIndex: number) => void,
  handleAccept: () => void,
  open: boolean
}

class ConfirmationDialog extends PureComponent<IProps, {}> {

  public render() {
    const { open } = this.props;
    return (
        <Dialog
          open={open}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Vahvista</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Haluatko varmasti poistaa valitun harjoituksen?
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
    this.props.handleAccept();
    this.props.handleToggle(-1);
  }
  private cancel = () => {
    this.props.handleToggle(-1);
  }
}

export default ConfirmationDialog;