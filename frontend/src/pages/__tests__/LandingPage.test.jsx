import { describe, it, expect } from "vitest";
import { render, screen, } from "@testing-library/react";
import { Landing } from "../Landing";
import { UserJwtProvider } from "../../contexts/UserJwtContext";


describe("Landing", () => {
  it("renders the header, login form and overview", () => {
    render(
      <UserJwtProvider>
        <Landing />
      </UserJwtProvider>
    );

    // Should include the header element from Header
    const header = screen.getByTestId("header")
    expect(header).toBeInTheDocument();

    // Should include the form element from LoginForm
    expect(screen.getByTestId("login-form")).toBeInTheDocument();

    // Should include the article component that contains the overview
    expect(screen.getByTestId("overview")).toBeInTheDocument();
  });
});

