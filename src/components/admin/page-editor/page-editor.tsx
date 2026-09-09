"use client";

import { api } from "convex/_generated/api";
import { useQuery } from "convex/react";
import Link from "next/link";
import { AdminPageEditorSkeleton } from "@/components/admin/admin-skeletons";
import { PageEditorLoaded } from "@/components/admin/page-editor/page-editor-loaded";
import { pageToEditorState } from "@/lib/page-to-editor-state";

type PageEditorProps = {
  readonly slug: string;
};

export function PageEditor({ slug }: PageEditorProps) {
  const page = useQuery(api.landingPages.getBySlug, { slug });

  if (page === undefined) {
    return <AdminPageEditorSkeleton />;
  }

  if (page === null) {
    return (
      <p className="text-muted-foreground">
        Page not found.{" "}
        <Link href="/admin" className="underline">
          Back to admin
        </Link>
      </p>
    );
  }

  return (
    <PageEditorLoaded
      key={page._id}
      slug={slug}
      page={page}
      initialState={pageToEditorState(page)}
    />
  );
}
