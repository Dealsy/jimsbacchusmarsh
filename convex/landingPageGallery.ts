import { v } from "convex/values";

import { mutation, query } from "./_generated/server";
import { requireAdmin } from "./lib/adminAuth";

async function resolveGalleryItem(
  ctx: {
    storage: {
      getUrl: (
        id: import("./_generated/dataModel").Id<"_storage">,
      ) => Promise<string | null>;
    };
  },
  item: {
    _id: import("./_generated/dataModel").Id<"landingPageGallery">;
    pageId: import("./_generated/dataModel").Id<"landingPages">;
    sortOrder: number;
    label?: string;
    beforeStorageId: import("./_generated/dataModel").Id<"_storage">;
    afterStorageId: import("./_generated/dataModel").Id<"_storage">;
  },
) {
  const [beforeUrl, afterUrl] = await Promise.all([
    ctx.storage.getUrl(item.beforeStorageId),
    ctx.storage.getUrl(item.afterStorageId),
  ]);

  return {
    _id: item._id,
    sortOrder: item.sortOrder,
    label: item.label,
    beforeUrl,
    afterUrl,
  };
}

export const listByPageSlug = query({
  args: { slug: v.string(), includeDraft: v.optional(v.boolean()) },
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
    beforeStorageId: v.id("_storage"),
    afterStorageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    const identity = await requireAdmin(ctx);
    if (!identity) {
      return { success: false as const, error: "Unauthorized" };
    }

    if (args.itemId) {
      await ctx.db.patch(args.itemId, {
        sortOrder: args.sortOrder,
        label: args.label,
        beforeStorageId: args.beforeStorageId,
        afterStorageId: args.afterStorageId,
      });
      return { success: true as const, itemId: args.itemId };
    }

    const itemId = await ctx.db.insert("landingPageGallery", {
      pageId: args.pageId,
      sortOrder: args.sortOrder,
      label: args.label,
      beforeStorageId: args.beforeStorageId,
      afterStorageId: args.afterStorageId,
    });

    return { success: true as const, itemId };
  },
});

export const remove = mutation({
  args: { itemId: v.id("landingPageGallery") },
  handler: async (ctx, args) => {
    const identity = await requireAdmin(ctx);
    if (!identity) {
      return { success: false as const, error: "Unauthorized" };
    }

    await ctx.db.delete(args.itemId);
    return { success: true as const };
  },
});
