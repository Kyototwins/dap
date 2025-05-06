
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { X } from "lucide-react";
import { Event, EventParticipationMap } from "@/types/events";

interface EventCalendarViewProps {
  events: Event[];
  participations: EventParticipationMap;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EventCalendarView({ events, participations, open, onOpenChange }: EventCalendarViewProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  
  // Get participating events
  const participatingEvents = events.filter(event => !!participations[event.id]);
  
  // Group events by date
  const eventsByDate: Record<string, Event[]> = {};
  participatingEvents.forEach(event => {
    const dateKey = new Date(event.date).toDateString();
    if (!eventsByDate[dateKey]) {
      eventsByDate[dateKey] = [];
    }
    eventsByDate[dateKey].push(event);
  });
  
  // Get events for selected date
  const selectedDateKey = selectedDate?.toDateString();
  const eventsForSelectedDate = selectedDateKey ? eventsByDate[selectedDateKey] || [] : [];

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('ja-JP', {
      month: 'numeric',
      day: 'numeric',
    }).format(new Date(dateString));
  };

  // Format time range for display
  const formatTimeRange = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ja-JP', {
      hour: 'numeric',
      minute: 'numeric'
    }).format(date);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>あなたのスケジュール</DialogTitle>
          <DialogDescription>
            参加予定のイベント
          </DialogDescription>
          <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none">
            <X className="h-4 w-4" />
            <span className="sr-only">閉じる</span>
          </DialogClose>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border rounded-lg p-3">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="p-3 pointer-events-auto"
              modifiers={{
                hasEvent: (date) => {
                  const dateKey = date.toDateString();
                  return !!eventsByDate[dateKey];
                },
              }}
              modifiersStyles={{
                hasEvent: {
                  backgroundColor: "#f3e8ff",
                  borderRadius: "100%",
                  color: "#7f1184",
                },
              }}
            />
          </div>
          
          <div>
            <h3 className="font-medium mb-2">
              {selectedDate ? formatDate(selectedDate.toISOString()) : "日付を選択"}
            </h3>
            
            {eventsForSelectedDate.length === 0 ? (
              <p className="text-sm text-gray-500">この日のイベントはありません</p>
            ) : (
              <div className="space-y-3 max-h-[300px] overflow-y-auto">
                {eventsForSelectedDate.map((event) => (
                  <div key={event.id} className="border rounded-lg p-3 bg-white">
                    <h4 className="font-medium">{event.title}</h4>
                    <p className="text-sm text-gray-600">{formatTimeRange(event.date)}</p>
                    <p className="text-sm text-gray-600">{event.location}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
