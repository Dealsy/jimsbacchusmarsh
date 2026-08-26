import { v } from "convex/values";

import type { Doc, Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";
import { requireAdmin } from "./lib/adminAuth";

const galleryItemReturnValidator = v.object({
  _id: v.id("landingPageGallery"),
  sortOrder: v.number(),
  label: v.optional(v.string()),
  category: v.optional(v.string()),
  beforeUrl: v.union(v.string(), v.null()),
  afterUrl: v.union(v.string(), v.null()),
});

const upsertResultValidator = v.union(
  v.object({
    success: v.literal(true),
    itemId: v.id("landingPageGallery"),
  }),
  v.object({
    success: v.literal(false),
    error: v.string(),
  }),
);

const mutationResultValidator = v.union(
  v.object({ success: v.literal(true) }),
  v.object({
    success: v.literal(false),
    error: v.string(),
  }),
);

async function resolveGalleryItem(
  ctx: {
    storage: {
      getUrl: (id: Id<"_storage">) => Promise<string | null>;
    };
  },
  item: Doc<"landingPageGallery">,
) {
  const [beforeUrl, afterUrl] = await Promise.all([
    ctx.storage.getUrl(item.beforeStorageId),
    ctx.storage.getUrl(item.afterStorageId),
  ]);

  return {
    _id: item._id,
    sortOrder: item.sortOrder,
    label: item.label,
    category: item.category,
    beforeUrl,
    afterUrl,
  };
}

export const listByPageSlug = query({
  args: { slug: v.string(), includeDraft: v.optional(v.boolean()) },
  returns: v.array(galleryItemReturnValidator),
  handler: async (ctx, args) => {
    const page = await ctx.db
      .query("landingPages")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();

    if (!page) {
      return [];
    }

    if (page.status !== "published") {
      if (!args.includeDraft) {
        return [];
      }
      const identity = await requireAdmin(ctx);
      if (!identity) {
        return [];
      }
    }

    const items = await ctx.db
      .query("landingPageGallery")
      .withIndex("by_pageId", (q) => q.eq("pageId", page._id))
      .collect();

    const sorted = items.sort((a, b) => a.sortOrder - b.sortOrder);
    return await Promise.all(
      sorted.map((item) => resolveGalleryItem(ctx, item)),
    );
  },
});

export const listByPageId = query({
  args: { pageId: v.id("landingPages") },
  returns: v.array(galleryItemReturnValidator),
  handler: async (ctx, args) => {
    const identity = await requireAdmin(ctx);
    if (!identity) {
      return [];
    }

    const items = await ctx.db
      .query("landingPageGallery")
      .withIndex("by_pageId", (q) => q.eq("pageId", args.pageId))
      .collect();

    const sorted = items.sort((a, b) => a.sortOrder - b.sortOrder);
    return await Promise.all(
      sorted.map((item) => resolveGalleryItem(ctx, item)),
    );
  },
});

export const upsert = mutation({
  args: {
    pageId: v.id("landingPages"),
    itemId: v.optional(v.id("landingPageGallery")),
    sortOrder: v.number(),
    label: v.optional(v.string()),
    category: v.optional(v.string()),
    beforeStorageId: v.id("_storage"),
    afterStorageId: v.id("_storage"),
  },
  returns: upsertResultValidator,
  handler: async (ctx, args) => {
    const identity = await requireAdmin(ctx);
    if (!identity) {
      return { success: false as const, error: "Unauthorized" };
    }

    const category = args.category?.trim() || undefined;

    if (args.itemId) {
      await ctx.db.patch("landingPageGallery", args.itemId, {
        sortOrder: args.sortOrder,
        label: args.label,
        beforeStorageId: args.beforeStorageId,
        afterStorageId: args.afterStorageId,
        ...(category ? { category } : {}),
      });
      return { success: true as const, itemId: args.itemId };
    }

    const itemId = await ctx.db.insert("landingPageGallery", {
      pageId: args.pageId,
      sortOrder: args.sortOrder,
      label: args.label,
      ...(category ? { category } : {}),
      beforeStorageId: args.beforeStorageId,
      afterStorageId: args.afterStorageId,
    });

    return { success: true as const, itemId };
  },
});

export const updateItem = mutation({
  args: {
    itemId: v.id("landingPageGallery"),
    label: v.optional(v.string()),
    category: v.optional(v.string()),
  },
  returns: mutationResultValidator,
  handler: async (ctx, args) => {
    const identity = await requireAdmin(ctx);
    if (!identity) {
      return { success: false as const, error: "Unauthorized" };
    }

    const item = await ctx.db.get("landingPageGallery", args.itemId);
    if (!item) {
      return { success: false as const, error: "Gallery item not found" };
    }

    const nextLabel =
      args.label === undefined ? item.label : args.label.trim() || undefined;
    const nextCategory =
      args.category === undefined
        ? item.category
        : args.category.trim() || undefined;

    const nextValue: {
      pageId: Doc<"landingPageGallery">["pageId"];
      sortOrder: number;
      beforeStorageId: Doc<"landingPageGallery">["beforeStorageId"];
      afterStorageId: Doc<"landingPageGallery">["afterStorageId"];
      label?: string;
      category?: string;
    } = {
      pageId: item.pageId,
      sortOrder: item.sortOrder,
      beforeStorageId: item.beforeStorageId,
      afterStorageId: item.afterStorageId,
    };

    if (nextLabel) {
      nextValue.label = nextLabel;
    }
    if (nextCategory) {
      nextValue.category = nextCategory;
    }

    await ctx.db.replace("landingPageGallery", args.itemId, nextValue);

    return { success: true as const };
  },
});

export const remove = mutation({
  args: { itemId: v.id("landingPageGallery") },
  returns: mutationResultValidator,
  handler: async (ctx, args) => {
    const identity = await requireAdmin(ctx);
    if (!identity) {
      return { success: false as const, error: "Unauthorized" };
    }

    await ctx.db.delete("landingPageGallery", args.itemId);
    return { success: true as const };
  },
});
