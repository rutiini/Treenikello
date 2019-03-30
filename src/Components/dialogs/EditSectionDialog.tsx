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
  section: ISection | null,
}

const EditSectionDialog: FunctionComponent<IProps> = (props: IProps) => {
  const [state, dispatch] = useContext(ExerciseContext);  
  const [section, setSection] = useState(props.section ? props.section : emptySection);

    
  const handleClose = () =>{
    // dispatch.setEditSection(null);
    dispatch({type: ActionType.SetEditSection, payload: null});
  };

  const handleSubmit = () => {
    if(props.section){
      // dispatch.updateSection(section);
      dispatch({type: ActionType.UpdateSection, payload: section});
    }else{
      // dispatch.addSection(section);
      dispatch({type: ActionType.AddSection, payload: section});
    }
    handleClose();
    setSection({ ...emptySection });
  }
  /** updates a property that matches the name of the sender element */
  const updateProp = (event: ChangeEvent<HTMLSelectElement>) => {
    setSection({
        ...section,
        [event.target.name]: event.target.value
    })
  }
    const title = !section ? `Uusi osio` : `Muokkaa osiota`;
    // does not update the exercise index correctly.
    const dialogDescription = !section ? `Lisää uusi osio harjoitukseen ${state.activeExercise.name}` : `Muokkaa osiota`;
    const acceptBtnText = !section ? 'Lisää' : 'Tallenna';
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
            onChange={updateProp}
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
            onChange={updateProp}
            variant="filled"
          />
          <FormControl className={classes.EditSectionDialog}>
            <InputLabel htmlFor="item-color">Väri</InputLabel>
            <Select style={{ backgroundColor: section.color }}
              value={section.color}
              onChange={updateProp}
              // TODO: change
              inputProps={{
                id: 'item-color',
                name: 'color',
              }}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {colorOptions};
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
            onChange={updateProp}
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
            onChange={updateProp}
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