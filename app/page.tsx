import { LoginForm } from "@/components/login-form"
import { Sparkles } from "lucide-react"

export default function LoginPage() {
  return (
    <main className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary relative overflow-hidden">
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        <div className="relative z-10 flex flex-col justify-between p-12 text-primary-foreground w-full">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-primary-foreground/10 flex items-center justify-center backdrop-blur-sm">
              <Sparkles className="size-5" />
            </div>
            <span className="text-xl font-semibold tracking-tight">Acme</span>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col justify-center max-w-lg">
            <h1 className="text-5xl font-serif leading-tight tracking-tight text-balance">
              Welcome back to your creative space
            </h1>
            <p className="mt-6 text-lg text-primary-foreground/70 leading-relaxed">
              Sign in to access your projects, collaborate with your team, and
              bring your ideas to life.
            </p>
          </div>

          {/* Testimonial */}
          <div className="bg-primary-foreground/5 backdrop-blur-sm rounded-2xl p-6 border border-primary-foreground/10">
            <p className="text-primary-foreground/80 leading-relaxed italic">
              {
                '"This platform has transformed how we collaborate. The intuitive interface and powerful features make it a joy to use every day."'
              }
            </p>
            <div className="mt-4 flex items-center gap-3">
              <div className="size-10 rounded-full bg-primary-foreground/20 flex items-center justify-center text-sm font-medium">
                JD
              </div>
              <div>
                <p className="font-medium text-sm">Jane Doe</p>
                <p className="text-xs text-primary-foreground/60">
                  Product Designer at Scale
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-12 bg-background">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="flex lg:hidden items-center gap-3 mb-8">
            <div className="size-10 rounded-xl bg-primary flex items-center justify-center">
              <Sparkles className="size-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-semibold tracking-tight text-foreground">
              Acme
            </span>
          </div>

          <div className="bg-card rounded-2xl p-8 shadow-sm border border-border/50">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-serif font-semibold text-foreground tracking-tight">
                Sign in to your account
              </h2>
              <p className="mt-2 text-muted-foreground">
                Enter your credentials to continue
              </p>
            </div>

            <LoginForm />
          </div>

          <p className="text-center mt-6 text-sm text-muted-foreground">
            {"Don't have an account? "}
            <a
              href="#"
              className="text-foreground font-medium hover:underline underline-offset-4 transition-colors"
            >
              Create one now
            </a>
          </p>

          <p className="text-center mt-8 text-xs text-muted-foreground/60">
            By signing in, you agree to our{" "}
            <a href="#" className="underline underline-offset-2 hover:text-muted-foreground">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="underline underline-offset-2 hover:text-muted-foreground">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </main>
  )
}
