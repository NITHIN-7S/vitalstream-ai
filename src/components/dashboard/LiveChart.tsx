import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";
import { Activity } from "lucide-react";

interface LiveChartProps {
  title: string;
  dataKey: string;
  color: string;
  unit: string;
  minValue?: number;
  maxValue?: number;
  warningThreshold?: number;
  criticalThreshold?: number;
  type?: "line" | "area";
}

const generateDataPoint = (baseValue: number, variance: number) => {
  return baseValue + (Math.random() - 0.5) * variance * 2;
};

const LiveChart = ({
  title,
  dataKey,
  color,
  unit,
  minValue = 0,
  maxValue = 100,
  warningThreshold,
  criticalThreshold,
  type = "area",
}: LiveChartProps) => {
  const [data, setData] = useState<Array<{ time: string; [key: string]: number | string }>>([]);
  const [isLive, setIsLive] = useState(true);

  useEffect(() => {
    const initialData = Array.from({ length: 20 }, (_, i) => ({
      time: `${i}s`,
      [dataKey]: generateDataPoint((maxValue + minValue) / 2, (maxValue - minValue) / 6),
    }));
    setData(initialData);

    const interval = setInterval(() => {
      setData((prev) => {
        const newData = [...prev.slice(1)];
        newData.push({
          time: `${Date.now() % 100}s`,
          [dataKey]: generateDataPoint((maxValue + minValue) / 2, (maxValue - minValue) / 6),
        });
        return newData;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [dataKey, minValue, maxValue]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass rounded-lg p-3 shadow-elevated border border-border">
          <p className="text-sm font-semibold text-foreground">
            {payload[0].value.toFixed(1)} {unit}
          </p>
        </div>
      );
    }
    return null;
  };

  const latestValue = data.length > 0 ? Number(data[data.length - 1][dataKey]) : 0;
  const prevValue = data.length > 1 ? Number(data[data.length - 2][dataKey]) : latestValue;
  const trend = latestValue > prevValue ? "↑" : latestValue < prevValue ? "↓" : "→";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-xl p-6 shadow-card relative overflow-hidden"
    >
      {/* Subtle animated background pulse */}
      <motion.div
        className="absolute inset-0 rounded-xl"
        style={{ background: `radial-gradient(ellipse at 80% 20%, ${color}08, transparent 70%)` }}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-foreground">{title}</h3>
            <motion.div
              animate={{ scale: [1, 1.3, 1], opacity: [1, 0.6, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="flex items-center gap-1"
            >
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
              <span className="text-[10px] font-medium text-muted-foreground">LIVE</span>
            </motion.div>
          </div>
          <div className="flex items-center gap-2">
            <AnimatePresence mode="popLayout">
              <motion.span
                key={latestValue.toFixed(1)}
                initial={{ y: -10, opacity: 0, scale: 0.9 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: 10, opacity: 0, scale: 0.9 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="text-2xl font-bold tabular-nums"
                style={{ color }}
              >
                {latestValue.toFixed(1)}
              </motion.span>
            </AnimatePresence>
            <span className="text-sm text-muted-foreground">{unit}</span>
            <motion.span
              key={trend}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs font-bold"
              style={{ color }}
            >
              {trend}
            </motion.span>
          </div>
        </div>

        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            {type === "area" ? (
              <AreaChart data={data}>
                <defs>
                  <linearGradient id={`gradient-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                    <stop offset="50%" stopColor={color} stopOpacity={0.1} />
                    <stop offset="95%" stopColor={color} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis domain={[minValue, maxValue]} stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey={dataKey}
                  stroke={color}
                  strokeWidth={2.5}
                  fill={`url(#gradient-${dataKey})`}
                  animationDuration={300}
                  dot={false}
                  activeDot={{ r: 4, stroke: color, strokeWidth: 2, fill: "hsl(var(--background))" }}
                />
              </AreaChart>
            ) : (
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis domain={[minValue, maxValue]} stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey={dataKey}
                  stroke={color}
                  strokeWidth={2.5}
                  dot={false}
                  animationDuration={300}
                  activeDot={{ r: 4, stroke: color, strokeWidth: 2, fill: "hsl(var(--background))" }}
                />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  );
};

export default LiveChart;
