import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, afterEach } from "vitest";
import AuthForm from "@/components/AuthForm";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("AuthForm", () => {
  it("renders email, password and a Log In button in login mode", () => {
    render(<AuthForm mode="login" />);

    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /log in/i })).toBeInTheDocument();
  });

  it("renders email, password and a Sign Up button in signup mode", () => {
    render(<AuthForm mode="signup" />);

    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /sign up/i }),
    ).toBeInTheDocument();
  });

  it("toggles the password field between hidden and visible", async () => {
    const user = userEvent.setup();
    render(<AuthForm mode="login" />);

    const password = screen.getByLabelText("Password");
    expect(password).toHaveAttribute("type", "password");

    await user.click(screen.getByRole("button", { name: /show password/i }));
    expect(password).toHaveAttribute("type", "text");

    await user.click(screen.getByRole("button", { name: /hide password/i }));
    expect(password).toHaveAttribute("type", "password");
  });

  it("logs the entered credentials when the login form is submitted", async () => {
    const user = userEvent.setup();
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    render(<AuthForm mode="login" />);

    await user.type(screen.getByLabelText("Email"), "heister@example.com");
    await user.type(screen.getByLabelText("Password"), "s3cret");
    await user.click(screen.getByRole("button", { name: /log in/i }));

    expect(logSpy).toHaveBeenCalledWith({
      email: "heister@example.com",
      password: "s3cret",
    });
  });

  it("logs the entered credentials when the signup form is submitted", async () => {
    const user = userEvent.setup();
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    render(<AuthForm mode="signup" />);

    await user.type(screen.getByLabelText("Email"), "newbie@example.com");
    await user.type(screen.getByLabelText("Password"), "hunter2");
    await user.click(screen.getByRole("button", { name: /sign up/i }));

    expect(logSpy).toHaveBeenCalledWith({
      email: "newbie@example.com",
      password: "hunter2",
    });
  });

  it("links from login to the signup page", () => {
    render(<AuthForm mode="login" />);

    expect(screen.getByRole("link", { name: /sign up/i })).toHaveAttribute(
      "href",
      "/signup",
    );
  });

  it("links from signup to the login page", () => {
    render(<AuthForm mode="signup" />);

    expect(screen.getByRole("link", { name: /log in/i })).toHaveAttribute(
      "href",
      "/login",
    );
  });
});
