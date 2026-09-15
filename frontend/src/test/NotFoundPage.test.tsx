import {
  render,
  screen,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";

import NotFoundPage from "../pages/NotFoundPage";

describe("NotFoundPage", () => {
  it("renders recovery navigation", () => {
    render(
      <MemoryRouter>
        <NotFoundPage />
      </MemoryRouter>,
    );

    expect(
      screen.getByText(/error 404/i),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("link", {
        name: /go home/i,
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("link", {
        name: /vision lab/i,
      }),
    ).toBeInTheDocument();
  });
});
