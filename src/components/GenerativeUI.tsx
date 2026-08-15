"use client";

import React from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, ScatterChart, Scatter, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';

// Lumina Intelligence specific colors for charts
const COLORS = ['#004ac6', '#565e74', '#ba1a1a', '#2563eb', '#525657', '#0053db'];

export type UIComponentNode = {
  type: string;
  props?: Record<string, any>;
  children?: UIComponentNode[];
};

interface GenerativeUIProps {
  schema: UIComponentNode;
  data?: any[]; // Full dataset passed to charts automatically
}

const componentDictionary: Record<string, React.FC<any>> = {
  Container: ({ direction = 'vertical', gap = '1.5rem', children }) => (
    <div className={direction === 'vertical' ? 'flex flex-col' : 'flex flex-row'} style={{ gap }}>
      {children}
    </div>
  ),
  Text: ({ content, variant = 'p' }) => {
    if (variant === 'h1') return <h1 className="font-display-lg text-display-lg font-bold text-primary">{content}</h1>;
    if (variant === 'h2') return <h2 className="font-headline-lg text-headline-lg font-semibold text-on-surface">{content}</h2>;
    if (variant === 'h3') return <h3 className="font-headline-md text-headline-md font-semibold text-on-surface">{content}</h3>;
    return <p className="font-body-md text-body-md text-on-surface-variant">{content}</p>;
  },
  Card: ({ children }) => (
    <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-md shadow-sm">
      {children}
    </div>
  ),
  MetricCard: ({ title, value }) => (
    <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-md flex flex-col justify-between hover:shadow-md transition-shadow">
      <span className="font-label-md text-label-md text-on-surface-variant mb-sm">{title}</span>
      <div className="font-headline-lg text-headline-lg font-bold text-on-surface">{value}</div>
    </div>
  ),
  BarChart: ({ data, xAxisKey, yAxisKeys = [] }) => (
    <div className="w-full h-[300px] mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#c3c6d7" vertical={false} />
          <XAxis dataKey={xAxisKey} stroke="#737686" tick={{ fill: '#434655', fontSize: 12 }} />
          <YAxis stroke="#737686" tick={{ fill: '#434655', fontSize: 12 }} />
          <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#c3c6d7', borderRadius: '8px' }} itemStyle={{ color: '#0b1c30' }} cursor={{ fill: '#eff4ff' }} />
          <Legend wrapperStyle={{ paddingTop: '10px' }} />
          {yAxisKeys.map((key: string, i: number) => (
            <Bar key={key} dataKey={key} fill={COLORS[i % COLORS.length]} radius={[4, 4, 0, 0]} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  ),
  LineChart: ({ data, xAxisKey, yAxisKeys = [] }) => (
    <div className="w-full h-[300px] mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#c3c6d7" vertical={false} />
          <XAxis dataKey={xAxisKey} stroke="#737686" tick={{ fill: '#434655', fontSize: 12 }} />
          <YAxis stroke="#737686" tick={{ fill: '#434655', fontSize: 12 }} />
          <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#c3c6d7', borderRadius: '8px' }} itemStyle={{ color: '#0b1c30' }} />
          <Legend wrapperStyle={{ paddingTop: '10px' }} />
          {yAxisKeys.map((key: string, i: number) => (
            <Line key={key} type="monotone" dataKey={key} stroke={COLORS[i % COLORS.length]} strokeWidth={3} dot={{ r: 4, strokeWidth: 2, fill: '#fff' }} activeDot={{ r: 6, strokeWidth: 0, fill: '#004ac6' }} />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  ),
  PieChart: ({ data, nameKey, dataKey }) => (
    <div className="w-full h-[300px] mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey={dataKey} nameKey={nameKey}>
            {data?.map((entry: any, index: number) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="#ffffff" strokeWidth={2} />
            ))}
          </Pie>
          <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#c3c6d7', borderRadius: '8px' }} itemStyle={{ color: '#0b1c30' }} />
          <Legend wrapperStyle={{ paddingTop: '20px' }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  ),
  AreaChart: ({ data, xAxisKey, yAxisKeys = [] }) => (
    <div className="w-full h-[300px] mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#c3c6d7" vertical={false} />
          <XAxis dataKey={xAxisKey} stroke="#737686" tick={{ fill: '#434655', fontSize: 12 }} />
          <YAxis stroke="#737686" tick={{ fill: '#434655', fontSize: 12 }} />
          <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#c3c6d7', borderRadius: '8px' }} itemStyle={{ color: '#0b1c30' }} />
          <Legend wrapperStyle={{ paddingTop: '10px' }} />
          {yAxisKeys.map((key: string, i: number) => (
            <Area key={key} type="monotone" dataKey={key} stroke={COLORS[i % COLORS.length]} fill={COLORS[i % COLORS.length]} fillOpacity={0.3} />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  ),
  ScatterChart: ({ data, xAxisKey, yAxisKey }) => (
    <div className="w-full h-[300px] mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#c3c6d7" />
          <XAxis type="number" dataKey={xAxisKey} stroke="#737686" tick={{ fill: '#434655', fontSize: 12 }} name={xAxisKey} />
          <YAxis type="number" dataKey={yAxisKey} stroke="#737686" tick={{ fill: '#434655', fontSize: 12 }} name={yAxisKey} />
          <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: '#ffffff', borderColor: '#c3c6d7', borderRadius: '8px' }} itemStyle={{ color: '#0b1c30' }} />
          <Legend wrapperStyle={{ paddingTop: '10px' }} />
          <Scatter name="Data" data={data} fill={COLORS[0]} />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  ),
  RadarChart: ({ data, angleAxisKey, radarAxisKeys = [] }) => (
    <div className="w-full h-[350px] mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid stroke="#c3c6d7" />
          <PolarAngleAxis dataKey={angleAxisKey} tick={{ fill: '#434655', fontSize: 12 }} />
          <PolarRadiusAxis stroke="#737686" />
          <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#c3c6d7', borderRadius: '8px' }} itemStyle={{ color: '#0b1c30' }} />
          <Legend wrapperStyle={{ paddingTop: '10px' }} />
          {radarAxisKeys.map((key: string, i: number) => (
            <Radar key={key} name={key} dataKey={key} stroke={COLORS[i % COLORS.length]} fill={COLORS[i % COLORS.length]} fillOpacity={0.6} />
          ))}
        </RadarChart>
      </ResponsiveContainer>
    </div>
  ),
  DataGrid: ({ data, columns }) => (
    <div className="overflow-x-auto overflow-y-auto max-h-[400px] rounded-lg border border-outline-variant bg-surface-container-lowest mt-4 relative">
      <table className="w-full border-collapse">
        <thead className="bg-surface-container-low sticky top-0 z-10 shadow-sm">
          <tr>
            {columns?.map((col: string, i: number) => (
              <th key={i} className="p-3 text-left font-label-md text-label-md text-on-surface-variant border-b border-outline-variant">{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data?.map((row: any, i: number) => (
            <tr key={i} className="border-b border-outline-variant last:border-0 hover:bg-surface-container-lowest transition-colors">
              {columns?.map((col: string, j: number) => (
                <td key={j} className="p-3 font-body-md text-body-sm text-on-surface whitespace-nowrap">{row[col]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
};

export default function GenerativeUI({ schema, data }: GenerativeUIProps) {
  if (!schema) return null;

  const Component = componentDictionary[schema.type];
  if (!Component) {
    console.warn(`Unknown Generative UI component type: ${schema.type}`);
    return null;
  }

  // Inject full data implicitly into data-aware components
  const propsWithData = { ...schema.props };
  if (['BarChart', 'LineChart', 'PieChart', 'DataGrid'].includes(schema.type)) {
    propsWithData.data = data;
  }

  return (
    <Component {...propsWithData}>
      {schema.children?.map((child, index) => (
        <GenerativeUI key={index} schema={child} data={data} />
      ))}
    </Component>
  );
}
