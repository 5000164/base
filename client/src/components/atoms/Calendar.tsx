import React from "react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import { EventApi } from "@fullcalendar/common";

const CalendarGenerator = (slotMinTime: string, slotMaxTime: string) =>
  React.memo(
    React.forwardRef(
      (
        {
          events,
          mouseEnter,
          mouseLeave,
        }: {
          events: { title: string; start: string; end: string }[];
          mouseEnter: (event: EventApi, el: HTMLElement) => void;
          mouseLeave: () => void;
        },
        ref: any
      ) => {
        return (
          <FullCalendar
            ref={ref}
            plugins={[timeGridPlugin]}
            initialView="timeGridDay"
            height={1003}
            headerToolbar={false}
            allDaySlot={false}
            slotDuration="00:20:00"
            slotLabelFormat={{
              hour: "numeric",
              minute: "2-digit",
              hour12: false,
              omitZeroMinute: false,
            }}
            slotMinTime={slotMinTime}
            slotMaxTime={slotMaxTime}
            nowIndicator={true}
            eventMouseEnter={({ event, el }) => {
              mouseEnter(event, el);
            }}
            eventMouseLeave={mouseLeave}
            events={events}
          />
        );
      }
    )
  );

export const Am = CalendarGenerator("00:00:00", "12:00:00");
export const Pm = CalendarGenerator("12:00:00", "24:00:00");
