"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Brain,
  ChevronLeft,
  ChevronRight,
  Shield,
  Lock,
  Heart,
  Activity,
  MessageCircle,
  Dumbbell,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Info,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

// Question categories and questions
const questionCategories = [
  {
    id: "pain",
    title: "Pain Assessment",
    description: "Questions related to your pain experience",
    questions: [
      {
        id: "pain_1",
        question: "Do you experience pain during vaginal penetration?",
        type: "single",
        options: ["Never", "Rarely", "Sometimes", "Often", "Always"],
      },
      {
        id: "pain_2",
        question: "How severe is the pain on a scale of 1-10?",
        type: "scale",
        min: 1,
        max: 10,
      },
      {
        id: "pain_3",
        question: "When does the pain occur?",
        type: "single",
        options: [
          "Before penetration",
          "During penetration",
          "After penetration",
          "Throughout",
        ],
      },
    ],
  },
  {
    id: "muscle",
    title: "Muscle Response Indicators",
    description: "Questions to detect pelvic muscle reactions",
    questions: [
      {
        id: "muscle_1",
        question:
          "Do your pelvic muscles tighten automatically during penetration attempts?",
        type: "single",
        options: ["Never", "Sometimes", "Often", "Always"],
      },
      {
        id: "muscle_2",
        question: "Do you feel involuntary muscle spasms?",
        type: "single",
        options: ["Never", "Sometimes", "Often", "Always"],
      },
      {
        id: "muscle_3",
        question: "Do you avoid penetration due to fear of pain?",
        type: "single",
        options: ["Never", "Sometimes", "Often", "Always"],
      },
    ],
  },
  {
    id: "psychological",
    title: "Psychological Indicators",
    description: "Questions to analyze emotional factors",
    questions: [
      {
        id: "psych_1",
        question: "Do you feel anxiety or fear about vaginal penetration?",
        type: "single",
        options: ["Never", "Sometimes", "Often", "Always"],
      },
      {
        id: "psych_2",
        question: "Have you experienced negative sexual experiences in the past?",
        type: "single",
        options: ["No", "Yes, minor", "Yes, significant"],
      },
      {
        id: "psych_3",
        question: "Do you feel stress when thinking about intimacy?",
        type: "single",
        options: ["Never", "Sometimes", "Often", "Always"],
      },
    ],
  },
  {
    id: "medical",
    title: "Medical History Indicators",
    description: "Questions about your medical background",
    questions: [
      {
        id: "med_1",
        question: "Have you been diagnosed with pelvic floor dysfunction?",
        type: "single",
        options: ["No", "Yes", "Unsure"],
      },
      {
        id: "med_2",
        question: "Have you experienced vaginal infections recently?",
        type: "single",
        options: ["No", "Yes, within 3 months", "Yes, within 6 months"],
      },
      {
        id: "med_3",
        question: "Are you currently using hormone therapy?",
        type: "single",
        options: ["No", "Yes"],
      },
    ],
  },
  {
    id: "lifestyle",
    title: "Lifestyle Indicators",
    description: "Questions about your daily life",
    questions: [
      {
        id: "life_1",
        question: "What is your current stress level?",
        type: "single",
        options: ["Low", "Moderate", "High", "Very High"],
      },
      {
        id: "life_2",
        question: "How would you describe your physical activity level?",
        type: "single",
        options: ["Sedentary", "Light", "Moderate", "Active"],
      },
      {
        id: "life_3",
        question: "How is your sleep quality?",
        type: "single",
        options: ["Poor", "Fair", "Good", "Excellent"],
      },
    ],
  },
]

// Flatten all questions for navigation
const allQuestions = questionCategories.flatMap((cat) =>
  cat.questions.map((q) => ({ ...q, categoryId: cat.id, categoryTitle: cat.title }))
)

interface ConditionResult {
  name: string
  score: number
  level: "High" | "Moderate" | "Low"
  explanation: string
}

export default function ScreeningPage() {
  const [currentStep, setCurrentStep] = useState(0) // 0 = intro, 1-n = questions, last = results
  const [answers, setAnswers] = useState<Record<string, string | number>>({})
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [results, setResults] = useState<ConditionResult[] | null>(null)

  const totalQuestions = allQuestions.length
  const isIntro = currentStep === 0
  const isResults = currentStep === totalQuestions + 1
  const currentQuestion = !isIntro && !isResults ? allQuestions[currentStep - 1] : null

  const progress = isIntro ? 0 : isResults ? 100 : (currentStep / totalQuestions) * 100

  const handleAnswer = (value: string | number) => {
    if (currentQuestion) {
      setAnswers((prev) => ({ ...prev, [currentQuestion.id]: value }))
    }
  }

  const canProceed = () => {
    if (isIntro) return true
    if (isResults) return false
    return currentQuestion && answers[currentQuestion.id] !== undefined
  }

  const handleNext = async () => {
    if (currentStep === totalQuestions) {
      // Analyze results
      setIsAnalyzing(true)
      await new Promise((resolve) => setTimeout(resolve, 2000))
      
      // Calculate risk scores based on answers
      const calculatedResults = calculateResults(answers)
      setResults(calculatedResults)
      setIsAnalyzing(false)
      setCurrentStep(currentStep + 1)
    } else {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const calculateResults = (ans: Record<string, string | number>): ConditionResult[] => {
    // Simplified risk calculation logic
    let vaginismusScore = 0
    let dyspareuniaScore = 0
    let pelvicScore = 0

    // Pain indicators
    const painFreq = ans["pain_1"]
    if (painFreq === "Always" || painFreq === "Often") {
      vaginismusScore += 20
      dyspareuniaScore += 25
    } else if (painFreq === "Sometimes") {
      vaginismusScore += 10
      dyspareuniaScore += 15
    }

    // Pain severity
    const severity = Number(ans["pain_2"]) || 5
    vaginismusScore += severity * 2
    dyspareuniaScore += severity * 2.5

    // Muscle responses
    const muscleTightening = ans["muscle_1"]
    if (muscleTightening === "Always") {
      vaginismusScore += 25
      pelvicScore += 20
    } else if (muscleTightening === "Often") {
      vaginismusScore += 18
      pelvicScore += 15
    }

    const spasms = ans["muscle_2"]
    if (spasms === "Always" || spasms === "Often") {
      vaginismusScore += 15
      pelvicScore += 18
    }

    // Avoidance behavior
    const avoidance = ans["muscle_3"]
    if (avoidance === "Always" || avoidance === "Often") {
      vaginismusScore += 15
    }

    // Psychological factors
    const anxiety = ans["psych_1"]
    if (anxiety === "Always" || anxiety === "Often") {
      vaginismusScore += 15
    }

    // Normalize scores
    vaginismusScore = Math.min(Math.round(vaginismusScore), 100)
    dyspareuniaScore = Math.min(Math.round(dyspareuniaScore), 100)
    pelvicScore = Math.min(Math.round(pelvicScore), 100)

    const getLevel = (score: number): "High" | "Moderate" | "Low" => {
      if (score >= 65) return "High"
      if (score >= 35) return "Moderate"
      return "Low"
    }

    return [
      {
        name: "Vaginismus",
        score: vaginismusScore,
        level: getLevel(vaginismusScore),
        explanation:
          vaginismusScore >= 65
            ? "Strong muscle tightening and anxiety indicators detected"
            : vaginismusScore >= 35
            ? "Some muscle tension and avoidance patterns present"
            : "Low indicators for this condition",
      },
      {
        name: "Dyspareunia",
        score: dyspareuniaScore,
        level: getLevel(dyspareuniaScore),
        explanation:
          dyspareuniaScore >= 65
            ? "Significant pain symptoms reported during penetration"
            : dyspareuniaScore >= 35
            ? "Pain symptoms present but may have multiple causes"
            : "Low indicators for this condition",
      },
      {
        name: "Pelvic Floor Dysfunction",
        score: pelvicScore,
        level: getLevel(pelvicScore),
        explanation:
          pelvicScore >= 65
            ? "Strong indicators of pelvic muscle tension and dysfunction"
            : pelvicScore >= 35
            ? "Muscle tension reported, further evaluation recommended"
            : "Low indicators for this condition",
      },
    ]
  }

  const restartScreening = () => {
    setCurrentStep(0)
    setAnswers({})
    setResults(null)
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Brain className="size-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-serif font-semibold text-foreground">
              AI Symptom Screening
            </h1>
            <p className="text-sm text-muted-foreground">
              Answer a few confidential questions to understand possible causes of pelvic pain
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        {!isIntro && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium text-foreground">
                {isResults ? "Complete" : `${currentStep} of ${totalQuestions}`}
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}
      </div>

      <div>
        {/* Intro Screen */}
        {isIntro && (
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Welcome to the Screening Tool</CardTitle>
                <CardDescription>
                  This confidential assessment will help identify possible causes of pelvic
                  pain and guide you toward appropriate therapy options.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start gap-3 p-4 bg-secondary/50 rounded-lg">
                  <Info className="size-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    This screening tool is for educational purposes and does not replace
                    professional medical diagnosis. Please consult a healthcare provider
                    for proper evaluation.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex items-start gap-3">
                    <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Shield className="size-4 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground text-sm">Private & Secure</h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        Your responses are encrypted and confidential
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Brain className="size-4 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground text-sm">AI-Powered Analysis</h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        Advanced risk scoring for accurate insights
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Activity className="size-4 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground text-sm">Personalized Guidance</h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        Tailored recommendations based on your results
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Lock className="size-4 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground text-sm">Anonymous Option</h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        Complete the screening without saving data
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-center">
              <Button size="lg" onClick={handleNext} className="gap-2">
                Begin Screening
                <ArrowRight className="size-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Question Screen */}
        {currentQuestion && !isAnalyzing && (
          <div className="space-y-6">
            <div className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">{currentQuestion.categoryTitle}</span>
              {" • "}
              Question {currentStep} of {totalQuestions}
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg leading-relaxed">
                  {currentQuestion.question}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {currentQuestion.type === "single" && currentQuestion.options && (
                  <RadioGroup
                    value={answers[currentQuestion.id]?.toString() || ""}
                    onValueChange={handleAnswer}
                    className="gap-3"
                  >
                    {currentQuestion.options.map((option) => (
                      <div
                        key={option}
                        className={cn(
                          "flex items-center gap-3 p-4 rounded-lg border transition-all cursor-pointer",
                          answers[currentQuestion.id] === option
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50 hover:bg-secondary/50"
                        )}
                        onClick={() => handleAnswer(option)}
                      >
                        <RadioGroupItem value={option} id={option} />
                        <Label
                          htmlFor={option}
                          className="flex-1 cursor-pointer font-normal"
                        >
                          {option}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                )}

                {currentQuestion.type === "scale" && (
                  <div className="space-y-6">
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Minimal</span>
                      <span>Severe</span>
                    </div>
                    <div className="grid grid-cols-10 gap-2">
                      {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                        <button
                          key={num}
                          onClick={() => handleAnswer(num)}
                          className={cn(
                            "aspect-square rounded-lg border text-sm font-medium transition-all",
                            answers[currentQuestion.id] === num
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-border hover:border-primary/50 hover:bg-secondary/50 text-foreground"
                          )}
                        >
                          {num}
                        </button>
                      ))}
                    </div>
                    {answers[currentQuestion.id] && (
                      <p className="text-center text-sm text-muted-foreground">
                        Selected: <span className="font-medium text-foreground">{answers[currentQuestion.id]}</span>
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex justify-between">
              <Button variant="outline" onClick={handleBack} className="gap-2">
                <ChevronLeft className="size-4" />
                Back
              </Button>
              <Button onClick={handleNext} disabled={!canProceed()} className="gap-2">
                {currentStep === totalQuestions ? "View Results" : "Next"}
                <ChevronRight className="size-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Analyzing Screen */}
        {isAnalyzing && (
          <div className="flex flex-col items-center justify-center py-16 space-y-6">
            <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center animate-pulse">
              <Brain className="size-8 text-primary" />
            </div>
            <div className="text-center space-y-2">
              <h2 className="text-xl font-semibold text-foreground">Analyzing Your Responses</h2>
              <p className="text-muted-foreground">
                Our AI is processing your answers to provide personalized insights...
              </p>
            </div>
            <Progress value={66} className="w-64 h-2" />
          </div>
        )}

        {/* Results Screen */}
        {isResults && results && (
          <div className="space-y-8">
            {/* Risk Scores */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="size-5" />
                  AI Risk Scoring Results
                </CardTitle>
                <CardDescription>
                  Based on your responses, here are the calculated risk scores for each condition
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {results.map((result) => (
                  <div key={result.name} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-foreground">{result.name}</span>
                      <span
                        className={cn(
                          "text-sm font-medium px-2 py-0.5 rounded",
                          result.level === "High"
                            ? "bg-destructive/10 text-destructive"
                            : result.level === "Moderate"
                            ? "bg-amber-500/10 text-amber-600"
                            : "bg-emerald-500/10 text-emerald-600"
                        )}
                      >
                        {result.level} Risk
                      </span>
                    </div>
                    <div className="relative">
                      <Progress
                        value={result.score}
                        className={cn(
                          "h-3",
                          result.level === "High"
                            ? "[&>div]:bg-destructive"
                            : result.level === "Moderate"
                            ? "[&>div]:bg-amber-500"
                            : "[&>div]:bg-emerald-500"
                        )}
                      />
                      <span className="absolute right-0 -top-6 text-sm font-semibold text-foreground">
                        {result.score}%
                      </span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Differential Analysis */}
            <Card>
              <CardHeader>
                <CardTitle>Possible Condition Indicators</CardTitle>
                <CardDescription>
                  Comparison of symptoms across multiple conditions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 font-medium text-foreground">Condition</th>
                        <th className="text-left py-3 font-medium text-foreground">Probability</th>
                        <th className="text-left py-3 font-medium text-foreground">Explanation</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.map((result) => (
                        <tr key={result.name} className="border-b border-border last:border-0">
                          <td className="py-4 font-medium text-foreground">{result.name}</td>
                          <td className="py-4">
                            <span
                              className={cn(
                                "inline-flex items-center gap-1",
                                result.level === "High"
                                  ? "text-destructive"
                                  : result.level === "Moderate"
                                  ? "text-amber-600"
                                  : "text-emerald-600"
                              )}
                            >
                              {result.level === "High" ? (
                                <AlertCircle className="size-4" />
                              ) : (
                                <CheckCircle2 className="size-4" />
                              )}
                              {result.level}
                            </span>
                          </td>
                          <td className="py-4 text-muted-foreground">{result.explanation}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Personalized Guidance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="size-5" />
                  Recommended Support Options
                </CardTitle>
                <CardDescription>
                  Based on your results, we recommend the following next steps
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  <Link
                    href="/dashboard/therapy"
                    className="flex items-center gap-3 p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-secondary/50 transition-all group"
                  >
                    <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                      <Dumbbell className="size-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-foreground text-sm">
                        Pelvic Floor Relaxation
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        Guided exercises for muscle relaxation
                      </p>
                    </div>
                    <ArrowRight className="size-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                  </Link>

                  <Link
                    href="/dashboard/therapy"
                    className="flex items-center gap-3 p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-secondary/50 transition-all group"
                  >
                    <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                      <Brain className="size-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-foreground text-sm">
                        CBT-based Anxiety Therapy
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        Cognitive behavioral techniques
                      </p>
                    </div>
                    <ArrowRight className="size-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                  </Link>

                  <Link
                    href="/dashboard/progress"
                    className="flex items-center gap-3 p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-secondary/50 transition-all group"
                  >
                    <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                      <Activity className="size-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-foreground text-sm">
                        Track Pain & Progress
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        Monitor your therapy journey
                      </p>
                    </div>
                    <ArrowRight className="size-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                  </Link>

                  <Link
                    href="/dashboard/therapy"
                    className="flex items-center gap-3 p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-secondary/50 transition-all group"
                  >
                    <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                      <MessageCircle className="size-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-foreground text-sm">
                        AI Therapy Assistant
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        24/7 supportive conversations
                      </p>
                    </div>
                    <ArrowRight className="size-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Privacy Notice */}
            <Card className="bg-secondary/30 border-dashed">
              <CardContent className="py-4">
                <div className="flex items-start gap-3">
                  <Lock className="size-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-foreground text-sm">Privacy & Safety</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Your responses are private and encrypted. No personal information will be
                      shared without your consent. This screening is for educational purposes only.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="outline" onClick={restartScreening} className="gap-2">
                <ChevronLeft className="size-4" />
                Retake Screening
              </Button>
              <Link href="/dashboard">
                <Button className="w-full sm:w-auto gap-2">
                  Return to Dashboard
                  <ArrowRight className="size-4" />
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
