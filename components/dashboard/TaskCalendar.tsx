"use client";

import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useState } from 'react';

const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export function TaskCalendar({ tasks }: { tasks: any[] }) {
  const events = tasks.map(task => ({
    id: task.id,
    title: task.title,
    start: task.dueDate ? new Date(task.dueDate) : new Date(task.createdAt),
    end: task.dueDate ? new Date(task.dueDate) : new Date(task.createdAt),
    allDay: true,
    resource: task,
  }));

  return (
    <div className="h-[600px] bg-white dark:bg-zinc-900 rounded-xl border p-4">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        views={['month', 'week', 'day']}
        defaultView="month"
        className="dark:text-zinc-300 font-sans"
      />
    </div>
  );
}
