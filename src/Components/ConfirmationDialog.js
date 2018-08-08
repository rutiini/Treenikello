import React, { Component } from 'react';
import Button from 'material-ui/Button';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';

class ConfirmationDialog extends Component {

  accept = () => {
    this.props.handleAccept();
    this.props.handleToggle(true);
  }
  cancel = () => {
    this.props.handleToggle(false);
  }

  render() {
    const { open, handleToggle } = this.props;
    return (
        <Dialog
          open={open}
          onClose={handleToggle}
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
            <Button onClick={this.accept} color="primary" autoFocus>
              Poista
            </Button>
          </DialogActions>
        </Dialog>
    );
  }
}

export default ConfirmationDialog;