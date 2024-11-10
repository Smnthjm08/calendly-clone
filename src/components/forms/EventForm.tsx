"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { eventFormSchema } from "@/schema/events";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import Link from "next/link";
import { Textarea } from "../ui/textarea";
import { Switch } from "../ui/switch";
import { createEvent } from "@/server/actions/events";

export function EventForm() {
  const form = useForm<z.infer<typeof eventFormSchema>>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      isActive: true,
      durationInMinutes: 30,
    },
  });

  async function onSubmit(values: z.infer<typeof eventFormSchema>) {
    const data = await createEvent(values);

    if (data?.error) {
      form.setError("root", {
        message: "There was an error saving your event",
      });
    }
    console.log(values);
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex gap-6 flex-col"
      >
        {form.formState.errors.root && (
          <div className="text-destructive text-sm">
            {form.formState.errors.root.message}
          </div>
        )}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Event Name</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value || ""} />
                </FormControl>
                <FormDescription>
                  The name users will see when booking
                </FormDescription>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <FormField
          control={form.control}
          name="durationInMinutes"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Duration</FormLabel>
                <FormControl>
                  <Input type="number" {...field}  value={field.value || ""}/>
                </FormControl>
                <FormDescription>In minutes</FormDescription>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea {...field} className="resize-none h-32" value={field.value || ""} />
                </FormControl>
                <FormDescription>
                  Optional Description of the events
                </FormDescription>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <FormField
          control={form.control}
          name="isActive"
          render={({ field }) => {
            return (
              <FormItem>
                <div className="items-center flex gap-2">
                  <FormControl>
                    <Switch checked={field.value} onChange={field.onChange} />
                  </FormControl>
                  <FormLabel>Active</FormLabel>
                </div>
                <FormDescription>
                  Inactive events will not be visible for users to book
                </FormDescription>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <div className="flex gap-2 justify-end">
          <Button type="button" asChild variant={"outline"}>
            <Link href={"/events"}>Cancel</Link>
          </Button>
          <Button type="submit">Save </Button>
        </div>
      </form>
    </Form>
  );
}
