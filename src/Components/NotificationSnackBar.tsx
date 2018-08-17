import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Snackbar from 'material-ui/Snackbar';
import IconButton from 'material-ui/IconButton';
// import CloseIcon from 'material-ui-icons/Close';

const styles = theme => ({
  close: {
    width: theme.spacing.unit * 4,
    height: theme.spacing.unit * 4,
  },
});

class NotificationSnackBar extends Component {

  render() {
    const { classes,handleHide,open } = this.props;
    return (
        <Snackbar
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          open={open}
          autoHideDuration={4000}
          onClose={handleHide}
          snackbarcontentprops={{
            'aria-describedby': 'message-id',
          }}
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

NotificationSnackBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(NotificationSnackBar);