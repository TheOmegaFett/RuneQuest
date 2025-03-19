import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { LoginForm } from "../LoginForm";
import { UserJwtProvider } from "../../../contexts/UserJwtContext";


describe("LoginForm", () => {
  const mockUserData = {
    username: "testUsername",
    password: "testPassword",
  };

  it("renders input fields and buttons for the login page", () => {
    render(
      <UserJwtProvider>
        <LoginForm />
      </UserJwtProvider>
    )

    // Check for input fields
    expect(screen.getByRole("textbox", { id: "username" })).toBeInTheDocument();
    expect(screen.getByRole("textbox", { id: "password" })).toBeInTheDocument();

    // Check for buttons
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /register/i })).toBeInTheDocument();
  })

  it("creates a fetch request with username and password data", () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ success: true, token: "mockToken" }),
      })
    );

    render(
      <UserJwtProvider>
        <LoginForm />
      </UserJwtProvider>
    );

    // Input username and password
    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: mockUserData.username },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: mockUserData.password },
    });

    // Click the login button
    fireEvent.click(screen.getByRole("button", { name: /login/i }))

    // Wait for fetch to be called
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("/api/users/"),
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mockUserData),
      })
    )
  })

});