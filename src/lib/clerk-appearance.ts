import type { SignInProps } from "@clerk/shared/types";

export const clerkAppearance: NonNullable<SignInProps["appearance"]> = {
  variables: {
    colorPrimary: "oklch(0.45 0.12 145)",
    borderRadius: "0.625rem",
    fontFamily: "var(--font-sans), system-ui, sans-serif",
  },
};
