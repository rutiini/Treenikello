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
import { IExerciseContext, ISection } from '../../DataInterfaces';
import { withExerciseContext } from '../../ExerciseContext';
// store
import { colorOptions } from '../../Store';

const styles = createStyles({
  EditSectionDialog: {
    width: '75%'
  },
  numericInput: {
    marginLeft: 10,
    marginRight: 10,
    width: 80,
  }
})
const emptySection: ISection = {
  color: '',
  description: '',
  duration: 0,
  key: '',
  name: '',
  setupTime: 0
}

interface IProps extends WithStyles<typeof styles> {
  exerciseContext: IExerciseContext
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

      let section = nextProps.exerciseContext.exercises[nextProps.exerciseContext.selectedExerciseIndex].defaultSections[nextProps.exerciseContext.selectedSectionIndex]
      const { editSectionOpen } = nextProps.exerciseContext

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
            setupTime: 0
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

    return <MenuItem key={optionItem.colorName} value={optionItem.colorValue} style={{ backgroundColor: optionItem.colorValue }}>
      {/* {optionItem.colorName} */}
    </MenuItem>;
  })

  constructor(props: IProps) {
    super(props);
    this.state = {
      open: false,
      section: { ...emptySection }
    };
  }

  public render() {
    const { classes } = this.props;
    const { exercises, selectedExerciseIndex, selectedSectionIndex, editSectionOpen } = this.props.exerciseContext;
    const section = exercises[selectedExerciseIndex].defaultSections[selectedSectionIndex];

    const title = !section ? `Uusi osio` : `Muokkaa osiota`;
    // does not update the exercise index correctly.
    const dialogDescription = !section ? `Lisää uusi osio harjoitukseen ${exercises[selectedExerciseIndex].name}` : `Muokkaa osiota`;
    const acceptBtnText = !section ? 'Lisää' : 'Tallenna';
    const activeSection = this.state.section ? this.state.section : emptySection;

    return (
      <Dialog
        fullScreen={true}
        open={editSectionOpen}
        onClose={this.handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">{title}</DialogTitle>
        <DialogContent style={{ width: 312 }}>
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
            <Select style={{ backgroundColor: this.state.section.color }}
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
          <TextField
            className={classes.numericInput}
            margin="dense"
            id="setupTime"
            label="Alustus/Tauko"
            type="number"
            value={activeSection.setupTime}
            onChange={this.updateSetup}
          />
          <TextField
            className={classes.numericInput}
            style={{ float: "right" }}
            margin="dense"
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


  private handleClose = () => {

    this.props.exerciseContext.toggleSectionDialog(this.state.section);
    this.setState({
      open: false,
      section: { ...emptySection }
    })
  };

  private handleSubmit = () => {

    const { exercises, selectedExerciseIndex, selectedSectionIndex } = this.props.exerciseContext;
    this.props.exerciseContext.submitSection(exercises[selectedExerciseIndex].defaultSections[selectedSectionIndex], this.state.section);
    this.props.exerciseContext.toggleSectionDialog(this.state.section);

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

  private updateSetup = (event: ChangeEvent<HTMLSelectElement>) => {

    const newSetup = parseInt(event.target.value, 10);
    this.setState({
      section: {
        ...this.state.section,
        setup: newSetup
      }
    })
  }
}

export default withExerciseContext(withStyles(styles)(EditSectionDialog));