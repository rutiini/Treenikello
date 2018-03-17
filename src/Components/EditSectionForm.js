import React, {Component} from 'react';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';
import { MenuItem } from 'material-ui/Menu';
import { FormControl } from 'material-ui/Form';
import Select from 'material-ui/Select';
import { InputLabel } from 'material-ui/Input';
// store
import { colorOptions } from '../Store';

export default class EditSectionDialog extends Component {
  state = {
    open: false,
  };
  
  handleClickOpen = () => {
    this.setState({ open: true });
  };
  
  handleClose = () => {
    this.setState({ open: false });
  };
  
  componentWillMount(){
    this.colorOptions = colorOptions.map(optionItem => {
      let colorCode = optionItem.colorValue;
      let colorName = optionItem.colorName;
      
      return <MenuItem key={colorName} value={colorCode}>{colorName}</MenuItem>;
    })
  }

  render() {
    const { exercise, edit } = this.props;
    const title = !edit ? `Uusi osio` : `Muokkaa osiota`
    const description = !edit ? `Lisää uusi osio harjoitukseen ${exercise.name}` : `Muokkaa osiota`
    return (
      <div>
      <Button variant="fab" mini color="secondary" aria-label="add" onClick={this.handleClickOpen}><i className="material-icons">add</i></Button>
      <Dialog
      open={this.state.open}
      onClose={this.handleClose}
      aria-labelledby="form-dialog-title"
      >
      <DialogTitle id="form-dialog-title">{title}</DialogTitle>
      <DialogContent>
      <DialogContentText>
      {description}
      </DialogContentText>
      <TextField
      autoFocus
      margin="dense"
      id="name"
      label="Nimi"
      type="text"
      fullWidth
      />
      <br/>
      <TextField
      // autoFocus
      margin="dense"
      id="description"
      label="Sisältö"
      type="text"
      multiline
      rows="3"
      fullWidth
      />

      <FormControl className="{classes.formControl}">
      <InputLabel htmlFor="item-color">Väri</InputLabel>
      <Select
      value=""
      onChange="{this.handleChange}"
      inputProps={{
        name: 'color',
        id: 'item-color',
      }}
      >
      <MenuItem value="">
      <em>None</em>
      </MenuItem>
      {this.colorOptions};
      </Select>
      </FormControl>
      <br/>
      <TextField margin="dense"
      id="duration"
      label="Kesto"
      type="number"/>
      </DialogContent>
      <DialogActions>
      <Button onClick={this.handleClose} color="primary">
      Cancel
      </Button>
      <Button onClick={this.handleClose} color="primary">
      Add
      </Button>
      </DialogActions>
      </Dialog>
      </div>
    );
  }
}