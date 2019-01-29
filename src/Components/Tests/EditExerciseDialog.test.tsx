import * as React from 'react';
import ReactDOM from 'react-dom';
import { IExercise } from 'src/DataInterfaces';
import EditExerciseDialog from '../dialogs/EditExerciseDialog';

const exerciseDialogProps = {
  exercise: {
    defaultSections: [],
    name: "",
    preset: false,
    startTime: new Date()
  },
  open: true,
  submit: (exercise: IExercise) => { "hey" },
  validateExerciseName: (name: string) => true
}

it('EditExerciseDialog renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
  <EditExerciseDialog {...exerciseDialogProps} />
  , div);
  ReactDOM.unmountComponentAtNode(div);
});
