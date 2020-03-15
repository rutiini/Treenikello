import * as React from "react";
import ReactDOM from "react-dom";
import SlideInContainer from "../Components/SlideInContainer";

it("SlideInContainer renders closed state without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render(
        <SlideInContainer open={false}>
            <>1</>
            <>2</>
        </SlideInContainer>,
        div
    );
    expect(div).toContainHTML("collapsed");
    ReactDOM.unmountComponentAtNode(div);
});

it("SlideInContainer renders open state without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render(
        <SlideInContainer open={true}>
            <>1</>
            <>2</>
        </SlideInContainer>,
        div
    );

    expect(div).toContainHTML("expanded");
    ReactDOM.unmountComponentAtNode(div);
});

it("SlideInContainer throws with too few children", () => {
    const div = document.createElement("div");

    expect(() => ReactDOM.render(
        <SlideInContainer open={true}>
            <>1</>
        </SlideInContainer>,
        div
    )).toThrowError();
    ReactDOM.unmountComponentAtNode(div);
});

it("SlideInContainer throws with too few children", () => {
    const div = document.createElement("div");

    expect(() => ReactDOM.render(
        <SlideInContainer open={true}>
            <>1</>
            <>2</>
            <>3</>
        </SlideInContainer>,
        div
    )).toThrowError();
    ReactDOM.unmountComponentAtNode(div);
});
