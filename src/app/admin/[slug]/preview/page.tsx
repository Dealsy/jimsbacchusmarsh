import { PreviewPageClient } from "@/components/admin/preview-page-client";

type PreviewPageProps = {
  readonly params: Promise<{ slug: string }>;
};

export default async function PreviewPage({ params }: PreviewPageProps) {
  const { slug } = await params;
  return <PreviewPageClient slug={slug} />;
}
