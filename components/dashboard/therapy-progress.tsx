"use client"

import { Progress } from "@/components/ui/progress"

interface TherapyItem {
  name: string
  progress: number
  status: "completed" | "in-progress" | "upcoming"
}

const therapyItems: TherapyItem[] = [
  { name: "Relaxation Exercises", progress: 100, status: "completed" },
  { name: "Pelvic Floor Training", progress: 75, status: "in-progress" },
  { name: "Dilator Therapy - Stage 2", progress: 45, status: "in-progress" },
  { name: "CBT Session 4", progress: 0, status: "upcoming" },
]

export function TherapyProgress() {
  return (
    <div className="bg-card rounded-xl border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-semibold text-foreground">Today&apos;s Therapy Plan</h3>
          <p className="text-sm text-muted-foreground mt-1">3 of 4 completed</p>
        </div>
        <span className="text-2xl font-bold text-primary">75%</span>
      </div>

      <div className="flex flex-col gap-4">
        {therapyItems.map((item) => (
          <div key={item.name} className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">
                {item.name}
              </span>
              <span
                className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  item.status === "completed"
                    ? "bg-emerald-100 text-emerald-700"
                    : item.status === "in-progress"
                    ? "bg-amber-100 text-amber-700"
                    : "bg-secondary text-muted-foreground"
                }`}
              >
                {item.status === "completed"
                  ? "Done"
                  : item.status === "in-progress"
                  ? "In Progress"
                  : "Upcoming"}
              </span>
            </div>
            <Progress value={item.progress} className="h-2" />
          </div>
        ))}
      </div>
    </div>
  )
}
