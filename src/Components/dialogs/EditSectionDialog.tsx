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
import React, { ChangeEvent, Component, Context, ContextType } from 'react';
import { ISection } from 'src/DataInterfaces';
// store
import { colorOptions } from '../../Store';
import { AppContext, IAppContext } from '../AppContext';

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
  section: ISection | null,
}

interface IState {
  section: ISection
}

class EditSectionDialog extends Component<IProps, IState> {

  public static contextType: Context<IAppContext> = AppContext;
  public context!: ContextType<typeof AppContext>;
  
  private colorOptions = colorOptions.map(optionItem => {

    return <MenuItem key={optionItem.colorName} value={optionItem.colorValue} style={{ backgroundColor: optionItem.colorValue }}>
      {/* {optionItem.colorName} */}
    </MenuItem>;
  })

  constructor(props: IProps) {
    super(props);
    this.state = {
      section: props.section ? {...props.section} : {...emptySection}
    };
  }

  public render() {
    const { classes } = this.props;
    const { selectedExercise, editSection } = this.context.state;
    const { section } = this.state

    const title = !section ? `Uusi osio` : `Muokkaa osiota`;
    // does not update the exercise index correctly.
    const dialogDescription = !section ? `Lisää uusi osio harjoitukseen ${selectedExercise.name}` : `Muokkaa osiota`;
    const acceptBtnText = !section ? 'Lisää' : 'Tallenna';

    return (
      <Dialog
        open={!!editSection}
        onClose={this.handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">{title}</DialogTitle>
        <DialogContent style={{ width: 312 }}>
          <DialogContentText>
            {dialogDescription}
          </DialogContentText>
          <TextField
            name="name"
            autoFocus={true}
            margin="dense"
            id="name"
            label="Nimi"
            type="text"
            value={section.name}
            onChange={this.updateProp}
            variant="filled"
          />
          <br />
          <TextField
            name="description"
            margin="dense"
            id="description"
            label="Sisältö"
            type="text"
            multiline={true}
            rows="2"
            value={section.description}
            onChange={this.updateProp}
            variant="filled"
          />
          <FormControl className={classes.EditSectionDialog}>
            <InputLabel htmlFor="item-color">Väri</InputLabel>
            <Select style={{ backgroundColor: this.state.section.color }}
              value={this.state.section.color}
              onChange={this.updateProp}
              // TODO: change
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
            name='setupTime'
            className={classes.numericInput}
            margin="dense"
            id="setupTime"
            label="Alustus/Tauko"
            type="number"
            value={section.setupTime}
            onChange={this.updateProp}
          />
          <TextField
            name='duration'
            className={classes.numericInput}
            style={{ float: "right" }}
            margin="dense"
            id="duration"
            label="Kesto"
            type="number"
            value={section.duration}
            onChange={this.updateProp}
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


  private handleClose = () =>{
    this.context.dispatch.setEditSection(null);
  };

  private handleSubmit = () => {
    this.context.dispatch.updateSection(this.state.section);
    this.handleClose();
    this.setState({
      section: { ...emptySection }
    })
  }
  /** updates a property that matches the name of the sender element */
  private updateProp = (event: ChangeEvent<HTMLSelectElement>) => {
    this.setState({
      section: {
        ...this.state.section,
        [event.target.name]: event.target.value
      }
    })
  }
}

export default withStyles(styles)(EditSectionDialog);