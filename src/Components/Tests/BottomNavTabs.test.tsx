import React from "react";
import ReactDOM from "react-dom";
import BottomNavTabs from "../tabs/BottomNavTabs";

it("BottomNavTabs renders without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render(<BottomNavTabs />, div);
    ReactDOM.unmountComponentAtNode(div);
});
