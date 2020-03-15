import * as React from "react";
import ReactDOM from "react-dom";
import Clock from "../Clock";

const testProps = {
  canvasSide: 100,
  time: new Date(),
};

it("Clock renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(<Clock {...testProps} />, div);
  ReactDOM.unmountComponentAtNode(div);
});
