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
import React, { ChangeEvent, FunctionComponent, useContext, useState } from 'react';
import { ISection } from 'src/DataInterfaces';
// store
import { colorOptions } from '../../Store';
import ExerciseContext from '../AppReducer/ExerciseContext';
import { ActionType } from '../AppReducer/ExerciseReducer';

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
  readonly section: ISection | null,
}

const EditSectionDialog: FunctionComponent<IProps> = (props: IProps) => {
  const [state, dispatch] = useContext(ExerciseContext);  
  const [section, setSection] = useState(props.section ? props.section : emptySection);
  
  // determine the mode of the dialog
  const newSection = !(state.editSection && state.editSection.name);  

  const handleClose = () =>{
    dispatch({type: ActionType.SetEditSection, payload: null});
  };

  const handleSubmit = () => {
    if(!newSection){
      dispatch({type: ActionType.UpdateSection, payload: section});
    }else{
      dispatch({type: ActionType.AddSection, payload: section});
    }
    handleClose();
    setSection({ ...emptySection });
  }

  /** updates a property with string value that matches the name of the sender element */
  const updateStringProp = (event: ChangeEvent<HTMLSelectElement>) => {
    setSection({
        ...section,
        [event.target.name]: event.target.value
    })
  }

  /** updates a property with numeric value that matches the name of the sender element */
  const updateNumberProp = (event: ChangeEvent<HTMLSelectElement>) => {
    setSection({
        ...section,
        [event.target.name]: parseInt(event.target.value,10)
    })
  }

    const title = newSection ? `Uusi osio` : `Muokkaa osiota`;
    // does not update the exercise index correctly.
    const dialogDescription = newSection ? `Lisää uusi osio harjoitukseen ${state.activeExercise.name}` : `Muokkaa osiota`;
    const acceptBtnText = newSection ? 'Lisää' : 'Tallenna';
    const colors = colorOptions.map((o, index) => {
      return <MenuItem key={index} value={o.colorValue} style={{backgroundColor: o.colorValue}} />
    });
    const {classes} = props;
    return (
      <Dialog
        open={!!state.editSection}
        onClose={handleClose}
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
            onChange={updateStringProp}
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
            onChange={updateStringProp}
            variant="filled"
          />
          <FormControl className={classes.EditSectionDialog}>
            <InputLabel htmlFor="item-color">Väri</InputLabel>
            <Select style={{ backgroundColor: section.color }}
              value={section.color}
              onChange={updateStringProp}
              // TODO: change
              inputProps={{
                id: 'item-color',
                name: 'color',
              }}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {colors};
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
            onChange={updateNumberProp}
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
            onChange={updateNumberProp}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Peruuta
      </Button>
          <Button onClick={handleSubmit} color="primary">
            {acceptBtnText}
          </Button>
        </DialogActions>
      </Dialog>
    );
}

export default withStyles(styles)(EditSectionDialog);