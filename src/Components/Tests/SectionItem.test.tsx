import React from "react";
import ReactDOM from "react-dom";
import SectionItem from "../SectionItem";

it("BottomNavigation renders without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render(
        <SectionItem
            className={"a"}
            cx={1}
            cy={1}
            radius={1}
            startAngle={0}
            endAngle={90}
            thickness={2}
            color={"red"}
        />,
        div
    );
    ReactDOM.unmountComponentAtNode(div);
});
