import * as React from 'react';
import ReactDOM from 'react-dom';
import ExerciseListTab from '../tabs/ExerciseListTab';
import { emptyExercise } from '../Utils';

function mock(){
    // mock function
}

it('ExerciseListTab renders without crashing with one empty Exercise', () => {
    const div = document.createElement('div');
    ReactDOM.render(<ExerciseListTab 
        exercises={[emptyExercise]} 
        selectExercise={mock}
        selected={0}

        />, div);
    ReactDOM.unmountComponentAtNode(div);
  });