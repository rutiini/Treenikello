import {
  Button,
  createStyles,
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
  withStyles,
  WithStyles
} from '@material-ui/core';
import React, { ChangeEvent, Component } from 'react';
import { IExerciseContext, ISection } from '../DataInterfaces';
import { withExerciseContext } from '../ExerciseContext';
// store
import { colorOptions } from '../Store';

const styles = createStyles({
  EditSectionDialog: {
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

interface IProps extends WithStyles<typeof styles>{
  exerciseContext?: IExerciseContext
}

interface IState {
  section: ISection,
  open: boolean
}

class EditSectionDialog extends Component<IProps, IState> {

  // just get the initial section from props and if there is none use the empty one?
  public static getDerivedStateFromProps(nextProps: IProps, prevState: IState) {
    // opening the dialog
    if (prevState) {

      const ctx = () => nextProps.exerciseContext as IExerciseContext;
      const {exercises,editSectionOpen} = ctx();
      let section = exercises[ctx().selectedExerciseIndex].defaultSections[ctx().selectedSectionIndex]

      // if (!prevState.open && nextProps.open) {
      if (!prevState.open && editSectionOpen) {

        if (section) {
          return {
            open: true,
            section
          };
        } else {
          section = {
            color: '',
            description: '',
            duration: 0,
            key: '',
            name: '',
          }
          return {
            open: true,
            section
          };
        }
      } else {
        return null;
      }
    } else {
      return null;
    }
  }

  private colorOptions = colorOptions.map(optionItem => {

    return <MenuItem key={optionItem.colorName} value={optionItem.colorValue}>{optionItem.colorName}</MenuItem>;
  })

  constructor(props: IProps) {
    super(props);
    this.state = {
      open: false,
      section: { ...emptySection }
    };
  }

  public render() {
    const { classes} = this.props;
    const { exercises, selectedExerciseIndex, selectedSectionIndex, editSectionOpen } = this.ctxt();
    const section = exercises[selectedExerciseIndex].defaultSections[selectedSectionIndex];

    const title = !section ? `Uusi osio` : `Muokkaa osiota`;
    // does not update the exercise index correctly.
    const dialogDescription = !section ? `Lisää uusi osio harjoitukseen ${exercises[selectedExerciseIndex].name}` : `Muokkaa osiota`;
    const acceptBtnText = !section ? 'Lisää' : 'Tallenna';
    const activeSection = this.state.section ? this.state.section : emptySection;

    return (
      <Dialog
        open={editSectionOpen}
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
            value={activeSection.name}
            onChange={this.updateName}
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
            onChange={this.updateDescription}
            fullWidth={true}
          />
          <FormControl className={classes.EditSectionDialog}>
            <InputLabel htmlFor="item-color">Väri</InputLabel>
            <Select
              value={this.state.section.color}
              onChange={this.updateColor}
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
            value={activeSection.duration}
            onChange={this.updateDuration}
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

  private ctxt = () => this.props.exerciseContext as IExerciseContext;

  private handleClose = () => {
    this.ctxt().toggleSectionDialog(this.state.section);
    this.setState({
      open: false,
      section: { ...emptySection }
    })
  };

  private handleSubmit = () => {
    const {exercises, selectedExerciseIndex,selectedSectionIndex} = this.ctxt();
    this.ctxt().submitSection(exercises[selectedExerciseIndex].defaultSections[selectedSectionIndex], this.state.section);
    this.ctxt().toggleSectionDialog(this.state.section);

    this.setState({
      open: false,
      section: { ...emptySection }
    })
  }

  private updateName = (event: ChangeEvent<HTMLInputElement>) => {

    this.setState({
      section: {
        ...this.state.section,
        name: event.target.value
      }
    })
  }

  private updateDescription = (event: ChangeEvent<HTMLInputElement>) => {

    this.setState({
      section: {
        ...this.state.section,
        description: event.target.value
      }
    })
  }

  private updateColor = (event: ChangeEvent<HTMLSelectElement>) => {

    this.setState({
      section: {
        ...this.state.section,
        color: event.target.value
      }
    })
  }

  private updateDuration = (event: ChangeEvent<HTMLSelectElement>) => {

    const newDuration = parseInt(event.target.value, 10);
    this.setState({
      section: {
        ...this.state.section,
        duration: newDuration
      }
    })
  }
}

export default withExerciseContext(withStyles(styles)(EditSectionDialog));