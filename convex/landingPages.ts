import { v } from "convex/values";

import type { Doc, Id } from "./_generated/dataModel";
import type { MutationCtx } from "./_generated/server";
import { mutation, query } from "./_generated/server";
import { describeAdminAuthFailure, requireAdmin } from "./lib/adminAuth";
import { createPageFromTemplate } from "./lib/createPageFromTemplate";
import {
  createPressureWashingSeed,
  PRESSURE_WASHING_SLUG,
} from "./lib/seedPressureWashingData";
import {
  createSoftwashingSeed,
  SOFTWASHING_SLUG,
} from "./lib/seedSoftwashingData";
import {
  createWindowCleaningSeed,
  WINDOW_CLEANING_SLUG,
} from "./lib/seedWindowCleaningData";
import { describeSlugError } from "./lib/slug";
import { landingPageUpdateValidator } from "./lib/validators";

type LandingPageDoc = Doc<"landingPages">;

async function resolveStorageUrl(
  ctx: {
    storage: {
      getUrl: (id: Id<"_storage">) => Promise<string | null>;
    };
  },
  storageId: Id<"_storage"> | undefined,
) {
  if (!storageId) {
    return null;
  }
  return await ctx.storage.getUrl(storageId);
}

async function serializeHero(
  ctx: {
    storage: {
      getUrl: (id: Id<"_storage">) => Promise<string | null>;
    };
  },
  hero: LandingPageDoc["hero"],
) {
  const [imageUrl, logoUrl] = await Promise.all([
    resolveStorageUrl(ctx, hero.imageStorageId),
    resolveStorageUrl(ctx, hero.logoStorageId),
  ]);

  return {
    ...hero,
    imageUrl,
    logoUrl,
  };
}

function serializePage(
  page: LandingPageDoc,
  hero: Awaited<ReturnType<typeof serializeHero>>,
) {
  return {
    ...page,
    hero,
  };
}

export const getPublishedBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const page = await ctx.db
      .query("landingPages")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();

    if (!page || page.status !== "published") {
      return null;
    }

    const hero = await serializeHero(ctx, page.hero);
    return serializePage(page, hero);
  },
});

export const getBySlugForPreview = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const identity = await requireAdmin(ctx);
    if (!identity) {
      return null;
    }

    const page = await ctx.db
      .query("landingPages")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();

    if (!page) {
      return null;
    }

    const hero = await serializeHero(ctx, page.hero);
    return serializePage(page, hero);
  },
});

export const listPublished = query({
  args: {},
  returns: v.array(
    v.object({
      slug: v.string(),
      name: v.string(),
      seoDescription: v.string(),
      heroHeadline: v.string(),
      serviceAreas: v.array(v.string()),
      businessName: v.string(),
    }),
  ),
  handler: async (ctx) => {
    const pages = await ctx.db.query("landingPages").collect();
    return pages
      .filter((page) => page.status === "published")
      .map((page) => ({
        slug: page.slug,
        name: page.name,
        seoDescription: page.seoDescription,
        heroHeadline: page.hero.headline,
        serviceAreas: page.serviceAreas,
        businessName: page.businessName,
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  },
});

export const listAll = query({
  args: {},
  handler: async (ctx) => {
    const identity = await requireAdmin(ctx);
    if (!identity) {
      return [];
    }

    const pages = await ctx.db.query("landingPages").collect();
    return pages
      .map((page) => ({
        _id: page._id,
        slug: page.slug,
        name: page.name,
        status: page.status,
        updatedAt: page.updatedAt,
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  },
});

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const identity = await requireAdmin(ctx);
    if (!identity) {
      return null;
    }

    const page = await ctx.db
      .query("landingPages")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();

    if (!page) {
      return null;
    }

    const hero = await serializeHero(ctx, page.hero);
    return serializePage(page, hero);
  },
});

export const update = mutation({
  args: {
    slug: v.string(),
    updates: landingPageUpdateValidator,
  },
  handler: async (ctx, args) => {
    const identity = await requireAdmin(ctx);
    if (!identity) {
      return { success: false as const, error: "Unauthorized" };
    }

    const page = await ctx.db
      .query("landingPages")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();

    if (!page) {
      return { success: false as const, error: "Page not found" };
    }

    await ctx.db.patch(page._id, {
      ...args.updates,
      updatedAt: Date.now(),
    });

    return { success: true as const };
  },
});

export const publish = mutation({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const identity = await requireAdmin(ctx);
    if (!identity) {
      return { success: false as const, error: "Unauthorized" };
    }

    const page = await ctx.db
      .query("landingPages")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();

    if (!page) {
      return { success: false as const, error: "Page not found" };
    }

    await ctx.db.patch(page._id, {
      status: "published",
      updatedAt: Date.now(),
    });

    return { success: true as const };
  },
});

export const unpublish = mutation({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const identity = await requireAdmin(ctx);
    if (!identity) {
      return { success: false as const, error: "Unauthorized" };
    }

    const page = await ctx.db
      .query("landingPages")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();

    if (!page) {
      return { success: false as const, error: "Page not found" };
    }

    await ctx.db.patch(page._id, {
      status: "draft",
      updatedAt: Date.now(),
    });

    return { success: true as const };
  },
});

export const getStorageUrl = query({
  args: { storageId: v.id("_storage") },
  returns: v.union(v.string(), v.null()),
  handler: async (ctx, args) => {
    const identity = await requireAdmin(ctx);
    if (!identity) {
      return null;
    }

    return await ctx.storage.getUrl(args.storageId);
  },
});

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await requireAdmin(ctx);
    if (!identity) {
      return { success: false as const, error: "Unauthorized" };
    }

    const uploadUrl = await ctx.storage.generateUploadUrl();
    return { success: true as const, uploadUrl };
  },
});

export const debugAuth = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return { authenticated: false as const };
    }

    return {
      authenticated: true as const,
      subject: identity.subject,
      email: identity.email ?? null,
      primaryEmail:
        typeof identity.primaryEmail === "string"
          ? identity.primaryEmail
          : null,
      tokenIdentifier: identity.tokenIdentifier,
      claimKeys: Object.keys(identity).sort(),
      adminError: describeAdminAuthFailure(identity),
      isAdmin: (await requireAdmin(ctx)) !== null,
    };
  },
});

export const createPage = mutation({
  args: {
    name: v.string(),
    slug: v.string(),
  },
  returns: v.union(
    v.object({
      success: v.literal(true),
      slug: v.string(),
      pageId: v.id("landingPages"),
    }),
    v.object({
      success: v.literal(false),
      error: v.string(),
    }),
  ),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    const admin = await requireAdmin(ctx);
    if (!admin) {
      return {
        success: false as const,
        error: describeAdminAuthFailure(identity),
      };
    }

    const trimmedName = args.name.trim();
    if (!trimmedName) {
      return { success: false as const, error: "Page name is required." };
    }

    const slug = args.slug.trim().toLowerCase();
    const slugError = describeSlugError(slug);
    if (slugError) {
      return { success: false as const, error: slugError };
    }

    const existing = await ctx.db
      .query("landingPages")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .unique();

    if (existing) {
      return {
        success: false as const,
        error: `A page with URL /${slug} already exists.`,
      };
    }

    const pageId = await ctx.db.insert(
      "landingPages",
      createPageFromTemplate(slug, trimmedName, Date.now()),
    );

    return { success: true as const, slug, pageId };
  },
});

export const seedSoftwashing = mutation({
  args: {},
  handler: async (ctx) => {
    return await seedPageIfMissing(
      ctx,
      SOFTWASHING_SLUG,
      createSoftwashingSeed,
    );
  },
});

export const seedPressureWashing = mutation({
  args: {},
  handler: async (ctx) => {
    return await seedPageIfMissing(
      ctx,
      PRESSURE_WASHING_SLUG,
      createPressureWashingSeed,
    );
  },
});

export const seedWindowCleaning = mutation({
  args: {},
  handler: async (ctx) => {
    return await seedPageIfMissing(
      ctx,
      WINDOW_CLEANING_SLUG,
      createWindowCleaningSeed,
    );
  },
});

async function seedPageIfMissing(
  ctx: MutationCtx,
  slug: string,
  createSeed: (now: number) => Omit<LandingPageDoc, "_id" | "_creationTime">,
) {
  const identity = await ctx.auth.getUserIdentity();
  const admin = await requireAdmin(ctx);
  if (!admin) {
    return {
      success: false as const,
      error: describeAdminAuthFailure(identity),
    };
  }

  const existing = await ctx.db
    .query("landingPages")
    .withIndex("by_slug", (q) => q.eq("slug", slug))
    .unique();

  if (existing) {
    return {
      success: true as const,
      created: false,
      pageId: existing._id,
    };
  }

  const pageId = await ctx.db.insert("landingPages", createSeed(Date.now()));

  return { success: true as const, created: true, pageId };
}
