"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Activity,
  Brain,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  Flame,
  Heart,
  Lightbulb,
  MessageCircle,
  Play,
  Plus,
  Target,
  TrendingDown,
  TrendingUp,
  Wind,
  Sparkles,
  Bell,
  BellOff,
  BarChart3,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"

// Types
interface TherapyExercise {
  id: string
  name: string
  description: string
  duration: string
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  category: string
  completed: boolean
  icon: React.ReactNode
}

interface PainEntry {
  day: string
  level: number
  date: string
}

// Mock Data - Therapy Plan from AI Screening
const therapyPlan: TherapyExercise[] = [
  {
    id: "1",
    name: "Pelvic Floor Relaxation Exercise",
    description: "Gentle muscle relaxation focusing on the pelvic area",
    duration: "10 minutes",
    difficulty: "Beginner",
    category: "Pelvic Training",
    completed: true,
    icon: <Target className="size-5" />,
  },
  {
    id: "2",
    name: "Deep Breathing Exercise",
    description: "Calming breathing technique to reduce anxiety",
    duration: "5 minutes",
    difficulty: "Beginner",
    category: "Relaxation",
    completed: true,
    icon: <Wind className="size-5" />,
  },
  {
    id: "3",
    name: "CBT Reflection Exercise",
    description: "Identify and reframe negative thoughts about intimacy",
    duration: "5 minutes",
    difficulty: "Intermediate",
    category: "CBT Therapy",
    completed: false,
    icon: <Brain className="size-5" />,
  },
  {
    id: "4",
    name: "Muscle Awareness Training",
    description: "Learn to recognize tension in pelvic muscles",
    duration: "8 minutes",
    difficulty: "Beginner",
    category: "Pelvic Training",
    completed: false,
    icon: <Activity className="size-5" />,
  },
]

// All available exercises for tracking
const allExercises: TherapyExercise[] = [
  ...therapyPlan,
  {
    id: "5",
    name: "Dilator Therapy Practice",
    description: "Gradual desensitization therapy with dilators",
    duration: "15 minutes",
    difficulty: "Advanced",
    category: "Dilator Therapy",
    completed: false,
    icon: <Activity className="size-5" />,
  },
  {
    id: "6",
    name: "Progressive Muscle Relaxation",
    description: "Full body relaxation technique",
    duration: "12 minutes",
    difficulty: "Intermediate",
    category: "Relaxation",
    completed: false,
    icon: <Heart className="size-5" />,
  },
]

// Pain tracking data (last 7 days)
const initialPainData: PainEntry[] = [
  { day: "Mon", level: 6, date: "2025-03-03" },
  { day: "Tue", level: 5, date: "2025-03-04" },
  { day: "Wed", level: 5, date: "2025-03-05" },
  { day: "Thu", level: 4, date: "2025-03-06" },
  { day: "Fri", level: 4, date: "2025-03-07" },
  { day: "Sat", level: 3, date: "2025-03-08" },
  { day: "Sun", level: 3, date: "2025-03-09" },
]

// Recovery Progress calculation factors
const calculateRecoveryScore = (
  exerciseCompletion: number,
  painReduction: number,
  streakDays: number,
  emotionalWellbeing: number
) => {
  return Math.round(
    exerciseCompletion * 0.3 +
      painReduction * 0.3 +
      Math.min(streakDays * 5, 20) +
      emotionalWellbeing * 0.2
  )
}

export default function ProgressTrackerPage() {
  const [exercises, setExercises] = useState(therapyPlan)
  const [painData, setPainData] = useState(initialPainData)
  const [todayPain, setTodayPain] = useState([3])
  const [reminderEnabled, setReminderEnabled] = useState(true)
  const [reminderTime, setReminderTime] = useState("09:00")
  const [emotionalScore, setEmotionalScore] = useState(7)

  // Calculate metrics
  const completedExercises = exercises.filter((e) => e.completed).length
  const totalExercises = exercises.length
  const completionPercentage = Math.round((completedExercises / totalExercises) * 100)
  const therapyStreak = 12 // Mock streak days
  const painReduction = 50 // Mock pain reduction percentage

  // Calculate Recovery Score
  const recoveryScore = calculateRecoveryScore(
    completionPercentage,
    painReduction,
    therapyStreak,
    emotionalScore * 10
  )

  // Handle exercise completion toggle
  const toggleExerciseCompletion = (id: string) => {
    setExercises(
      exercises.map((ex) =>
        ex.id === id ? { ...ex, completed: !ex.completed } : ex
      )
    )
  }

  // Handle pain level update
  const updateTodayPain = (value: number[]) => {
    setTodayPain(value)
  }

  // Log pain for today
  const logPainLevel = () => {
    const today = new Date()
    const dayName = today.toLocaleDateString("en-US", { weekday: "short" })
    const dateStr = today.toISOString().split("T")[0]

    // Check if today already exists
    const existingIndex = painData.findIndex((p) => p.date === dateStr)
    if (existingIndex >= 0) {
      const newData = [...painData]
      newData[existingIndex].level = todayPain[0]
      setPainData(newData)
    } else {
      // Add new entry and remove oldest if more than 7
      const newEntry = { day: dayName, level: todayPain[0], date: dateStr }
      const newData = [...painData, newEntry].slice(-7)
      setPainData(newData)
    }
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <BarChart3 className="size-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-serif font-semibold text-foreground">
              Therapy Progress Tracker
            </h1>
            <p className="text-sm text-muted-foreground">
              Monitor your therapy consistency, exercise completion, and recovery progress
            </p>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-100">
                <Flame className="size-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{therapyStreak}</p>
                <p className="text-xs text-muted-foreground">Day Streak</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100">
                <Calendar className="size-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">24</p>
                <p className="text-xs text-muted-foreground">Sessions</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-100">
                <TrendingDown className="size-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{painReduction}%</p>
                <p className="text-xs text-muted-foreground">Pain Reduction</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Target className="size-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{recoveryScore}%</p>
                <p className="text-xs text-muted-foreground">Recovery Score</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Section 1: Therapy Plan from AI Screening */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="size-5" />
                    Therapy Plan Based on AI Screening
                  </CardTitle>
                  <CardDescription className="mt-1">
                    Personalized exercises recommended from your screening results
                  </CardDescription>
                </div>
                <Link href="/dashboard/screening">
                  <Button variant="outline" size="sm" className="gap-1">
                    Retake Screening
                    <ChevronRight className="size-3" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                {exercises.map((exercise) => (
                  <div
                    key={exercise.id}
                    className={cn(
                      "p-4 rounded-xl border transition-all",
                      exercise.completed
                        ? "bg-emerald-50 border-emerald-200"
                        : "bg-card border-border hover:border-primary/50"
                    )}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className={cn(
                        "p-2 rounded-lg",
                        exercise.completed ? "bg-emerald-100 text-emerald-600" : "bg-primary/10 text-primary"
                      )}>
                        {exercise.icon}
                      </div>
                      {exercise.completed && (
                        <CheckCircle2 className="size-5 text-emerald-600" />
                      )}
                    </div>
                    <h4 className="font-semibold text-foreground text-sm mb-1">
                      {exercise.name}
                    </h4>
                    <p className="text-xs text-muted-foreground mb-3">
                      {exercise.description}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                      <span className="flex items-center gap-1">
                        <Clock className="size-3" />
                        {exercise.duration}
                      </span>
                      <span className={cn(
                        "px-2 py-0.5 rounded-full",
                        exercise.difficulty === "Beginner" && "bg-emerald-100 text-emerald-700",
                        exercise.difficulty === "Intermediate" && "bg-amber-100 text-amber-700",
                        exercise.difficulty === "Advanced" && "bg-rose-100 text-rose-700"
                      )}>
                        {exercise.difficulty}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1 gap-1">
                        <Play className="size-3" />
                        Start
                      </Button>
                      <Button
                        size="sm"
                        variant={exercise.completed ? "secondary" : "default"}
                        className="flex-1"
                        onClick={() => toggleExerciseCompletion(exercise.id)}
                      >
                        {exercise.completed ? "Completed" : "Mark Done"}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Section 2: Daily Therapy Reminder System */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="size-5" />
                Daily Therapy Reminder
              </CardTitle>
              <CardDescription>
                Set reminders to follow your therapy routine
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-secondary/50 rounded-xl mb-4">
                <div className="flex items-center gap-3">
                  {reminderEnabled ? (
                    <Bell className="size-5 text-primary" />
                  ) : (
                    <BellOff className="size-5 text-muted-foreground" />
                  )}
                  <div>
                    <p className="font-medium text-foreground">Daily Notifications</p>
                    <p className="text-xs text-muted-foreground">
                      Get reminded at {reminderTime}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <input
                    type="time"
                    value={reminderTime}
                    onChange={(e) => setReminderTime(e.target.value)}
                    className="px-3 py-1.5 rounded-lg border border-border bg-background text-sm"
                    suppressHydrationWarning
                  />
                  <Switch
                    checked={reminderEnabled}
                    onCheckedChange={setReminderEnabled}
                  />
                </div>
              </div>

              {/* Today's Schedule */}
              <div>
                <h4 className="font-semibold text-foreground text-sm mb-3">
                  Today&apos;s Therapy Schedule
                </h4>
                <div className="space-y-2">
                  {exercises.map((exercise) => (
                    <div
                      key={exercise.id}
                      className={cn(
                        "flex items-center justify-between p-3 rounded-lg border",
                        exercise.completed
                          ? "bg-emerald-50 border-emerald-200"
                          : "bg-card border-border"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "size-8 rounded-full flex items-center justify-center",
                          exercise.completed ? "bg-emerald-100" : "bg-secondary"
                        )}>
                          {exercise.completed ? (
                            <CheckCircle2 className="size-4 text-emerald-600" />
                          ) : (
                            <span className="size-2 rounded-full bg-muted-foreground" />
                          )}
                        </div>
                        <div>
                          <p className={cn(
                            "text-sm font-medium",
                            exercise.completed ? "text-emerald-700" : "text-foreground"
                          )}>
                            {exercise.name}
                          </p>
                          <p className="text-xs text-muted-foreground">{exercise.duration}</p>
                        </div>
                      </div>
                      {exercise.completed ? (
                        <span className="text-xs font-medium text-emerald-600 bg-emerald-100 px-2 py-1 rounded-full">
                          Completed
                        </span>
                      ) : (
                        <Button size="sm" className="gap-1">
                          <Play className="size-3" />
                          Start
                        </Button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Daily Completion Summary */}
                <div className="mt-4 p-4 bg-primary/5 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-foreground">Daily Completion</span>
                    <span className="text-sm font-bold text-primary">{completionPercentage}%</span>
                  </div>
                  <Progress value={completionPercentage} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-2">
                    {completedExercises} of {totalExercises} exercises completed today
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section 4: Pain Tracking System */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="size-5" />
                    Pain Tracking System
                  </CardTitle>
                  <CardDescription>
                    Track your daily pain level to measure improvement
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2 text-emerald-600">
                  <TrendingDown className="size-4" />
                  <span className="text-sm font-medium">-50%</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Today's Pain Input */}
              <div className="p-4 bg-secondary/50 rounded-xl mb-6">
                <h4 className="font-semibold text-foreground text-sm mb-4">
                  Rate Your Pain Level Today
                </h4>
                <div className="space-y-4">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>0 - No pain</span>
                    <span>10 - Severe pain</span>
                  </div>
                  <Slider
                    value={todayPain}
                    onValueChange={updateTodayPain}
                    max={10}
                    min={0}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        "size-12 rounded-xl flex items-center justify-center text-xl font-bold",
                        todayPain[0] <= 3 && "bg-emerald-100 text-emerald-700",
                        todayPain[0] > 3 && todayPain[0] <= 6 && "bg-amber-100 text-amber-700",
                        todayPain[0] > 6 && "bg-rose-100 text-rose-700"
                      )}>
                        {todayPain[0]}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {todayPain[0] <= 3 && "Mild pain"}
                          {todayPain[0] > 3 && todayPain[0] <= 6 && "Moderate pain"}
                          {todayPain[0] > 6 && "Severe pain"}
                        </p>
                        <p className="text-xs text-muted-foreground">Current rating</p>
                      </div>
                    </div>
                    <Button onClick={logPainLevel} className="gap-1">
                      <Plus className="size-4" />
                      Log Pain Level
                    </Button>
                  </div>
                </div>
              </div>

              {/* Weekly Pain Trend Graph */}
              <div>
                <h4 className="font-semibold text-foreground text-sm mb-4">
                  Weekly Pain Trend
                </h4>
                <div className="flex items-end justify-between gap-2 h-32 mb-4">
                  {painData.map((item) => (
                    <div key={item.date} className="flex flex-col items-center flex-1 gap-2">
                      <div className="w-full relative h-24 bg-secondary/50 rounded-t-md overflow-hidden">
                        <div
                          className={cn(
                            "absolute bottom-0 left-0 right-0 rounded-t-md transition-all duration-500",
                            item.level <= 3 && "bg-emerald-400",
                            item.level > 3 && item.level <= 6 && "bg-amber-400",
                            item.level > 6 && "bg-rose-400"
                          )}
                          style={{ height: `${(item.level / 10) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">{item.day}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-xl">
                  <div>
                    <p className="text-sm text-muted-foreground">Current Level</p>
                    <p className="text-2xl font-bold text-foreground">{todayPain[0]}/10</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Weekly Average</p>
                    <p className="text-2xl font-bold text-foreground">
                      {(painData.reduce((acc, p) => acc + p.level, 0) / painData.length).toFixed(1)}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Section 5: Recovery Progress Score */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="size-5" />
                Recovery Progress Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Circular Progress */}
              <div className="flex flex-col items-center mb-6">
                <div className="relative size-36">
                  <svg className="size-36 -rotate-90" viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      className="text-secondary"
                    />
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeDasharray={`${recoveryScore}, 100`}
                      className="text-emerald-500"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold text-foreground">{recoveryScore}%</span>
                    <span className="text-xs text-muted-foreground">Recovery</span>
                  </div>
                </div>
              </div>

              {/* Score Breakdown */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Exercise Completion</span>
                  <span className="text-sm font-medium text-foreground">{completionPercentage}%</span>
                </div>
                <Progress value={completionPercentage} className="h-1.5" />

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Pain Reduction</span>
                  <span className="text-sm font-medium text-foreground">{painReduction}%</span>
                </div>
                <Progress value={painReduction} className="h-1.5" />

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Emotional Wellbeing</span>
                  <span className="text-sm font-medium text-foreground">{emotionalScore * 10}%</span>
                </div>
                <Progress value={emotionalScore * 10} className="h-1.5" />
              </div>

              {/* Therapy Streak */}
              <div className="mt-6 p-4 bg-amber-50 rounded-xl border border-amber-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-amber-100">
                    <Flame className="size-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-amber-800">Therapy Streak</p>
                    <p className="text-2xl font-bold text-amber-700">{therapyStreak} days</p>
                  </div>
                </div>
                <p className="text-xs text-amber-700 mt-2">
                  Keep it up! Consistency is key to recovery.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Section 6: AI Therapy Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="size-5" />
                AI Therapy Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-primary/5 rounded-xl border border-primary/10 mb-4">
                <div className="flex items-start gap-3">
                  <div className="p-1.5 rounded-lg bg-primary/10">
                    <Lightbulb className="size-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground mb-1">
                      Great Progress!
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Your pain score has decreased by 20% over the past week.
                      Continuing relaxation exercises may further improve muscle control.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-foreground">Suggested Next Steps:</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground p-2 bg-secondary/50 rounded-lg">
                    <CheckCircle2 className="size-4 text-emerald-500" />
                    Continue Pelvic Floor Training
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground p-2 bg-secondary/50 rounded-lg">
                    <CheckCircle2 className="size-4 text-emerald-500" />
                    Try Advanced Breathing Exercise
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground p-2 bg-secondary/50 rounded-lg">
                    <CheckCircle2 className="size-4 text-emerald-500" />
                    Talk to AI Therapy Assistant
                  </div>
                </div>
              </div>

              <div className="mt-4 flex flex-col gap-2">
                <Link href="/dashboard/therapy-assistant">
                  <Button className="w-full gap-2">
                    <MessageCircle className="size-4" />
                    Open Therapy Assistant
                  </Button>
                </Link>
                <Button variant="outline" className="w-full gap-2">
                  <Play className="size-4" />
                  Start New Exercise
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Section 7: Navigation Integration */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Quick Navigation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link
                href="/dashboard/screening"
                className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <Brain className="size-5 text-primary" />
                  <span className="text-sm font-medium text-foreground">
                    View Screening Results
                  </span>
                </div>
                <ChevronRight className="size-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/dashboard/therapy-assistant"
                className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <MessageCircle className="size-5 text-primary" />
                  <span className="text-sm font-medium text-foreground">
                    Talk to Therapy Assistant
                  </span>
                </div>
                <ChevronRight className="size-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/dashboard"
                className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <Activity className="size-5 text-primary" />
                  <span className="text-sm font-medium text-foreground">
                    View Therapy Plan
                  </span>
                </div>
                <ChevronRight className="size-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
              </Link>
            </CardContent>
          </Card>

          {/* Emotional Wellbeing Check-in */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <Heart className="size-4" />
                Emotional Check-in
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground mb-3">
                How are you feeling emotionally today?
              </p>
              <div className="flex justify-between gap-1 mb-2">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                  <button
                    key={num}
                    onClick={() => setEmotionalScore(num)}
                    className={cn(
                      "size-7 rounded-md text-xs font-medium transition-all",
                      emotionalScore === num
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary hover:bg-secondary/80 text-muted-foreground"
                    )}
                  >
                    {num}
                  </button>
                ))}
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Low</span>
                <span>High</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
