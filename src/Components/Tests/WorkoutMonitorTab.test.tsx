import * as React from "react";
import ReactDOM from "react-dom";
import WorkoutMonitorTab from "../tabs/WorkoutMonitorTab";
import { emptyExercise, emptySection } from "../Utils";

it("WorkoutMonitorTab renders without crashing when there is no active section", () => {
    const div = document.createElement("div");
    ReactDOM.render(<WorkoutMonitorTab exercise={emptyExercise} activeSection={null} />, div);
    ReactDOM.unmountComponentAtNode(div);
});

const exerciseWithSection = {
    ...emptyExercise,
    defaultSections: [
        {
            ...emptySection,
            name: "testing",
            duration: 10
        }
    ]
};

it("WorkoutMonitorTab renders without crashing when there an active section", () => {
    const div = document.createElement("div");
    ReactDOM.render(<WorkoutMonitorTab exercise={exerciseWithSection} activeSection={emptySection} />, div);
    ReactDOM.unmountComponentAtNode(div);
});

it("WorkoutMonitorTab renders without crashing when time has passed the exercise duration", () => {
    exerciseWithSection.startTime= new Date(Date.now() - 900000); // 15 mins in the past
    const div = document.createElement("div");
    ReactDOM.render(<WorkoutMonitorTab exercise={exerciseWithSection} activeSection={emptySection} />, div);
    ReactDOM.unmountComponentAtNode(div);
});
