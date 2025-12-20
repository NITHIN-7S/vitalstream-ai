import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";

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

  useEffect(() => {
    // Initialize with some data
    const initialData = Array.from({ length: 20 }, (_, i) => ({
      time: `${i}s`,
      [dataKey]: generateDataPoint((maxValue + minValue) / 2, (maxValue - minValue) / 6),
    }));
    setData(initialData);

    // Update data every second
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
        <div className="glass rounded-lg p-3 shadow-elevated">
          <p className="text-sm font-semibold text-foreground">
            {payload[0].value.toFixed(1)} {unit}
          </p>
        </div>
      );
    }
    return null;
  };

  const latestValue = data.length > 0 ? Number(data[data.length - 1][dataKey]) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-xl p-6 shadow-card"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-foreground">{title}</h3>
        <div className="flex items-center gap-2">
          <motion.span
            key={latestValue}
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            className="text-2xl font-bold"
            style={{ color }}
          >
            {latestValue.toFixed(1)}
          </motion.span>
          <span className="text-sm text-muted-foreground">{unit}</span>
        </div>
      </div>

      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          {type === "area" ? (
            <AreaChart data={data}>
              <defs>
                <linearGradient id={`gradient-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
              <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={10} />
              <YAxis domain={[minValue, maxValue]} stroke="hsl(var(--muted-foreground))" fontSize={10} />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey={dataKey}
                stroke={color}
                strokeWidth={2}
                fill={`url(#gradient-${dataKey})`}
                animationDuration={300}
              />
            </AreaChart>
          ) : (
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
              <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={10} />
              <YAxis domain={[minValue, maxValue]} stroke="hsl(var(--muted-foreground))" fontSize={10} />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey={dataKey}
                stroke={color}
                strokeWidth={2}
                dot={false}
                animationDuration={300}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default LiveChart;
