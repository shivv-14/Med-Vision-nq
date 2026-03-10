"use client"

import { useState } from "react"
import { Send, Bot, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const quickPrompts = [
  "How do I manage anxiety?",
  "Guide me through breathing",
  "Tips for relaxation",
]

export function AIChatWidget() {
  const [message, setMessage] = useState("")

  return (
    <div className="bg-card rounded-xl border border-border p-6 h-full flex flex-col">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-primary/10">
          <Bot className="size-5 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">AI Therapy Assistant</h3>
          <p className="text-xs text-muted-foreground">
            Your 24/7 supportive companion
          </p>
        </div>
        <span className="ml-auto flex items-center gap-1 text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
          <span className="size-1.5 rounded-full bg-emerald-500" />
          Online
        </span>
      </div>

      {/* Chat Preview */}
      <div className="flex-1 bg-secondary/30 rounded-lg p-4 mb-4">
        <div className="flex gap-3">
          <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Sparkles className="size-4 text-primary" />
          </div>
          <div className="bg-background rounded-lg rounded-tl-none p-3 max-w-[80%]">
            <p className="text-sm text-foreground">
              Hello Sarah! How are you feeling today? I&apos;m here to support your
              therapy journey with guided exercises and compassionate
              conversation.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Prompts */}
      <div className="flex flex-wrap gap-2 mb-4">
        {quickPrompts.map((prompt) => (
          <button
            key={prompt}
            onClick={() => setMessage(prompt)}
            className="text-xs px-3 py-1.5 rounded-full bg-secondary hover:bg-secondary/80 text-muted-foreground hover:text-foreground transition-colors"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1"
        />
        <Button size="icon" className="flex-shrink-0">
          <Send className="size-4" />
        </Button>
      </div>
    </div>
  )
}
