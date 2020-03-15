import * as React from "react";
import ReactDOM from "react-dom";
import ConfirmationDialog from "../Components/dialogs/ConfirmationDialog";

it("ConfirmationDialog renders without crashing", () => {
  const testProps = {
    deleteExercise: () => true,
    exercise: {
      defaultSections: [],
      description: "b",
      duration: 1,
      name: "a",
      preset: false,
      setupTime: 1,
      startTime: new Date(),
    },
    open: true,
    setConfirmOpen: () => true,
  };

  const div = document.createElement("div");
  ReactDOM.render(
  <ConfirmationDialog {...testProps} />
  , div);
  ReactDOM.unmountComponentAtNode(div);
});
