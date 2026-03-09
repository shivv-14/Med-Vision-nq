"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Heart,
  LayoutDashboard,
  Brain,
  MessageCircle,
  Calendar,
  Pill,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
}

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "AI Screening", href: "/dashboard/screening", icon: Brain },
  { name: "Therapy Assistant", href: "/dashboard/therapy", icon: MessageCircle },
  { name: "Progress Tracker", href: "/dashboard/progress", icon: Calendar },
  { name: "Medications", href: "/dashboard/medications", icon: Pill },
]

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname()

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-card border-r border-border transition-all duration-300",
        "hidden lg:block",
        collapsed ? "w-20" : "w-64"
      )}
    >
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center gap-3 p-4 border-b border-border">
          <div className="size-10 rounded-xl bg-primary flex items-center justify-center flex-shrink-0">
            <Heart className="size-5 text-primary-foreground" />
          </div>
          {!collapsed && (
            <span className="text-lg font-semibold tracking-tight text-foreground">
              MedVision
            </span>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="flex flex-col gap-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    )}
                  >
                    <item.icon className="size-5 flex-shrink-0" />
                    {!collapsed && (
                      <span className="font-medium text-sm">{item.name}</span>
                    )}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-border">
          <ul className="flex flex-col gap-2">
            <li>
              <Link
                href="/dashboard/settings"
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-all duration-200"
              >
                <Settings className="size-5 flex-shrink-0" />
                {!collapsed && <span className="font-medium text-sm">Settings</span>}
              </Link>
            </li>
            <li>
              <Link
                href="/"
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all duration-200"
              >
                <LogOut className="size-5 flex-shrink-0" />
                {!collapsed && <span className="font-medium text-sm">Sign Out</span>}
              </Link>
            </li>
          </ul>
        </div>

        {/* Collapse Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className="absolute -right-3 top-20 size-6 rounded-full border border-border bg-card shadow-sm hover:bg-secondary"
        >
          {collapsed ? (
            <ChevronRight className="size-3" />
          ) : (
            <ChevronLeft className="size-3" />
          )}
        </Button>
      </div>
    </aside>
  )
}
