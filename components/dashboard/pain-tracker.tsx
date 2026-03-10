"use client"

import { TrendingDown } from "lucide-react"

const painData = [
  { day: "Mon", level: 6 },
  { day: "Tue", level: 5 },
  { day: "Wed", level: 5 },
  { day: "Thu", level: 4 },
  { day: "Fri", level: 4 },
  { day: "Sat", level: 3 },
  { day: "Sun", level: 3 },
]

export function PainTracker() {
  const maxLevel = 10

  return (
    <div className="bg-card rounded-xl border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-semibold text-foreground">Pain Level Trend</h3>
          <p className="text-sm text-muted-foreground mt-1">Last 7 days</p>
        </div>
        <div className="flex items-center gap-2 text-emerald-600">
          <TrendingDown className="size-4" />
          <span className="text-sm font-medium">-50%</span>
        </div>
      </div>

      {/* Simple Bar Chart */}
      <div className="flex items-end justify-between gap-2 h-32">
        {painData.map((item) => (
          <div key={item.day} className="flex flex-col items-center flex-1 gap-2">
            <div className="w-full relative h-24 bg-secondary/50 rounded-t-md overflow-hidden">
              <div
                className="absolute bottom-0 left-0 right-0 bg-accent/80 rounded-t-md transition-all duration-500"
                style={{ height: `${(item.level / maxLevel) * 100}%` }}
              />
            </div>
            <span className="text-xs text-muted-foreground">{item.day}</span>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Current Level</p>
          <p className="text-2xl font-bold text-foreground">3/10</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Weekly Average</p>
          <p className="text-2xl font-bold text-foreground">4.3</p>
        </div>
      </div>
    </div>
  )
}
