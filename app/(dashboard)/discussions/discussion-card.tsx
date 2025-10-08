import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { DiscussionWithZone } from "@/lib/types";
import Link from "next/link";

export default function DiscussionCard({
  discussion,
}: {
  discussion: DiscussionWithZone;
}) {
  return (
    <Card className="w-full">
      <CardHeader>
        <h2 className="text-bold">{discussion.content}</h2>
      </CardHeader>
      <CardContent>
        <p>Affected: {discussion.zone.affectedUserLocations.length}</p>
      </CardContent>
      <CardFooter>
        <Button variant="link" size="sm">
          <Link href={`/discussions/${discussion.id}`}>View Discussion</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
