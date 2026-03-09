"use client"

import {
  Brain,
  MessageCircle,
  Activity,
  Pill,
  TrendingUp,
  Calendar,
  Target,
  Sparkles,
} from "lucide-react"
import { StatCard } from "@/components/dashboard/stat-card"
import { QuickActionCard } from "@/components/dashboard/quick-action-card"
import { TherapyProgress } from "@/components/dashboard/therapy-progress"
import { UpcomingSessions } from "@/components/dashboard/upcoming-sessions"
import { AIChatWidget } from "@/components/dashboard/ai-chat-widget"
import { PainTracker } from "@/components/dashboard/pain-tracker"

export default function DashboardPage() {
  return (
    <>
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-serif font-semibold text-foreground">
          Welcome back, Sarah
        </h1>
        <p className="mt-2 text-muted-foreground">
          Your wellness journey continues. Here&apos;s your progress overview.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Therapy Streak"
          value="12 days"
          change="+3 from last week"
          changeType="positive"
          icon={TrendingUp}
        />
        <StatCard
          title="Sessions Completed"
          value="24"
          change="2 this week"
          changeType="neutral"
          icon={Calendar}
        />
        <StatCard
          title="Pain Reduction"
          value="50%"
          change="Since starting"
          changeType="positive"
          icon={Target}
        />
        <StatCard
          title="AI Conversations"
          value="48"
          change="Active support"
          changeType="neutral"
          icon={Sparkles}
        />
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-foreground mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <QuickActionCard
            title="AI Screening"
            description="Take a symptom assessment with our AI screening engine"
            icon={Brain}
            iconBg="bg-blue-100 text-blue-600"
            href="/dashboard/screening"
          />
          <QuickActionCard
            title="Therapy Chat"
            description="Start a guided CBT session with your AI assistant"
            icon={MessageCircle}
            iconBg="bg-emerald-100 text-emerald-600"
            href="/dashboard/therapy"
          />
          <QuickActionCard
            title="Track Progress"
            description="Log your daily exercises and pain levels"
            icon={Activity}
            iconBg="bg-amber-100 text-amber-600"
            href="/dashboard/progress"
          />
          <QuickActionCard
            title="Medication Info"
            description="Compare treatments and therapy protocols"
            icon={Pill}
            iconBg="bg-rose-100 text-rose-600"
            href="/dashboard/medications"
          />
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <TherapyProgress />
          <PainTracker />
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-6">
          <AIChatWidget />
          <UpcomingSessions />
        </div>
      </div>
    </>
  )
}
