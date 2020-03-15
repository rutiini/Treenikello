import * as React from "react";
import ReactDOM from "react-dom";
import ExerciseEditor from "../dialogs/ExerciseEditor";
import { emptyExercise } from "../Utils";

function mock() {
    // mock function
}

it("ExerciseEditor renders without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render(<ExerciseEditor
    exercise={emptyExercise}
    usedNames={[]}
    updateExercise={mock}
    deleteExercise={mock}
    cancel={mock}
    />, div);
    ReactDOM.unmountComponentAtNode(div);
  });
