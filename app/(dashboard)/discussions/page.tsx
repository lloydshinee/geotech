import { getDiscussions } from "@/actions/discussion.action";
import { SiteHeader } from "@/components/site-header";
import DiscussionCard from "./discussion-card";

export default async function DiscussionsPage() {

  const discussions = await getDiscussions()

  return (
    <main>
      <SiteHeader title="Discussions" />
      <section className="p-4 space-y-4">
        {discussions?.map((discussion) => (
          <DiscussionCard discussion={discussion} key={discussion.id} />
        ))}
      </section>
    </main>
  );
}
