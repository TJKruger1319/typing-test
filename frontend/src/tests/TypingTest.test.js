import TypingTest from "../components/TypingTest"
import { render } from "@testing-library/react";
import React from "react"; 

it("Should render the components", function() {
    const TypingTestComponent = render(<TypingTest />);
    expect(TypingTestComponent).toContainHTML(<div></div>);
})

it("matches snapshot", function() {
    const {asFragment} = render(<TypingTest />);
    expect(asFragment()).toMatchSnapshot();
  });