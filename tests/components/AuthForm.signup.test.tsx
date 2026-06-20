import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, afterEach } from "vitest";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { setDoc } from "firebase/firestore";
import AuthForm from "@/components/AuthForm";

vi.mock("@/lib/firebase/auth", () => ({ auth: {} }));
vi.mock("@/lib/firebase/firestore", () => ({ db: {} }));
vi.mock("firebase/auth", () => ({
  createUserWithEmailAndPassword: vi.fn(),
  updateProfile: vi.fn(),
}));
vi.mock("firebase/firestore", () => ({
  doc: vi.fn(() => "users/test-uid"),
  setDoc: vi.fn(),
}));
vi.mock("@/lib/generateCodename", () => ({
  generateCodename: vi.fn(() => "SwiftCrimsonFox"),
}));

const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

afterEach(() => {
  vi.restoreAllMocks();
  mockPush.mockReset();
});

async function fillAndSubmit(email: string, password: string) {
  const user = userEvent.setup();
  render(<AuthForm mode="signup" />);
  await user.type(screen.getByLabelText("Email"), email);
  await user.type(screen.getByLabelText("Password"), password);
  await user.click(screen.getByRole("button", { name: /sign up/i }));
}

describe("AuthForm signup", () => {
  it("calls createUserWithEmailAndPassword with email and password", async () => {
    vi.mocked(createUserWithEmailAndPassword).mockResolvedValue({
      user: { uid: "test-uid" },
    } as never);
    vi.mocked(updateProfile).mockResolvedValue();
    vi.mocked(setDoc).mockResolvedValue();

    await fillAndSubmit("heister@example.com", "s3cret123");

    expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
      {},
      "heister@example.com",
      "s3cret123",
    );
  });

  it("calls updateProfile with the generated codename as displayName", async () => {
    const mockUser = { uid: "test-uid" };
    vi.mocked(createUserWithEmailAndPassword).mockResolvedValue({
      user: mockUser,
    } as never);
    vi.mocked(updateProfile).mockResolvedValue();
    vi.mocked(setDoc).mockResolvedValue();

    await fillAndSubmit("heister@example.com", "s3cret123");

    expect(updateProfile).toHaveBeenCalledWith(mockUser, {
      displayName: "SwiftCrimsonFox",
    });
  });

  it("writes a Firestore document with codename and id but not email", async () => {
    const mockUser = { uid: "test-uid" };
    vi.mocked(createUserWithEmailAndPassword).mockResolvedValue({
      user: mockUser,
    } as never);
    vi.mocked(updateProfile).mockResolvedValue();
    vi.mocked(setDoc).mockResolvedValue();

    await fillAndSubmit("heister@example.com", "s3cret123");

    await waitFor(() => {
      expect(setDoc).toHaveBeenCalledWith(expect.anything(), {
        codename: "SwiftCrimsonFox",
        id: "test-uid",
      });
    });
    expect(setDoc).not.toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ email: expect.anything() }),
    );
  });

  it("redirects to /heists on successful signup", async () => {
    vi.mocked(createUserWithEmailAndPassword).mockResolvedValue({
      user: { uid: "test-uid" },
    } as never);
    vi.mocked(updateProfile).mockResolvedValue();
    vi.mocked(setDoc).mockResolvedValue();

    await fillAndSubmit("heister@example.com", "s3cret123");

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/heists");
    });
  });

  it("shows an error message when signup fails", async () => {
    vi.mocked(createUserWithEmailAndPassword).mockRejectedValue({
      code: "auth/email-already-in-use",
    });

    await fillAndSubmit("taken@example.com", "s3cret123");

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(
        "An account with this email already exists.",
      );
    });
  });
});
