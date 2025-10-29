import { useState, useEffect, useCallback } from "react"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart"
import { AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts"
import { Switch } from "../ui/switch"
import { Label } from "../ui/label"
import { Slider } from "../ui/slider"
import { TrendingUp, Users, DollarSign, Zap } from "lucide-react"

const generateDataPoint = (timestamp: number, volatility = 1) => {
  const base = Math.sin(timestamp / 15000) * 20 + 100
  const random = Math.random() * 10 * volatility
  const value = Math.max(0, base + random)

  return {
    timestamp,
    revenue: Math.round((value * 45 + Math.random() * 500 * volatility) * 10) / 10,
    activeUsers: Math.floor(value * 8 + Math.random() * 100 * volatility),
    conversionRate: Math.max(
      0,
      Math.min(100, Math.round((2 + Math.sin(timestamp / 20000) + Math.random() * 2 * volatility) * 100) / 100),
    ),
    responseTime: Math.max(
      10,
      Math.round((50 + Math.sin(timestamp / 12000) * 20 + Math.random() * 30 * volatility) * 10) / 10,
    ),
  }
}

// Professional color palette
const CHART_COLORS = {
  revenue: "rgb(59, 130, 246)", // Blue
  activeUsers: "rgb(34, 197, 94)", // Green
  conversionRate: "rgb(168, 85, 247)", // Purple
  responseTime: "rgb(249, 115, 22)", // Orange
}

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: CHART_COLORS.revenue,
  },
  activeUsers: {
    label: "Active Users",
    color: CHART_COLORS.activeUsers,
  },
  conversionRate: {
    label: "Conversion Rate",
    color: CHART_COLORS.conversionRate,
  },
  responseTime: {
    label: "Response Time",
    color: CHART_COLORS.responseTime,
  },
}

export default function AnalyticsDashboard() {
  const [data, setData] = useState<
    Array<{
      timestamp: number
      revenue: number
      activeUsers: number
      conversionRate: number
      responseTime: number
    }>
  >([])
  const [isRunning, setIsRunning] = useState(true)
  const [updateInterval, setUpdateInterval] = useState(1000)
  const [volatility, setVolatility] = useState(1)
  const [selectedMetrics] = useState({
    revenue: true,
    activeUsers: true,
    conversionRate: true,
    responseTime: false,
  })

  const addDataPoint = useCallback(() => {
    setData((prevData) => {
      const timestamp = Date.now()
      const newPoint = generateDataPoint(timestamp, volatility)

      // Add new point at the end
      const updatedData = [...prevData, newPoint]

      // Keep only the last 20 points for smooth scrolling effect
      if (updatedData.length > 20) {
        return updatedData.slice(-20)
      }

      return updatedData
    })
  }, [volatility])

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null

    if (isRunning) {
      intervalId = setInterval(addDataPoint, updateInterval)
    }

    if (data.length === 0) {
      const initialData = []
      const now = Date.now()
      for (let i = 19; i >= 0; i--) {
        initialData.push(generateDataPoint(now - i * 1000, volatility))
      }
      setData(initialData)
    }

    return () => {
      if (intervalId) clearInterval(intervalId)
    }
  }, [isRunning, updateInterval, addDataPoint, data.length, volatility])

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp)
    return `${date.getHours().toString().padStart(2, "0")}:${date
      .getMinutes()
      .toString()
      .padStart(2, "0")}:${date.getSeconds().toString().padStart(2, "0")}`
  }

  const getLatestMetrics = () => {
    if (data.length === 0) return null
    return data[data.length - 1]
  }

  const latestMetrics = getLatestMetrics()

  return (
    <div className="w-full mx-auto rounded-lg border border-black bg-white text-black p-2 sm:p-3">
      <div className="space-y-3">
          {/* Header with metrics cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
            <div className="rounded-lg border border-black bg-white p-2">
              <div className="flex items-center justify-between">
                <div className="text-[10px] font-medium text-gray-600">Revenue</div>
                <DollarSign className="h-3 w-3 text-blue-500" />
              </div>
              <div className="mt-0.5 text-base font-bold text-black">${latestMetrics?.revenue.toFixed(2) || "0.00"}</div>
              <div className="text-[9px] text-green-500 flex items-center gap-0.5">
                <TrendingUp className="h-2.5 w-2.5" />
                +12.5%
              </div>
            </div>

            <div className="rounded-lg border border-black bg-white p-2">
              <div className="flex items-center justify-between">
                <div className="text-[10px] font-medium text-gray-600">Users</div>
                <Users className="h-3 w-3 text-green-500" />
              </div>
              <div className="mt-0.5 text-base font-bold text-black">{latestMetrics?.activeUsers.toLocaleString() || "0"}</div>
              <div className="text-[9px] text-green-500 flex items-center gap-0.5">
                <TrendingUp className="h-2.5 w-2.5" />
                +8.2%
              </div>
            </div>

            <div className="rounded-lg border border-black bg-white p-2">
              <div className="flex items-center justify-between">
                <div className="text-[10px] font-medium text-gray-600">Conv. Rate</div>
                <Zap className="h-3 w-3 text-purple-500" />
              </div>
              <div className="mt-0.5 text-base font-bold text-black">{latestMetrics?.conversionRate.toFixed(2) || "0.00"}%</div>
              <div className="text-[9px] text-green-500 flex items-center gap-0.5">
                <TrendingUp className="h-2.5 w-2.5" />
                +3.1%
              </div>
            </div>

            <div className="rounded-lg border border-black bg-white p-2">
              <div className="flex items-center justify-between">
                <div className="text-[10px] font-medium text-gray-600">Response</div>
                <Zap className="h-3 w-3 text-orange-500" />
              </div>
              <div className="mt-0.5 text-base font-bold text-black">{latestMetrics?.responseTime.toFixed(0) || "0"}ms</div>
              <div className="text-[9px] text-gray-600">Avg time</div>
            </div>
          </div>

          {/* Controls panel */}
          <div className="rounded-lg border border-black bg-white p-2">
            <div className="text-[10px] font-semibold mb-1.5 text-black">Controls</div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="flex items-center gap-2">
                <Label htmlFor="live-updates" className="text-[10px] text-black">
                  {isRunning ? "Live" : "Paused"}
                </Label>
                <Switch id="live-updates" checked={isRunning} onCheckedChange={setIsRunning} />
              </div>

              <div className="space-y-1">
                <Label className="text-[10px] text-black">Frequency</Label>
                <div className="flex items-center gap-1.5">
                  <Slider
                    value={[updateInterval]}
                    min={20}
                    max={3000}
                    step={10}
                    onValueChange={(values) => setUpdateInterval(values[0])}
                    className="flex-1"
                  />
                  <span className="text-[9px] text-gray-600 w-10 text-right">{updateInterval}ms</span>
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-[10px] text-black">Volatility</Label>
                <div className="flex items-center gap-1.5">
                  <Slider
                    value={[volatility]}
                    min={0.5}
                    max={10}
                    step={0.1}
                    onValueChange={(values) => setVolatility(values[0])}
                    className="flex-1"
                  />
                  <span className="text-[9px] text-gray-600 w-10 text-right">{volatility.toFixed(1)}x</span>
                </div>
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 sm:gap-3">
            {selectedMetrics.revenue && (
              <div className="rounded-lg border border-black bg-white p-2">
                <ChartContainer config={chartConfig} className="h-[100px] w-full">
                  <AreaChart data={data}>
                    <defs>
                      <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={CHART_COLORS.revenue} stopOpacity={0.3} />
                        <stop offset="100%" stopColor={CHART_COLORS.revenue} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgb(39, 39, 42)" />
                    <XAxis
                      dataKey="timestamp"
                      tickFormatter={formatTimestamp}
                      stroke="rgb(161, 161, 170)"
                      fontSize={8}
                      hide
                    />
                    <YAxis stroke="rgb(161, 161, 170)" fontSize={8} width={30} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke={CHART_COLORS.revenue}
                      fill="url(#revenueGradient)"
                      strokeWidth={1.5}
                      isAnimationActive={false}
                    />
                  </AreaChart>
                </ChartContainer>
              </div>
            )}

            {selectedMetrics.activeUsers && (
              <div className="rounded-lg border border-black bg-white p-2">
                <ChartContainer config={chartConfig} className="h-[100px] w-full">
                  <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgb(39, 39, 42)" />
                    <XAxis
                      dataKey="timestamp"
                      tickFormatter={formatTimestamp}
                      stroke="rgb(161, 161, 170)"
                      fontSize={8}
                      hide
                    />
                    <YAxis stroke="rgb(161, 161, 170)" fontSize={8} width={30} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line
                      type="monotone"
                      dataKey="activeUsers"
                      stroke={CHART_COLORS.activeUsers}
                      strokeWidth={1.5}
                      dot={false}
                      isAnimationActive={false}
                    />
                  </LineChart>
                </ChartContainer>
              </div>
            )}

            {selectedMetrics.conversionRate && (
              <div className="rounded-lg border border-black bg-white p-2">
                <ChartContainer config={chartConfig} className="h-[100px] w-full">
                  <AreaChart data={data}>
                    <defs>
                      <linearGradient id="conversionGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={CHART_COLORS.conversionRate} stopOpacity={0.3} />
                        <stop offset="100%" stopColor={CHART_COLORS.conversionRate} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgb(39, 39, 42)" />
                    <XAxis
                      dataKey="timestamp"
                      tickFormatter={formatTimestamp}
                      stroke="rgb(161, 161, 170)"
                      fontSize={8}
                      hide
                    />
                    <YAxis stroke="rgb(161, 161, 170)" fontSize={8} width={30} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Area
                      type="monotone"
                      dataKey="conversionRate"
                      stroke={CHART_COLORS.conversionRate}
                      fill="url(#conversionGradient)"
                      strokeWidth={1.5}
                      isAnimationActive={false}
                    />
                  </AreaChart>
                </ChartContainer>
              </div>
            )}

            {selectedMetrics.responseTime && (
              <div className="rounded-lg border border-black bg-white p-2">
                <ChartContainer config={chartConfig} className="h-[100px] w-full">
                  <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgb(39, 39, 42)" />
                    <XAxis
                      dataKey="timestamp"
                      tickFormatter={formatTimestamp}
                      stroke="rgb(161, 161, 170)"
                      fontSize={8}
                      hide
                    />
                    <YAxis stroke="rgb(161, 161, 170)" fontSize={8} width={30} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line
                      type="monotone"
                      dataKey="responseTime"
                      stroke={CHART_COLORS.responseTime}
                      strokeWidth={1.5}
                      dot={false}
                      isAnimationActive={false}
                    />
                  </LineChart>
                </ChartContainer>
              </div>
            )}
          </div>

          {/* Data history table */}
          <div className="rounded-lg border border-black bg-white p-2">
            <div className="text-[10px] font-semibold mb-1.5 text-black">Recent Data Points</div>

            {/* Mobile: Card layout */}
            <div className="block md:hidden space-y-2">
              {data
                .slice(-3)
                .reverse()
                .map((point) => (
                  <div key={point.timestamp} className="rounded border border-black p-2 space-y-1">
                    <div className="text-[9px] font-mono text-gray-600 mb-1.5">
                      {formatTimestamp(point.timestamp)}
                    </div>
                    <div className="grid grid-cols-2 gap-1.5 text-[9px]">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Revenue:</span>
                        <span className="font-mono text-black">${point.revenue.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Users:</span>
                        <span className="font-mono text-black">{point.activeUsers}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Conv:</span>
                        <span className="font-mono text-black">{point.conversionRate.toFixed(2)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Time:</span>
                        <span className="font-mono text-black">{point.responseTime.toFixed(0)}ms</span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>

            {/* Desktop: Table layout */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-[9px]">
                <thead>
                  <tr className="border-b border-black">
                    <th className="text-left py-1 px-1 font-medium text-gray-600">Time</th>
                    <th className="text-right py-1 px-1 font-medium text-gray-600">Revenue</th>
                    <th className="text-right py-1 px-1 font-medium text-gray-600">Users</th>
                    <th className="text-right py-1 px-1 font-medium text-gray-600">Conv %</th>
                    <th className="text-right py-1 px-1 font-medium text-gray-600">Response</th>
                  </tr>
                </thead>
                <tbody>
                  {data
                    .slice(-5)
                    .reverse()
                    .map((point) => (
                      <tr key={point.timestamp} className="border-b border-black last:border-0">
                        <td className="py-1 px-1 font-mono text-black">{formatTimestamp(point.timestamp)}</td>
                        <td className="text-right py-1 px-1 font-mono text-black">${point.revenue.toFixed(2)}</td>
                        <td className="text-right py-1 px-1 font-mono text-black">{point.activeUsers}</td>
                        <td className="text-right py-1 px-1 font-mono text-black">{point.conversionRate.toFixed(2)}%</td>
                        <td className="text-right py-1 px-1 font-mono text-black">{point.responseTime.toFixed(0)}ms</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
    </div>
  )
}
