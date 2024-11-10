"use server";

import { db } from "@/drizzle/db";
import { EventTable } from "@/drizzle/schema";
import { eventFormSchema } from "@/schema/events";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";

export async function createEvent(unsafeData: z.infer<typeof eventFormSchema>): Promise<{ error: boolean } | { redirectTo: string }> {
  const { userId } = await auth();
  const { success, data } = eventFormSchema.safeParse(unsafeData);

  if (!success || userId === null) {
    return { error: true };
  }

  try {
    await db.insert(EventTable).values({ ...data, clerkUserId: userId });
    return { redirectTo: "/events" };
  } catch (error) {
    console.error("Error creating event:", error);
    return { error: true };
  }
}
