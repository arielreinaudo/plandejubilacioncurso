import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { YearProjectionPoint, formatUSD } from '../logic/financialMath.ts';

interface RetirementChartProps {
  data: YearProjectionPoint[];
  compararOro: boolean;
}

// Custom tooltip con formato financiero en español y USD
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 text-white p-3.5 rounded-lg shadow-lg border border-slate-700 text-xs font-sans">
        <p className="font-bold text-sky-300 mb-2">
          {label === 0 ? 'Año 0 (Punto inicial)' : `Año ${label}`}
        </p>
        <div className="space-y-1.5 font-mono-numbers">
          {payload.map((entry: any, index: number) => (
            <div key={`item-${index}`} className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-1.5 text-slate-300">
                <span
                  className="w-2.5 h-2.5 rounded-full inline-block"
                  style={{ backgroundColor: entry.color }}
                />
                {entry.name}:
              </span>
              <span className="font-bold text-white">
                USD {formatUSD(entry.value)}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export const RetirementChart: React.FC<RetirementChartProps> = ({
  data,
  compararOro,
}) => {
  // Formateador para el eje Y (ej: USD 250k o $450k)
  const formatYAxis = (val: number) => {
    if (val >= 1000000) {
      return `$${(val / 1000000).toFixed(1).replace('.0', '')}M`;
    }
    if (val >= 1000) {
      return `$${(val / 1000).toFixed(0)}k`;
    }
    return `$${val}`;
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-xs">
      <div className="mb-4">
        <h3 className="text-xl font-bold text-slate-900 tracking-tight">
          Mi patrimonio frente a mi objetivo
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Proyección año a año de tu capital acumulado frente a la meta ajustada por inflación.
        </p>
      </div>

      <div className="w-full h-80 sm:h-96 mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 10, right: 20, left: 10, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
            <XAxis
              dataKey="ano"
              tickLine={false}
              axisLine={{ stroke: '#cbd5e1' }}
              tick={{ fill: '#64748b', fontSize: 12 }}
              tickFormatter={(v) => `Año ${v}`}
            />
            <YAxis
              tickLine={false}
              axisLine={{ stroke: '#cbd5e1' }}
              tick={{ fill: '#64748b', fontSize: 12 }}
              tickFormatter={formatYAxis}
              width={65}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="top"
              height={36}
              iconType="circle"
              wrapperStyle={{ fontSize: '13px', paddingTop: '4px' }}
            />
            <Line
              type="monotone"
              dataKey="patrimonio"
              name="Patrimonio proyectado"
              stroke="#0284c7"
              strokeWidth={3}
              dot={{ r: 3, fill: '#0284c7', strokeWidth: 1, stroke: '#ffffff' }}
              activeDot={{ r: 6, fill: '#0369a1' }}
            />
            <Line
              type="monotone"
              dataKey="metaInflacion"
              name="Meta ajustada por inflación"
              stroke="#f59e0b"
              strokeWidth={2.5}
              strokeDasharray="5 5"
              dot={{ r: 2.5, fill: '#f59e0b', strokeWidth: 1, stroke: '#ffffff' }}
              activeDot={{ r: 5, fill: '#d97706' }}
            />
            {compararOro && (
              <Line
                type="monotone"
                dataKey="metaOro"
                name="Referencia en oro"
                stroke="#eab308"
                strokeWidth={1.5}
                strokeDasharray="2 2"
                dot={false}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <p className="italic">
          Una línea muestra cómo podría crecer tu patrimonio. La otra indica cuánto capital necesitarías para mantener tu objetivo frente a la inflación.
        </p>
      </div>
    </div>
  );
};
