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
import { withStyles} from 'material-ui/styles';
// store
import { colorOptions } from '../Store';

const styles = theme => ({
  EditSectionForm: {
    width: '75%'
  }
})

export default withStyles(styles) (class EditSectionDialog extends Component {
  state = {
    open: false,
    section: {
      name: '',
      description: '',
      duration: 0,
      color: ''
    }
  };

  handleClose = () => {
    this.props.handleToggle();
  };

  // magical generic prop handling:
  handleChange = name  => ({target: { value }}) => {
    console.log(`${[name]} set ${value}`);
    // magic part 2:
    
    this.setState({
      section:{
        ...this.state.section,
        [name]: value
      }
    },
    // how come state is not mutated here
    console.log(this.state.section))
    
  }
  
  componentWillMount(){
    this.colorOptions = colorOptions.map(optionItem => {
      let colorCode = optionItem.colorValue;
      let colorName = optionItem.colorName;
      
      return <MenuItem key={colorName} value={colorCode}>{colorName}</MenuItem>;
    })
  }
  // set initial state
  componentWillReceiveProps(nextProps){
    if(nextProps.section){
      this.setState({
        section: nextProps.section
      })
    }else{
      this.setState({
        section: {
          name: '',
          description: '',
          duration: 5,
          color: ''
        }
      }
      )
    }
  }

  render() {
    const { exercise, classes, open, section } = this.props;
    
    const title = !section ? `Uusi osio` : `Muokkaa osiota`
    const dialogDescription = !section ? `Lisää uusi osio harjoitukseen ${exercise.name}` : `Muokkaa osiota`

    return (
      <Dialog
      open={open}
      onClose={this.handleClose}
      aria-labelledby="form-dialog-title"
      // className={classes.EditSectionForm}
      >
      <DialogTitle id="form-dialog-title">{title}</DialogTitle>
      <DialogContent>
      <DialogContentText>
      {dialogDescription}
      </DialogContentText>
      <TextField
      autoFocus
      margin="dense"
      id="name"
      label="Nimi"
      type="text"
      value={this.state.section.name}
      onChange={this.handleChange('name')}
      fullWidth
      />
      <br/>
      <TextField
      margin="dense"
      id="description"
      label="Sisältö"
      type="text"
      multiline
      rows="3"
      value={this.state.section.description}
      onChange={this.handleChange('description')}
      fullWidth
      />
      <FormControl className={classes.EditSectionDialog}>
      <InputLabel htmlFor="item-color">Väri</InputLabel>
      <Select
      value={this.state.section.color}
      onChange={this.handleChange('color')}
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
      type="number"
      value={this.state.section.duration}
      onChange={this.handleChange('duration')}
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