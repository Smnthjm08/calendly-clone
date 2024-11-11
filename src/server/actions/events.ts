"use server";

import { db } from "@/drizzle/db";
import { EventTable } from "@/drizzle/schema";
import { eventFormSchema } from "@/schema/events";
import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { z } from "zod";

export async function createEvent(
  unsafeData: z.infer<typeof eventFormSchema>
): Promise<{ error: boolean } | { redirectTo: string }> {
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

export async function updateEvent(
  id: string,
  unsafeData: z.infer<typeof eventFormSchema>
): Promise<{ error: boolean } | undefined> {
  const { userId } = await auth();
  const { success, data } = eventFormSchema.safeParse(unsafeData);

  if (!success || userId === null) {
    return { error: true };
  }

  try {
    const { rowCount } = await db
      .update(EventTable)
      .set({ ...data })
      .where(and(eq(EventTable.id, id), eq(EventTable.clerkUserId, userId)));

    if (rowCount === 0) {
      return { error: true };
    }
  } catch (error) {
    console.error("Error creating event:", error);
    return { error: true };
  }
}

export async function deleteEvent(
  id: string
): Promise<{ error: boolean } | undefined> {
  const { userId } = await auth();
   const test = redirect("/events");

  if (userId === null) {
    return { error: true };
  }

  try {
    const { rowCount } = await db
      .delete(EventTable)
      .where(and(eq(EventTable.id, id), eq(EventTable.clerkUserId, userId)));

    if (rowCount === 0) {
      return { error: true };
    }
    return test

  } catch (error) {
    console.error("Error creating event:", error);
    return { error: true };
  }
}
