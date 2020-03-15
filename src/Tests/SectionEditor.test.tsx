import * as React from "react";
import ReactDOM from "react-dom";
import SectionEditor from "../Components/dialogs/SectionEditor";
import { emptySection } from "../Utils";

function mock() {
    // mock function
}
it("SectionEditor renders without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render(<SectionEditor
        section={emptySection}
        updateSection={mock}
        deleteSection={mock}
        cancel={mock}
        />, div);
    ReactDOM.unmountComponentAtNode(div);
  });
