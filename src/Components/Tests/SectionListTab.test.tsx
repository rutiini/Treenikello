import * as React from "react";
import ReactDOM from "react-dom";
import { ISection } from "../../DataInterfaces";
import SectionListTab from "../tabs/SectionListTab";

const sectionTabProps = {
  deleteSection: (section: ISection) => void 0,
  exercise: {
    defaultSections: [],
    name: "",
    preset: false,
    startTime: new Date(),
  },
  expandedIndex: 0,
  selected: 0,
  setEditSection: (section: ISection) => {""; },
  updateSectionOrder: (sections: ISection[]) => {""; },
};

it("SectionListTab renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(
  <SectionListTab {...sectionTabProps} />
  , div);
  ReactDOM.unmountComponentAtNode(div);
});
