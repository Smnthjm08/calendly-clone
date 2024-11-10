/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button } from "@/components/ui/button";
import { db } from "@/drizzle/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { CalendarPlus, CalendarRange } from "lucide-react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatEventDescription } from "@/lib/formatter";
import { CopyEventButton } from "@/components/CopyEventButton";

export default async function EventsPage() {
  const { userId } = await auth();
  console.log(userId);

  if (userId == null) {
    return redirect("/sign-in");
  }

  const events = await db.query.EventTable.findMany({
    where: ({ clerkUserId }, { eq }) => eq(clerkUserId, userId),
    orderBy: ({ createdAt }, { desc }) => desc(createdAt),
  });

  return (
    <>
      <div className="flex gap-4 items-baseline">
        <h1 className="teext-3xl lg:text-4xl xl:text-5xl font-semibold mb-6">
          Events
        </h1>
        <Button asChild>
          <Link href={"/events/new"}>
            <CalendarPlus className="mr-4 size-6" /> New Event
          </Link>
        </Button>
      </div>
      {events.length > 0 ? (
        <div className="grid gap-4 grid-cols-[repeat(aut0-fill,minmax(400px,1fr))]">
          {events.map((event) => (
            <EventCard key={event.id} {...event} />
          ))}
        </div>
      ) : (
        // <h1>Evenets</h1>
        <div className="flex flex-col items-center gap-4">
          <CalendarRange className="size-16 mx-auto" /> You do not have any
          eventes yet. Create your first event to get started!
          <Button size={"lg"} className="text-lg" asChild>
            <Link href={"/events/new"}>
              <CalendarPlus className="mr-4 size-6" /> New Event
            </Link>
          </Button>
        </div>
      )}
    </>
  );
}

type EventCardProps = {
  id: string;
  isActive: boolean;
  name: string;
  description: string | null;
  durationInMinutes: number;
  clerkUserId: string;
};

function EventCard({
  id,
  isActive,
  name,
  description,
  durationInMinutes,
  clerkUserId,
}: EventCardProps) {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <CardDescription>
          {formatEventDescription(durationInMinutes)}
        </CardDescription>
      </CardHeader>
      {description && <CardContent>{description}</CardContent>}
      <CardFooter className="flex justify-end gap-2 mt-auto">
        <CopyEventButton
          variant="outline"
          eventId={id}
          clerkUserId={clerkUserId}
        />
        <Button asChild>
          <Link href={`/events/${id}/edit`}>Edit</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}