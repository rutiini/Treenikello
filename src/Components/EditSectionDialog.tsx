import { Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Theme,
  withStyles
} from '@material-ui/core';
import React, { Component } from 'react';
import { IExercise, ISection } from '../DataInterfaces';
// store
import { colorOptions } from '../Store';

const styles = (theme: Theme) => ({
  EditSectionForm: {
    width: '75%'
  }
})
const emptySection: ISection = {
  color: '',
  description: '',
  duration: 0,
  key: '',
  name: '',
}

interface IProps{
  exercise: IExercise, 
  classes: any, 
  open: boolean, 
  section: ISection,
  handleToggle: (section: ISection) => void, // review the necessity of this!
  handleSubmit: (oldSection: ISection, newSection: ISection) => void
}

interface IState{
  section: ISection,
  open: boolean
}

export default withStyles(styles)(class EditSectionDialog extends Component<IProps,IState> {

  public static getDerivedStateFromProps(nextProps: IProps, prevState: IState){
    // opening the dialog
    if(!prevState.open && nextProps.open){
      if(nextProps.section){
        return {
          open: true,
          section: {...nextProps.section}
        };
      }else{
        return {
          open: true,
          section: {...emptySection}
        };
      }
    // default.
    }else{
      return null;
    }
  }
  
  // constructor(super){
    private colorOptions = colorOptions.map(optionItem => {
      const colorCode = optionItem.colorValue;
      const colorName = optionItem.colorName;

      return <MenuItem key={colorName} value={colorCode}>{colorName}</MenuItem>;
    })
  
  public componentDidMount(){
    
    this.setState({
      open: false,
      section: {...emptySection}
    });
  }

  public render() {
    const { exercise, classes, open, section } = this.props;

    const title = !section ? `Uusi osio` : `Muokkaa osiota`;
    const dialogDescription = !section ? `Lisää uusi osio harjoitukseen ${exercise.name}` : `Muokkaa osiota`;
    const acceptBtnText = !section ? 'Lisää' : 'Tallenna';

    return (
      <Dialog
        open={open}
        onClose={this.handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">{title}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {dialogDescription}
          </DialogContentText>
          <TextField
            autoFocus={true}
            margin="dense"
            id="name"
            label="Nimi"
            type="text"
            value={this.state.section.name}
            // onChange={this.handleChange('name')}
            fullWidth={true}
          />
          <br />
          <TextField
            margin="dense"
            id="description"
            label="Sisältö"
            type="text"
            multiline={true}
            rows="2"
            value={this.state.section.description}
            // onChange={this.handleChange('description')}
            fullWidth={true}
          />
          <FormControl className={classes.EditSectionDialog}>
            <InputLabel htmlFor="item-color">Väri</InputLabel>
            <Select
              value={this.state.section.color}
              // onChange={this.handleChange('color')}
              inputProps={{
                id: 'item-color',
                name: 'color',
              }}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {this.colorOptions};
      </Select>
          </FormControl>
          <br />
          <TextField margin="dense"
            id="duration"
            label="Kesto"
            type="number"
            value={this.state.section.duration}
            // onChange={this.handleChange('duration')}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleClose} color="primary">
            Peruuta
      </Button>
          <Button onClick={this.handleSubmit} color="primary">
            {acceptBtnText}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  private handleClose = () => {
    this.props.handleToggle(this.state.section);
    this.setState({
      open: false,
      section: {...emptySection}
    })
  };

  private handleSubmit = () => {
    this.props.handleSubmit(this.props.section, this.state.section);
    this.props.handleToggle(this.state.section);
    this.setState({
      open: false,
      section: {...emptySection}
    })
  }

  // magical generic prop handling:
  // private handleChange = name => ({ target: { value } }) => {
  //   this.setState({
  //     section: {
  //       ...this.state.section,
  //       [name]: value
  //     }
  //   })

  // }
})