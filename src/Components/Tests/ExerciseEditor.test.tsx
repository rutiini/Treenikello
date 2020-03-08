import * as React from 'react';
import ReactDOM from 'react-dom';
import ExerciseEditor from '../dialogs/ExerciseEditor';
import { emptyExercise } from '../Utils';

it('ExerciseEditor renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<ExerciseEditor
    exercise={emptyExercise}
    usedNames={[]}
    updateExercise={() => void 0}
    deleteExercise={() => void 0}
    cancel={() => void 0}
    />, div);
    ReactDOM.unmountComponentAtNode(div);
  });