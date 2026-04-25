"use client";

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Mon', completed: 4, new: 6 },
  { name: 'Tue', completed: 7, new: 3 },
  { name: 'Wed', completed: 5, new: 8 },
  { name: 'Thu', completed: 12, new: 4 },
  { name: 'Fri', completed: 9, new: 5 },
  { name: 'Sat', completed: 2, new: 1 },
  { name: 'Sun', completed: 3, new: 0 },
];

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">Deep insights into your team's performance and project progress.</p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Completion Rate", value: "84%", change: "+12%" },
          { label: "Active Tasks", value: "24", change: "-2" },
          { label: "Team Velocity", value: "32 pts", change: "+5 pts" },
          { label: "Overdue", value: "3", change: "0" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl border bg-white dark:bg-zinc-900 p-6">
            <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
            <div className="flex items-baseline gap-2 mt-2">
              <h4 className="text-2xl font-bold">{stat.value}</h4>
              <span className="text-xs font-medium text-green-500">{stat.change}</span>
            </div>
          </div>
        ))}
      </div>
      
      <div className="rounded-xl border bg-white dark:bg-zinc-900 p-6 space-y-4">
        <h3 className="font-semibold text-lg">Task Velocity</h3>
        <div className="h-[300px] w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorNew" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ec4899" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#ec4899" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" opacity={0.2} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'rgba(24, 24, 27, 0.9)', borderColor: '#3f3f46', borderRadius: '8px' }}
                itemStyle={{ color: '#fff' }}
              />
              <Area type="monotone" dataKey="completed" stroke="#4f46e5" fillOpacity={1} fill="url(#colorCompleted)" strokeWidth={2} name="Completed Tasks" />
              <Area type="monotone" dataKey="new" stroke="#ec4899" fillOpacity={1} fill="url(#colorNew)" strokeWidth={2} name="New Tasks" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
