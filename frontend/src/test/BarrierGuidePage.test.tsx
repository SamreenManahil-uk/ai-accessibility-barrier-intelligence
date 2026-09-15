import {
  render,
  screen,
} from "@testing-library/react";
import { describe, expect, it } from "vitest";

import BarrierGuidePage from "../pages/BarrierGuidePage";

describe("BarrierGuidePage", () => {
  it("shows the trained model classes", () => {
    render(<BarrierGuidePage />);

    expect(
      screen.getByText("Stairs"),
    ).toBeInTheDocument();

    expect(
      screen.getByText("Pothole"),
    ).toBeInTheDocument();

    expect(
      screen.getByText("Road-barrier"),
    ).toBeInTheDocument();

    expect(
      screen.getByText("Vehicle"),
    ).toBeInTheDocument();
  });

  it("shows the model scope disclaimer", () => {
    render(<BarrierGuidePage />);

    expect(
      screen.getByText(
        /not a formal accessibility certification/i,
      ),
    ).toBeInTheDocument();
  });
});
