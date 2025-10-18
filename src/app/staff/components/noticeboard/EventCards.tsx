import React, { useEffect, useState } from "react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { EventModal } from "./EventModal";
import { getParentNotices } from "@/utils/api";

const EventCards = () => {
  const [searchTerm, setSearchTerm] = useState("");
const [events, setEvents] = useState<any[]>([]);
const [loading, setLoading] = useState(false);

  useEffect(() => {
  const fetchNotices = async () => {
    setLoading(true);
    try {
      const res = await getParentNotices(searchTerm, 20);
      setEvents(res.data.result || []);
    } catch {
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };
  fetchNotices();
}, [searchTerm]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {loading ? (
        <div className="col-span-full text-center py-8">Loading...</div>
      ) : events.length === 0 ? (
        <div className="col-span-full text-center py-8">No notices found.</div>
      ) : (
        events.map((event) => (
          <Dialog key={event._id}>
            <DialogTrigger className="text-left w-full">
              <div className="border border-[#E4E4E4] p-4 hover:border-[#E5B80B] hover:shadow-lg hover:shadow-[#E5B80B] rounded-lg w-[300px] max-w-md">
                <div className="flex gap-3 justify-between">
                  <div>
                    <div className="text-[#A7A9AD] text-sm flex justify-between items-center">
                      <span>
                        {event.expirationDate
                          ? new Date(event.expirationDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                          : ""}
                      </span>
                      <span>
                        {event.expirationDate
                          ? new Date(event.expirationDate).toLocaleDateString()
                          : ""}
                      </span>
                    </div>
                    <h2 className="font-bold">{event.title}</h2>
                  </div>
                  {event.isPinned && (
                    <span className="h-fit text-[8px] bg-green-500 text-white px-1 py-[0.95px] rounded">
                      PINNED
                    </span>
                  )}
                </div>
                <p className="mt-5 text-sm">{event.content}</p>
                <div className="mt-4 border-b-2 border-[#A7A9AD] pb-3">
                  <p className="flex justify-between">
                    <span>Visibility:</span>
                    <span>{event.visibility}</span>
                  </p>
                </div>
                <div className="mt-4 text-sm">
              {event.resources && event.resources.length > 0 && (
  <a
    href={event.resources[0]}
    className="text-blue-400 underline hover:text-blue-600"
    target="_blank"
    rel="noopener noreferrer"
  >
    Click here to view the resource
  </a>
)}
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
                  ? new Date(event.expirationDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
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
                  ? new Date(event.expirationDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
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