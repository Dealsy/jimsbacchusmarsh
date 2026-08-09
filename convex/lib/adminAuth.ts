import type { UserIdentity } from "convex/server";
import type { MutationCtx, QueryCtx } from "../_generated/server";

type AuthCtx = QueryCtx | MutationCtx;

function getAdminEmails(): readonly string[] {
  const raw = process.env.ADMIN_EMAILS ?? "";
  return raw
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

function getAdminUserIds(): readonly string[] {
  const raw = process.env.ADMIN_USER_IDS ?? "";
  return raw
    .split(",")
    .map((userId) => userId.trim())
    .filter(Boolean);
}

export function isAdminEmail(email: string | undefined): boolean {
  if (!email) {
    return false;
  }
  const allowlist = getAdminEmails();
  if (allowlist.length === 0) {
    return false;
  }
  return allowlist.includes(email.trim().toLowerCase());
}

function isAdminUserId(subject: string | undefined): boolean {
  if (!subject) {
    return false;
  }
  const allowlist = getAdminUserIds();
  if (allowlist.length === 0) {
    return false;
  }
  return allowlist.includes(subject);
}

function isAdminIdentity(identity: UserIdentity): boolean {
  const email = getIdentityEmail(identity);
  if (email && isAdminEmail(email)) {
    return true;
  }

  return isAdminUserId(identity.subject);
}

function isEmailLike(value: unknown): value is string {
  return typeof value === "string" && value.includes("@");
}

function getIdentityEmail(identity: UserIdentity): string | undefined {
  if (isEmailLike(identity.email)) {
    return identity.email.trim().toLowerCase();
  }

  const claimKeys = [
    "primaryEmail",
    "primary_email",
    "primary_email_address",
    "email_address",
  ] as const;

  for (const key of claimKeys) {
    const value = identity[key];
    if (isEmailLike(value)) {
      return value.trim().toLowerCase();
    }
  }

  return undefined;
}

export function describeAdminAuthFailure(
  identity: UserIdentity | null,
): string {
  if (!identity) {
    return "Convex did not receive your Clerk session. Confirm the Convex integration is enabled and run npx convex dev.";
  }

  const email = getIdentityEmail(identity);
  const allowlist = getAdminEmails();
  const userIdAllowlist = getAdminUserIds();

  if (!email && !isAdminUserId(identity.subject)) {
    const claimKeys = Object.keys(identity).sort().join(", ");
    return `No email claim in your Convex identity (subject: ${identity.subject}). In Clerk go to Sessions → Customize session token and add: "email": "{{user.primary_email_address}}". Then sign out and back in. Or set ADMIN_USER_IDS=${identity.subject} in the Convex dashboard. Identity keys: ${claimKeys}`;
  }

  if (!isAdminIdentity(identity)) {
    if (allowlist.length === 0 && userIdAllowlist.length === 0) {
      return "Neither ADMIN_EMAILS nor ADMIN_USER_IDS is set on this Convex deployment.";
    }

    const signedInAs = email ?? identity.subject;
    const allowed = [
      ...allowlist.map((value) => `email:${value}`),
      ...userIdAllowlist.map((value) => `user:${value}`),
    ];
    return `Signed in as ${signedInAs}, but admin allowlist only includes: ${allowed.join(", ")}`;
  }

  return "Authorized";
}

export async function requireAdmin(ctx: AuthCtx): Promise<UserIdentity | null> {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity || !isAdminIdentity(identity)) {
    return null;
  }

  return identity;
}
