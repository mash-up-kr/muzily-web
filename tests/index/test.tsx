import { render, screen } from "@testing-library/react";
import MainPage from "~/pages/index";

describe("MainPage", () => {
  it("renders a heading", () => {
    const { container } = render(<MainPage />);
    const heading = screen.getByRole("heading", {
      name: /welcome to next\.js!/i,
    });

    expect(heading).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });
});
