import { SiteHeader } from "@/components/site-header";

export default async function DiscussionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <main>
      <SiteHeader title={`Discussion ${id}`} />
    </main>
  );
}
