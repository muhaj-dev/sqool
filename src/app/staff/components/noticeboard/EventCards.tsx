"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import ErrorState from "@/components/ErrorState";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { type Notice } from "@/types";
import { getStaffNotices } from "@/utils/api";
import { useAuthStore } from "@/zustand/authStore";

import { EventModal } from "./EventModal";

// Reusable skeleton for event cards
const EventCardSkeleton = () => (
  <div className="border border-[#E4E4E4] p-4 rounded-lg w-[300px] max-w-md space-y-4">
    <div className="flex justify-between items-start">
      <div className="space-y-2">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-3 w-20" />
      </div>
      <Skeleton className="h-4 w-10 rounded-sm" />
    </div>

    <Skeleton className="h-4 w-2/3" />
    <Skeleton className="h-3 w-full" />
    <Skeleton className="h-3 w-5/6" />

    <div className="mt-4 border-b-2 border-[#A7A9AD] pb-3">
      <div className="flex justify-between">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-3 w-12" />
      </div>
    </div>

    <Skeleton className="h-3 w-1/2 mt-3" />
  </div>
);

const EventCards = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { user } = useAuthStore();
  const staffId = user?._id;

  const { data, isPending, error, isError, refetch } = useQuery({
    queryKey: ["staff-more-notices", staffId],
    queryFn: async () => {
      const res = await getStaffNotices(searchTerm, 20);
      return res.result;
    },
    enabled: !!staffId && user?.role === "teacher",
    staleTime: 10 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const events: Notice[] = data || [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {isError ? (
        <ErrorState
          title="Error Fetching notice"
          description="An error occured while fetching notices"
          onRetry={refetch}
          error={error}
        />
      ) : null}
      {isPending ? (
        // Render multiple skeletons
        Array.from({ length: 6 }).map((_, i) => <EventCardSkeleton key={i} />)
      ) : events.length === 0 ? (
        <div className="col-span-full text-center py-8 text-muted-foreground">
          No notices found.
        </div>
      ) : (
        events.map((event) => (
          <Dialog key={event._id}>
            <DialogTrigger className="text-left w-full">
              <div className="border border-[#E4E4E4] p-4 hover:border-[#E5B80B] hover:shadow-lg hover:shadow-[#E5B80B]/20 rounded-lg w-[300px] max-w-md transition-all">
                <div className="flex gap-3 justify-between">
                  <div>
                    <div className="text-[#A7A9AD] text-sm flex justify-between items-center">
                      <span>
                        {event.expirationDate
                          ? new Date(event.expirationDate).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : ""}
                      </span>
                      <span>
                        {event.expirationDate
                          ? new Date(event.expirationDate).toLocaleDateString()
                          : ""}
                      </span>
                    </div>
                    <h2 className="font-bold mt-1">{event.title}</h2>
                  </div>
                  {event.isPinned ? (
                    <span className="h-fit text-[8px] bg-green-500 text-white px-1 py-[0.95px] rounded">
                      PINNED
                    </span>
                  ) : null}
                </div>
                <p className="mt-5 text-sm">{event.content}</p>
                <div className="mt-4 border-b-2 border-[#A7A9AD] pb-3">
                  <p className="flex justify-between">
                    <span>Visibility:</span>
                    <span>{event.visibility}</span>
                  </p>
                </div>
                <div className="mt-4 text-sm">
                  {event.resources && event.resources.length > 0 ? (
                    <a
                      href={event.resources[0]}
                      className="text-blue-400 underline hover:text-blue-600"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Click here to view the resource
                    </a>
                  ) : null}
                </div>
                <div className="mt-4 text-sm flex justify-between">
                  <span>
                    {event.expirationDate
                      ? new Date(event.expirationDate).toLocaleDateString()
                      : ""}
                  </span>
                </div>
              </div>
            </DialogTrigger>
            <EventModal
              event={{
                title: event.title,
                participants: [],
                time: event.expirationDate
                  ? new Date(event.expirationDate).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "",
                date: event.expirationDate
                  ? new Date(event.expirationDate).toLocaleDateString()
                  : "",
                description: event.content,
                attachments: event.resources || [],
                eventDate: event.expirationDate
                  ? new Date(event.expirationDate).toLocaleDateString()
                  : "",
                eventTime: event.expirationDate
                  ? new Date(event.expirationDate).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "",
              }}
            />
          </Dialog>
        ))
      )}
    </div>
  );
};

export default EventCards;
