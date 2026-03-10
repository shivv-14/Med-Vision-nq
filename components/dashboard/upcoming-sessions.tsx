"use client"

import { Calendar, Clock, Video, User } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Session {
  id: string
  title: string
  type: "video" | "in-person"
  date: string
  time: string
  therapist: string
}

const sessions: Session[] = [
  {
    id: "1",
    title: "CBT Follow-up Session",
    type: "video",
    date: "Today",
    time: "3:00 PM",
    therapist: "Dr. Emily Chen",
  },
  {
    id: "2",
    title: "Pelvic Floor Assessment",
    type: "in-person",
    date: "Tomorrow",
    time: "10:30 AM",
    therapist: "Dr. Sarah Miller",
  },
  {
    id: "3",
    title: "Progress Review",
    type: "video",
    date: "Mar 15",
    time: "2:00 PM",
    therapist: "Dr. Emily Chen",
  },
]

export function UpcomingSessions() {
  return (
    <div className="bg-card rounded-xl border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-foreground">Upcoming Sessions</h3>
        <Button variant="ghost" size="sm" className="text-primary">
          View All
        </Button>
      </div>

      <div className="flex flex-col gap-4">
        {sessions.map((session) => (
          <div
            key={session.id}
            className="flex items-start gap-4 p-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
          >
            <div className="p-2 rounded-lg bg-primary/10">
              {session.type === "video" ? (
                <Video className="size-4 text-primary" />
              ) : (
                <User className="size-4 text-primary" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-foreground text-sm">
                {session.title}
              </h4>
              <p className="text-xs text-muted-foreground mt-1">
                {session.therapist}
              </p>
              <div className="flex items-center gap-3 mt-2">
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="size-3" />
                  {session.date}
                </span>
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="size-3" />
                  {session.time}
                </span>
              </div>
            </div>
            <Button size="sm" variant="outline" className="text-xs">
              {session.type === "video" ? "Join" : "Details"}
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}
