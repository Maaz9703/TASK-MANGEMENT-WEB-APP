"use client";

import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

type Point = { name: string; [k: string]: number | string };

const card = "rounded-xl border bg-white dark:bg-zinc-900 p-6";
const axis = { stroke: "#a1a1aa", fontSize: 12, tickLine: false, axisLine: false } as const;

export function AnalyticsCharts({ trend, byStatus, byPriority }: { trend: Point[]; byStatus: Point[]; byPriority: Point[] }) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section className={`${card} lg:col-span-2`}>
        <h3 className="font-semibold mb-4">Created vs completed — last 7 days</h3>
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trend} margin={{ left: -20, right: 8 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e4e7" />
              <XAxis dataKey="name" {...axis} />
              <YAxis allowDecimals={false} {...axis} />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="created" name="Created" stroke="#6366f1" fill="#6366f1" fillOpacity={0.15} strokeWidth={2} />
              <Area type="monotone" dataKey="completed" name="Completed" stroke="#22c55e" fill="#22c55e" fillOpacity={0.15} strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className={card}>
        <h3 className="font-semibold mb-4">Tasks by status</h3>
        <div className="h-[240px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={byStatus} margin={{ left: -20, right: 8 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e4e7" />
              <XAxis dataKey="name" {...axis} />
              <YAxis allowDecimals={false} {...axis} />
              <Tooltip />
              <Bar dataKey="count" name="Tasks" fill="#6366f1" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className={card}>
        <h3 className="font-semibold mb-4">Open tasks by priority</h3>
        <div className="h-[240px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={byPriority} layout="vertical" margin={{ left: 10, right: 16 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e4e4e7" />
              <XAxis type="number" allowDecimals={false} {...axis} />
              <YAxis type="category" dataKey="name" width={70} {...axis} />
              <Tooltip />
              <Bar dataKey="count" name="Open tasks" fill="#f97316" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}
