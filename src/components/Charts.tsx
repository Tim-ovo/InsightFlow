import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';

export function TrendChart({ data }: { data: any[] }) {
  // Auto detect if it's channel data or overview data
  return (
    <div className="h-72 w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
          <XAxis dataKey="date" stroke="#6B7280" fontSize={12} tickMargin={10} />
          <YAxis stroke="#6B7280" fontSize={12} tickFormatter={(val) => `${val / 1000}k`} />
          <RechartsTooltip 
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
          <Legend wrapperStyle={{ paddingTop: '20px' }} />
          <Line type="monotone" name="GMV" dataKey="gmv" stroke="#6366f1" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
          <Line type="monotone" name="利润" dataKey="profit" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function ChannelBarChart({ data }: { data: any[] }) {
  // Aggregate channel data
  const aggregated = data.reduce((acc, curr) => {
    if (!acc[curr.channel]) {
      acc[curr.channel] = { channel: curr.channel, cost: 0, profit: 0, uv: 0, gmv: 0 };
    }
    acc[curr.channel].cost += curr.cost;
    acc[curr.channel].profit += curr.profit;
    acc[curr.channel].uv += curr.uv;
    acc[curr.channel].gmv += curr.gmv;
    return acc;
  }, {});
  
  const chartData = Object.values(aggregated);

  return (
    <div className="h-72 w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
          <XAxis dataKey="channel" stroke="#6B7280" fontSize={12} tickMargin={10} />
          <YAxis stroke="#6B7280" fontSize={12} tickFormatter={(val) => `${val / 1000}k`} />
          <RechartsTooltip 
            cursor={{ fill: 'transparent' }}
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
          <Legend wrapperStyle={{ paddingTop: '20px' }} />
          <Bar name="投入成本" dataKey="cost" fill="#f43f5e" radius={[4, 4, 0, 0]} barSize={40} />
          <Bar name="产出利润" dataKey="profit" fill="#10b981" radius={[4, 4, 0, 0]} barSize={40} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
