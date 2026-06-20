"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth } from "@/lib/firebase/auth";
import { db } from "@/lib/firebase/firestore";
import { generateCodename } from "@/lib/generateCodename";
import styles from "./AuthForm.module.css";

type AuthMode = "login" | "signup";

interface AuthFormProps {
  mode: AuthMode;
}

const copy = {
  login: {
    title: "Log in to Your Account",
    submit: "Log In",
    prompt: "Don't have an account?",
    linkLabel: "Sign up",
    linkHref: "/signup",
  },
  signup: {
    title: "Signup for an Account",
    submit: "Sign Up",
    prompt: "Already have an account?",
    linkLabel: "Log in",
    linkHref: "/login",
  },
} as const;

const firebaseErrorMessages: Record<string, string> = {
  "auth/email-already-in-use": "An account with this email already exists.",
  "auth/weak-password": "Password must be at least 6 characters.",
  "auth/invalid-email": "Please enter a valid email address.",
};

export default function AuthForm({ mode }: AuthFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const text = copy[mode];

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (mode === "signup") {
      setError(null);
      try {
        const result = await createUserWithEmailAndPassword(
          auth,
          email,
          password,
        );
        const codename = generateCodename();
        await updateProfile(result.user, { displayName: codename });
        await setDoc(doc(db, "users", result.user.uid), {
          codename,
          id: result.user.uid,
        });
        router.push("/heists");
      } catch (err) {
        const code = (err as { code?: string }).code ?? "";
        setError(
          firebaseErrorMessages[code] ??
            "Something went wrong. Please try again.",
        );
      }
    } else {
      console.log({ email, password });
    }
  }

  return (
    <div className="center-content">
      <div className="page-content">
        <h1 className="form-title">{text.title}</h1>

        <form className={styles.form} onSubmit={handleSubmit}>
          <label className={styles.field}>
            <span className={styles.label}>Email</span>
            <input
              className={styles.input}
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </label>

          <label className={styles.field}>
            <span className={styles.label}>Password</span>
            <div className={styles.passwordWrapper}>
              <input
                className={styles.input}
                type={showPassword ? "text" : "password"}
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={
                  mode === "login" ? "current-password" : "new-password"
                }
              />
              <button
                type="button"
                className={styles.toggle}
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                aria-pressed={showPassword}
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
          </label>

          <button type="submit" className="btn">
            {text.submit}
          </button>

          {error && (
            <p role="alert" className="text-red-500 text-sm text-center">
              {error}
            </p>
          )}
        </form>

        <p className={styles.switch}>
          {text.prompt}{" "}
          <Link href={text.linkHref} className={styles.switchLink}>
            {text.linkLabel}
          </Link>
        </p>
      </div>
    </div>
  );
}

function EyeIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M9.88 9.88a3 3 0 0 0 4.24 4.24" />
      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c6.5 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
      <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3.5 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
      <line x1="2" x2="22" y1="2" y2="22" />
    </svg>
  );
}
