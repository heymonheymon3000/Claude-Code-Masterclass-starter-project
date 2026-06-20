import { renderHook } from "@testing-library/react";
import { describe, it, expect, vi, afterEach } from "vitest";
import type { User } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
import { UserProvider, useUser } from "@/contexts/UserContext";

vi.mock("@/lib/firebase/auth", () => ({
  auth: {},
}));

vi.mock("firebase/auth", () => ({
  onAuthStateChanged: vi.fn(),
}));

afterEach(() => {
  vi.restoreAllMocks();
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <UserProvider>{children}</UserProvider>
);

describe("useUser", () => {
  it("returns { user: null, loading: true } before auth resolves", () => {
    vi.mocked(onAuthStateChanged).mockImplementation(() => () => {});

    const { result } = renderHook(() => useUser(), { wrapper });

    expect(result.current.user).toBeNull();
    expect(result.current.loading).toBe(true);
  });

  it("returns { user: null, loading: false } when signed out", () => {
    vi.mocked(onAuthStateChanged).mockImplementation((_auth, callback) => {
      if (typeof callback === "function") callback(null);
      return () => {};
    });

    const { result } = renderHook(() => useUser(), { wrapper });

    expect(result.current.user).toBeNull();
    expect(result.current.loading).toBe(false);
  });

  it("returns the user object when signed in", () => {
    const mockUser = { uid: "abc123", email: "heister@example.com" } as User;
    vi.mocked(onAuthStateChanged).mockImplementation((_auth, callback) => {
      if (typeof callback === "function") callback(mockUser);
      return () => {};
    });

    const { result } = renderHook(() => useUser(), { wrapper });

    expect(result.current.user).toBe(mockUser);
    expect(result.current.loading).toBe(false);
  });

  it("throws when called outside UserProvider", () => {
    vi.mocked(onAuthStateChanged).mockImplementation(() => () => {});
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    expect(() => renderHook(() => useUser())).toThrow(
      "useUser must be used within a UserProvider",
    );

    consoleError.mockRestore();
  });
});
