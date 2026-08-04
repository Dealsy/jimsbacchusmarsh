import { PageEditor } from "@/components/admin/page-editor";

type AdminSlugPageProps = {
  readonly params: Promise<{ slug: string }>;
};

export default async function AdminSlugPage({ params }: AdminSlugPageProps) {
  const { slug } = await params;
  return <PageEditor slug={slug} />;
}
