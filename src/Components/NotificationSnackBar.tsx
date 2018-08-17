import {createStyles, IconButton, Snackbar, withStyles } from '@material-ui/core';
import React, { PureComponent } from 'react';

const styles = createStyles({
  close: {
    // height: theme.spacing.unit * 4,
    // width: theme.spacing.unit * 4,
  },
});

interface IProps{
  classes: {
    close: string
  },
  handleHide: (event: any, reason?: string) => void,
  open: boolean
}

class NotificationSnackBar extends PureComponent<IProps,{}> {

  public render() {
    const { classes,handleHide,open } = this.props;
    return (
        <Snackbar
          anchorOrigin={{
            horizontal: 'left',
            vertical: 'top',
          }}
          open={open}
          autoHideDuration={4000}
          onClose={handleHide}
          message={<span id="message-id">Saved exercises</span>}
          action={[
            <IconButton
              key="close"
              aria-label="Close"
              color="inherit"
              className={classes.close}
              onClick={handleHide}
            >
              <i className="material-icons">close</i>
            </IconButton>,
          ]}
        />
    );
  }
}

export default withStyles(styles)(NotificationSnackBar);