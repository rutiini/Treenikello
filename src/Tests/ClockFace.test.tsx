import * as React from "react";
import ReactDOM from "react-dom";
import { TimerMode } from "../Components/Clock";
import ClockFace from "../Components/ClockFace";
import { ClockData } from "../Utils/ClockUtilities";

const testProps = {
    centerCoordinate: 10,
    clockData: new ClockData(new Date()),
    sectionItems: [],
    stopWatchRotation: 230,
    timerMode: TimerMode.Hidden,
};

it("ClockFace renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(<ClockFace {...testProps} />, div);
  ReactDOM.unmountComponentAtNode(div);
});
