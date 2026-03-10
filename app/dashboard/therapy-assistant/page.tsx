"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import {
  Send,
  Bot,
  Sparkles,
  Wind,
  Heart,
  Brain,
  Shield,
  ChevronRight,
  Mic,
  MicOff,
  Clock,
  Lock,
  Activity,
  MessageCircle,
  Lightbulb,
  Target,
  Circle,
  TrendingUp,
  Calendar,
  BarChart3,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { Progress } from "@/components/ui/progress"

// Types
interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  type?: "text" | "exercise" | "breathing" | "off-topic"
}

interface TherapyTopic {
  id: string
  label: string
  icon: React.ReactNode
  description: string
  prompts: string[]
}

// Allowed Topic Keywords for filtering
const healthcareKeywords = [
  "pain", "hurt", "ache", "symptom", "therapy", "exercise", "treatment",
  "medication", "healing", "recovery", "health", "medical", "doctor",
  "pelvic", "muscle", "dilator", "vaginismus", "dyspareunia", "diagnosis",
  "condition", "chronic", "acute", "inflammation", "infection", "hormones"
]

const feelingsKeywords = [
  "feel", "feeling", "feelings", "emotion", "emotions", "emotional",
  "anxious", "anxiety", "stressed", "stress", "worried", "worry",
  "scared", "fear", "afraid", "nervous", "upset", "sad", "happy",
  "frustrated", "angry", "depressed", "overwhelmed", "calm", "relaxed",
  "hopeful", "hopeless", "confident", "insecure", "vulnerable"
]

const humanRelatedKeywords = [
  "relationship", "partner", "intimacy", "intimate", "love", "trust",
  "communication", "support", "family", "friend", "self-esteem",
  "body", "mind", "mental", "physical", "sexual", "wellbeing",
  "wellness", "coping", "mindfulness", "meditation", "breathing",
  "relaxation", "sleep", "rest", "energy", "fatigue", "tired"
]

// Function to check if message is on-topic
const isMessageOnTopic = (message: string): boolean => {
  const lowerMessage = message.toLowerCase()
  
  // Check for healthcare keywords
  const hasHealthcare = healthcareKeywords.some(keyword => 
    lowerMessage.includes(keyword)
  )
  
  // Check for feelings keywords
  const hasFeelings = feelingsKeywords.some(keyword => 
    lowerMessage.includes(keyword)
  )
  
  // Check for human-related keywords
  const hasHumanRelated = humanRelatedKeywords.some(keyword => 
    lowerMessage.includes(keyword)
  )
  
  // Also allow greetings and basic conversation starters
  const greetings = ["hello", "hi", "hey", "good morning", "good evening", "how are you", "thank you", "thanks", "help", "start", "begin"]
  const hasGreeting = greetings.some(greeting => 
    lowerMessage.includes(greeting)
  )
  
  return hasHealthcare || hasFeelings || hasHumanRelated || hasGreeting
}

// Therapy Topics
const therapyTopics: TherapyTopic[] = [
  {
    id: "emotional",
    label: "Emotional Support",
    icon: <Heart className="size-4" />,
    description: "Talk about fears, anxiety, or feelings",
    prompts: [
      "I feel pain during penetration",
      "I feel anxious about intimacy",
      "I want to understand vaginismus",
    ],
  },
  {
    id: "cbt",
    label: "CBT Therapy",
    icon: <Brain className="size-4" />,
    description: "Cognitive behavioral techniques",
    prompts: [
      "Help me identify negative thoughts",
      "I need help reframing my fears",
      "What thoughts do I experience before intimacy?",
    ],
  },
  {
    id: "relaxation",
    label: "Relaxation Exercises",
    icon: <Wind className="size-4" />,
    description: "Breathing and calming techniques",
    prompts: [
      "Guide me through deep breathing",
      "I need help relaxing right now",
      "Teach me a relaxation technique",
    ],
  },
  {
    id: "pelvic",
    label: "Pelvic Floor Training",
    icon: <Target className="size-4" />,
    description: "Muscle awareness and relaxation",
    prompts: [
      "Explain pelvic floor muscles",
      "How do I relax my pelvic muscles?",
      "Guide me through pelvic relaxation",
    ],
  },
  {
    id: "dilator",
    label: "Dilator Therapy",
    icon: <Activity className="size-4" />,
    description: "Step-by-step dilator guidance",
    prompts: [
      "Explain dilator therapy to me",
      "How do I start dilator therapy?",
      "Tips for comfortable dilator use",
    ],
  },
]

// AI Response Generator
const generateAIResponse = (userMessage: string): { content: string; type: "text" | "exercise" | "breathing" | "off-topic" } => {
  const lowerMessage = userMessage.toLowerCase()
  
  // Check if message is on-topic
  if (!isMessageOnTopic(userMessage)) {
    return {
      type: "off-topic",
      content: `I appreciate you reaching out! However, I'm specifically designed to help with healthcare, feelings, emotions, and human-related topics.

**Please ask me about:**
- Health care concerns and therapy guidance
- Feelings and emotional support
- Relaxation and breathing exercises
- Pelvic health and exercises
- Mental wellness and coping strategies

Feel free to select a topic from the sidebar or try asking something like "How can I manage my anxiety?" or "Guide me through a breathing exercise."`,
    }
  }

  // Breathing/Relaxation responses
  if (lowerMessage.includes("breath") || lowerMessage.includes("relax")) {
    return {
      type: "breathing",
      content: `I'd be happy to guide you through a calming breathing exercise. This technique helps reduce anxiety and relax your pelvic muscles.

**Deep Breathing Exercise:**

1. **Sit comfortably** in a quiet space
2. **Inhale slowly** through your nose for 4 seconds
3. **Hold** your breath gently for 4 seconds  
4. **Exhale slowly** through your mouth for 6 seconds
5. **Repeat** this cycle 5-10 times

As you breathe, focus on releasing tension in your lower body. Imagine each exhale carrying away stress and tightness.

Would you like me to guide you through this with a timer, or shall we try another relaxation technique?`,
    }
  }

  // Pelvic floor responses
  if (lowerMessage.includes("pelvic") || lowerMessage.includes("muscle")) {
    return {
      type: "exercise",
      content: `Great question! Understanding your pelvic floor is an important step in your therapy journey.

**What is the Pelvic Floor?**
The pelvic floor is a group of muscles that form a supportive hammock at the base of your pelvis. When these muscles are too tense, it can cause pain during penetration.

**Pelvic Muscle Relaxation Exercise:**

**Step 1:** Find a comfortable position, either lying down or sitting
**Step 2:** Focus on your lower pelvic area - don't try to squeeze or tighten
**Step 3:** Take slow, deep breaths and imagine the muscles softening
**Step 4:** With each exhale, visualize releasing tension downward
**Step 5:** Practice for 2-3 minutes daily

Remember: The goal is relaxation, not strengthening. Avoid kegel exercises until advised by your therapist.

Would you like me to explain more about how muscle tension causes pain?`,
    }
  }

  // Dilator therapy responses
  if (lowerMessage.includes("dilator")) {
    return {
      type: "exercise",
      content: `Dilator therapy is a gradual, gentle approach that many find helpful. Let me explain how it works.

**What is Dilator Therapy?**
Vaginal dilators are smooth, graduated devices used to help your body become comfortable with penetration at your own pace.

**Step-by-Step Guidance:**

**Step 1:** Begin with the smallest dilator size
**Step 2:** Use breathing exercises to relax your muscles first
**Step 3:** Apply water-based lubricant generously
**Step 4:** Insert slowly and gently - never force
**Step 5:** Hold in place while practicing relaxation
**Step 6:** Practice for 10-15 minutes, 3-4 times per week

**Important:** Progress to the next size only when the current one feels comfortable. This may take days or weeks - there's no rush.

**Safety Note:** Always consult a healthcare professional before beginning dilator therapy to ensure it's appropriate for you.

Would you like tips on relaxation techniques before using a dilator?`,
    }
  }

  // CBT responses
  if (lowerMessage.includes("thought") || lowerMessage.includes("cbt") || lowerMessage.includes("negative") || lowerMessage.includes("fear")) {
    return {
      type: "text",
      content: `It's wonderful that you're interested in working on your thoughts. CBT can be very effective for managing pain-related anxiety.

**Identifying Negative Thoughts:**
Before intimacy, you might notice thoughts like:
- "This is going to hurt"
- "I can't do this"
- "Something is wrong with me"

These thoughts are common and understandable given past experiences with pain.

**Reframing Technique:**
Let's practice turning a fearful thought into a more balanced one:

**Unhelpful thought:** "It will definitely hurt"
**Balanced thought:** "I'm learning techniques that may help. I can stop anytime I need to."

**Unhelpful thought:** "I'll never be normal"
**Balanced thought:** "Many people have overcome this with time and practice. I'm making progress."

Would you like to share a specific thought you've been having? We can work on reframing it together.`,
    }
  }

  // Anxiety/Emotional support
  if (lowerMessage.includes("anxious") || lowerMessage.includes("anxiety") || lowerMessage.includes("scared") || lowerMessage.includes("afraid")) {
    return {
      type: "text",
      content: `I hear you, and it's completely understandable to feel anxious. Your feelings are valid, and many people on this journey experience similar emotions.

**Remember:**
- Anxiety about pain is a natural protective response
- Feeling anxious doesn't mean you're failing
- Progress isn't linear - difficult days are part of healing

**What might help right now:**

1. **Acknowledge the feeling** - "I notice I'm feeling anxious, and that's okay"
2. **Ground yourself** - Feel your feet on the floor, notice your surroundings
3. **Breathe slowly** - Even a few deep breaths can help calm your nervous system

Would you like to:
- Talk more about what's making you anxious?
- Try a quick breathing exercise together?
- Learn about why our bodies respond this way?

I'm here to support you, whatever you need.`,
    }
  }

  // Pain responses
  if (lowerMessage.includes("pain") || lowerMessage.includes("hurt")) {
    return {
      type: "text",
      content: `Thank you for sharing that with me. Talking about pain can be difficult, and I appreciate your openness.

**Understanding Pelvic Pain:**
Pain during penetration is often caused by involuntary muscle tension. Your body is trying to protect you, even when there's no actual threat. This is not your fault.

**Common causes include:**
- Vaginismus (involuntary muscle spasms)
- Tension from past painful experiences
- Anxiety that triggers physical responses

**What can help:**
- Gradual desensitization through therapy
- Relaxation and breathing techniques
- Working with a pelvic floor therapist
- CBT to address fear and anxiety

Would you like me to explain more about any of these, or guide you through a relaxation exercise to help with current discomfort?`,
    }
  }

  // Vaginismus explanation
  if (lowerMessage.includes("vaginismus") || lowerMessage.includes("understand")) {
    return {
      type: "text",
      content: `I'm glad you want to learn more. Understanding your condition is an empowering first step.

**What is Vaginismus?**
Vaginismus is the involuntary tightening of vaginal muscles when penetration is attempted. It's like a reflex - you can't control it consciously, and it's not something you're doing on purpose.

**Key Points:**
- It's more common than you might think
- It can be treated with the right approach
- It doesn't define you or your worth
- Many people fully overcome it

**Treatment typically includes:**
- Gradual desensitization exercises
- Relaxation and breathing techniques
- Cognitive behavioral therapy (CBT)
- Pelvic floor physical therapy
- Sometimes dilator therapy

**Your journey here is a positive step.** The fact that you're seeking information and support shows strength and courage.

What aspect would you like to explore further?`,
    }
  }

  // Default supportive response
  return {
    type: "text",
    content: `Thank you for sharing that with me. I'm here to listen and support you through your therapy journey.

I can help you with:
- **Emotional support** - Discussing feelings, fears, or concerns
- **Relaxation techniques** - Guided breathing and calming exercises
- **CBT guidance** - Working through unhelpful thoughts
- **Pelvic floor education** - Understanding and relaxing muscles
- **Therapy exercises** - Step-by-step therapeutic techniques

What would be most helpful for you right now? You can also tap one of the quick topics below to get started.

Remember: Everything you share here is confidential, and there's no judgment. You're taking a brave step by being here.`,
  }
}

// Breathing Animation Component
function BreathingAnimation({ isActive }: { isActive: boolean }) {
  const [phase, setPhase] = useState<"inhale" | "hold" | "exhale">("inhale")
  const [counter, setCounter] = useState(4)

  useEffect(() => {
    if (!isActive) return

    const phases = [
      { name: "inhale" as const, duration: 4 },
      { name: "hold" as const, duration: 4 },
      { name: "exhale" as const, duration: 6 },
    ]
    let currentPhaseIndex = 0
    let count = phases[0].duration

    const interval = setInterval(() => {
      count--
      setCounter(count)

      if (count <= 0) {
        currentPhaseIndex = (currentPhaseIndex + 1) % phases.length
        count = phases[currentPhaseIndex].duration
        setPhase(phases[currentPhaseIndex].name)
        setCounter(count)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [isActive])

  if (!isActive) return null

  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div
        className={cn(
          "size-32 rounded-full flex items-center justify-center transition-all duration-1000",
          phase === "inhale" && "scale-125 bg-blue-100 border-4 border-blue-400",
          phase === "hold" && "scale-125 bg-emerald-100 border-4 border-emerald-400",
          phase === "exhale" && "scale-100 bg-blue-50 border-4 border-blue-300"
        )}
      >
        <div className="text-center">
          <p className="text-2xl font-bold text-foreground">{counter}</p>
          <p className="text-sm text-muted-foreground capitalize">{phase}</p>
        </div>
      </div>
      <p className="mt-4 text-sm text-muted-foreground">
        {phase === "inhale" && "Breathe in slowly through your nose..."}
        {phase === "hold" && "Hold gently..."}
        {phase === "exhale" && "Exhale slowly through your mouth..."}
      </p>
    </div>
  )
}

// Progress Summary Widget
function ProgressSummaryWidget() {
  return (
    <div className="bg-card rounded-xl border border-border p-4">
      <h3 className="font-semibold text-sm text-foreground mb-3 flex items-center gap-2">
        <BarChart3 className="size-4" />
        Your Progress
      </h3>
      <div className="space-y-4">
        {/* Recovery Score */}
        <div className="text-center">
          <div className="relative size-20 mx-auto">
            <svg className="size-20 -rotate-90" viewBox="0 0 36 36">
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
                strokeDasharray="72, 100"
                className="text-emerald-500"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg font-bold text-foreground">72%</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-1">Recovery Score</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-secondary/50 rounded-lg p-2 text-center">
            <div className="flex items-center justify-center gap-1">
              <TrendingUp className="size-3 text-emerald-500" />
              <span className="text-sm font-semibold text-foreground">12</span>
            </div>
            <p className="text-xs text-muted-foreground">Day Streak</p>
          </div>
          <div className="bg-secondary/50 rounded-lg p-2 text-center">
            <div className="flex items-center justify-center gap-1">
              <Calendar className="size-3 text-primary" />
              <span className="text-sm font-semibold text-foreground">24</span>
            </div>
            <p className="text-xs text-muted-foreground">Sessions</p>
          </div>
        </div>

        {/* Daily Progress */}
        <div>
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-muted-foreground">Today&apos;s Exercises</span>
            <span className="font-medium text-foreground">3/4</span>
          </div>
          <Progress value={75} className="h-1.5" />
        </div>

        <Link
          href="/dashboard/progress"
          className="flex items-center justify-center gap-1 text-xs text-primary hover:underline"
        >
          View Full Progress
          <ChevronRight className="size-3" />
        </Link>
      </div>
    </div>
  )
}

export default function TherapyAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Hello! I'm here to help you with healthcare guidance, emotional support, and therapy exercises. Everything you share is private and confidential.\n\nHow are you feeling today? You can tell me what's on your mind, or choose a topic below to get started.",
      timestamp: new Date(),
      type: "text",
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null)
  const [showBreathing, setShowBreathing] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: content.trim(),
      timestamp: new Date(),
      type: "text",
    }
    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    // Simulate AI thinking
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Generate AI response
    const response = generateAIResponse(content)

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: response.content,
      timestamp: new Date(),
      type: response.type,
    }
    setMessages((prev) => [...prev, assistantMessage])
    setIsTyping(false)

    // Show breathing animation for breathing exercises
    if (response.type === "breathing") {
      setShowBreathing(true)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSendMessage(inputValue)
  }

  const handleQuickPrompt = (prompt: string) => {
    handleSendMessage(prompt)
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <MessageCircle className="size-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-serif font-semibold text-foreground">
              AI Therapy Assistant
            </h1>
            <p className="text-sm text-muted-foreground">
              A safe space to talk about health care, feelings, emotions, and wellness
            </p>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mt-4">
          <p className="text-xs text-amber-800">
            <Shield className="size-3 inline mr-1" />
            This AI assistant provides educational and emotional support for healthcare, feelings, emotions, and human-related topics. It is not a substitute for professional medical treatment.
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Left Sidebar - Topics & Progress */}
        <div className="lg:col-span-1 space-y-4">
          {/* Progress Summary */}
          <ProgressSummaryWidget />

          {/* Therapy Topics */}
          <div className="bg-card rounded-xl border border-border p-4">
            <h3 className="font-semibold text-sm text-foreground mb-3 flex items-center gap-2">
              <Lightbulb className="size-4" />
              Therapy Topics
            </h3>
            <div className="space-y-2">
              {therapyTopics.map((topic) => (
                <button
                  key={topic.id}
                  onClick={() =>
                    setSelectedTopic(selectedTopic === topic.id ? null : topic.id)
                  }
                  className={cn(
                    "w-full text-left p-3 rounded-lg transition-all",
                    selectedTopic === topic.id
                      ? "bg-primary/10 border border-primary/20"
                      : "bg-secondary/50 hover:bg-secondary"
                  )}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-primary">{topic.icon}</span>
                    <span className="text-sm font-medium text-foreground">
                      {topic.label}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {topic.description}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Prompts for Selected Topic */}
          {selectedTopic && (
            <div className="bg-card rounded-xl border border-border p-4">
              <h3 className="font-semibold text-sm text-foreground mb-3">
                Suggested Questions
              </h3>
              <div className="space-y-2">
                {therapyTopics
                  .find((t) => t.id === selectedTopic)
                  ?.prompts.map((prompt, i) => (
                    <button
                      key={i}
                      onClick={() => handleQuickPrompt(prompt)}
                      className="w-full text-left text-xs p-2 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
                    >
                      {prompt}
                    </button>
                  ))}
              </div>
            </div>
          )}

          {/* Privacy Notice */}
          <div className="bg-card rounded-xl border border-border p-4">
            <h3 className="font-semibold text-sm text-foreground mb-2 flex items-center gap-2">
              <Lock className="size-4" />
              Privacy & Safety
            </h3>
            <div className="space-y-2 text-xs text-muted-foreground">
              <p className="flex items-center gap-2">
                <Shield className="size-3 text-emerald-500" />
                Encrypted conversations
              </p>
              <p className="flex items-center gap-2">
                <Circle className="size-3 text-emerald-500" />
                Anonymous by default
              </p>
              <p className="flex items-center gap-2">
                <Heart className="size-3 text-emerald-500" />
                Non-judgmental responses
              </p>
            </div>
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="lg:col-span-4">
          <div className="bg-card rounded-xl border border-border flex flex-col h-[600px]">
            {/* Chat Header */}
            <div className="p-4 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Bot className="size-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">
                    Therapy Assistant
                  </h3>
                  <span className="flex items-center gap-1 text-xs text-emerald-600">
                    <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Online - Ready to help with health, feelings & emotions
                  </span>
                </div>
              </div>
              {showBreathing && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowBreathing(false)}
                  className="text-xs"
                >
                  Stop Exercise
                </Button>
              )}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {showBreathing && <BreathingAnimation isActive={showBreathing} />}

              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex gap-3",
                    message.role === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  {message.role === "assistant" && (
                    <div className={cn(
                      "size-8 rounded-full flex items-center justify-center flex-shrink-0",
                      message.type === "off-topic" ? "bg-amber-100" : "bg-primary/10"
                    )}>
                      <Sparkles className={cn(
                        "size-4",
                        message.type === "off-topic" ? "text-amber-600" : "text-primary"
                      )} />
                    </div>
                  )}
                  <div
                    className={cn(
                      "max-w-[80%] rounded-2xl p-4",
                      message.role === "user"
                        ? "bg-primary text-primary-foreground rounded-br-md"
                        : message.type === "off-topic"
                        ? "bg-amber-50 border border-amber-200 rounded-bl-md"
                        : "bg-secondary/50 rounded-bl-md"
                    )}
                  >
                    <div
                      className={cn(
                        "text-sm whitespace-pre-wrap",
                        message.role === "assistant" && message.type !== "off-topic" && "text-foreground",
                        message.type === "off-topic" && "text-amber-900"
                      )}
                    >
                      {message.content.split("\n").map((line, i) => (
                        <p key={i} className={line.startsWith("**") ? "font-semibold mt-2" : ""}>
                          {line.replace(/\*\*/g, "")}
                        </p>
                      ))}
                    </div>
                    <p
                      className={cn(
                        "text-xs mt-2 flex items-center gap-1",
                        message.role === "user"
                          ? "text-primary-foreground/70"
                          : message.type === "off-topic"
                          ? "text-amber-700"
                          : "text-muted-foreground"
                      )}
                    >
                      <Clock className="size-3" />
                      {formatTime(message.timestamp)}
                    </p>
                  </div>
                  {message.role === "user" && (
                    <div className="size-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0 text-primary-foreground text-sm font-medium">
                      S
                    </div>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="flex gap-3">
                  <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="size-4 text-primary" />
                  </div>
                  <div className="bg-secondary/50 rounded-2xl rounded-bl-md p-4">
                    <div className="flex gap-1">
                      <span className="size-2 rounded-full bg-muted-foreground/50 animate-bounce" />
                      <span
                        className="size-2 rounded-full bg-muted-foreground/50 animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      />
                      <span
                        className="size-2 rounded-full bg-muted-foreground/50 animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-border">
              {/* Quick Action Buttons */}
              <div className="flex flex-wrap gap-2 mb-3">
                <button
                  onClick={() => handleQuickPrompt("Guide me through deep breathing")}
                  className="text-xs px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors flex items-center gap-1"
                >
                  <Wind className="size-3" />
                  Breathing Exercise
                </button>
                <button
                  onClick={() => handleQuickPrompt("I feel anxious right now")}
                  className="text-xs px-3 py-1.5 rounded-full bg-rose-50 text-rose-700 hover:bg-rose-100 transition-colors flex items-center gap-1"
                >
                  <Heart className="size-3" />
                  Feeling Anxious
                </button>
                <button
                  onClick={() => handleQuickPrompt("Help me with pelvic relaxation")}
                  className="text-xs px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors flex items-center gap-1"
                >
                  <Target className="size-3" />
                  Pelvic Relaxation
                </button>
              </div>

              <form onSubmit={handleSubmit} className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => setIsListening(!isListening)}
                  className={cn(isListening && "text-red-500 border-red-200")}
                >
                  {isListening ? (
                    <MicOff className="size-4" />
                  ) : (
                    <Mic className="size-4" />
                  )}
                </Button>
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask about health, feelings, emotions, or wellness..."
                  className="flex-1"
                  disabled={isTyping}
                  suppressHydrationWarning
                />
                <Button type="submit" disabled={!inputValue.trim() || isTyping}>
                  <Send className="size-4" />
                </Button>
              </form>
            </div>
          </div>

          {/* Smart Therapy Suggestions */}
          <div className="mt-6 bg-card rounded-xl border border-border p-4">
            <h3 className="font-semibold text-sm text-foreground mb-3 flex items-center gap-2">
              <Lightbulb className="size-4" />
              Suggested Next Steps
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Link
                href="/dashboard/screening"
                className="p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors group"
              >
                <Brain className="size-5 text-primary mb-2" />
                <p className="text-sm font-medium text-foreground">
                  Take Screening
                </p>
                <p className="text-xs text-muted-foreground">
                  Assess your symptoms
                </p>
                <ChevronRight className="size-4 text-muted-foreground mt-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/dashboard/progress"
                className="p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors group"
              >
                <Activity className="size-5 text-primary mb-2" />
                <p className="text-sm font-medium text-foreground">
                  Track Progress
                </p>
                <p className="text-xs text-muted-foreground">
                  View your journey
                </p>
                <ChevronRight className="size-4 text-muted-foreground mt-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/dashboard/progress"
                className="p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors group"
              >
                <Target className="size-5 text-primary mb-2" />
                <p className="text-sm font-medium text-foreground">
                  Therapy Exercises
                </p>
                <p className="text-xs text-muted-foreground">
                  Continue training
                </p>
                <ChevronRight className="size-4 text-muted-foreground mt-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/dashboard/progress"
                className="p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors group"
              >
                <Heart className="size-5 text-primary mb-2" />
                <p className="text-sm font-medium text-foreground">
                  Pain Tracking
                </p>
                <p className="text-xs text-muted-foreground">
                  Log your progress
                </p>
                <ChevronRight className="size-4 text-muted-foreground mt-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
