import * as React from "react";
import ReactDOM from "react-dom";
import CompactSectionListItem from "../Components/CompactSectionListItem";
import { emptySection } from "../Utils";

function mock(): void {
    // mock function
}

it("CompactSectionListItem renders without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render(<CompactSectionListItem section={emptySection} index={0} editSection={mock} />, div);
    ReactDOM.unmountComponentAtNode(div);
});
