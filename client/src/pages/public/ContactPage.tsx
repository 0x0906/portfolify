import { useState } from "react"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Mail, Send, Github, MessageSquare } from "lucide-react"

export function ContactPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !email || !message) return
    const subject = encodeURIComponent(`Portfolify Feedback from ${name}`)
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)
    window.location.href = `mailto:support@portfolify.dev?subject=${subject}&body=${body}`
  }

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-paper)] text-[var(--color-ink)]">
      <Navbar />
      <main className="flex-1 py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6 max-w-3xl space-y-10">
          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-[var(--color-ink)]">
              Contact & support
            </h1>
            <p className="text-sm sm:text-base text-[var(--color-muted)] leading-relaxed">
              Questions, feedback, or custom deployment requests? Connect with our team directly.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card className="rounded-card border border-[var(--color-rule)] bg-[var(--color-paper-2)]">
              <CardContent className="p-5 flex items-start gap-3.5">
                <div className="h-9 w-9 rounded-input bg-[var(--color-paper)] border border-[var(--color-rule)] flex items-center justify-center text-[var(--color-accent)] shrink-0">
                  <Mail className="h-4 w-4" />
                </div>
                <div className="space-y-0.5">
                  <h2 className="font-display font-semibold text-sm text-[var(--color-ink)]">
                    Email
                  </h2>
                  <a
                    href="mailto:support@portfolify.dev"
                    className="text-xs text-[var(--color-muted)] hover:text-[var(--color-ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] rounded-input"
                  >
                    support@portfolify.dev
                  </a>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-card border border-[var(--color-rule)] bg-[var(--color-paper-2)]">
              <CardContent className="p-5 flex items-start gap-3.5">
                <div className="h-9 w-9 rounded-input bg-[var(--color-paper)] border border-[var(--color-rule)] flex items-center justify-center text-[var(--color-accent)] shrink-0">
                  <Github className="h-4 w-4" />
                </div>
                <div className="space-y-0.5">
                  <h2 className="font-display font-semibold text-sm text-[var(--color-ink)]">
                    Issue tracking
                  </h2>
                  <p className="text-xs text-[var(--color-muted)]">
                    Submit layout requests and bug reports on GitHub.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="rounded-card border border-[var(--color-rule)] bg-[var(--color-paper-2)] shadow-[var(--shadow-card)]">
            <CardContent className="p-6 sm:p-8 space-y-6">
              <div className="flex items-center gap-2 pb-3 border-b border-[var(--color-rule)]">
                <MessageSquare className="h-4 w-4 text-[var(--color-accent)]" />
                <h2 className="font-display font-semibold text-base text-[var(--color-ink)]">
                  Send a message
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-medium text-[var(--color-ink)]">
                      Your Name
                    </label>
                    <Input
                      required
                      placeholder="Alex Morgan"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-medium text-[var(--color-ink)]">
                      Your Email
                    </label>
                    <Input
                      required
                      type="email"
                      placeholder="alex@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-[var(--color-ink)]">
                    Message
                  </label>
                  <textarea
                    required
                    rows={5}
                    className="w-full rounded-input border border-[var(--color-rule-2)] bg-[var(--color-paper)] px-3 py-2 text-sm text-[var(--color-ink)] shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)] placeholder:text-[var(--color-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] resize-none"
                    placeholder="How can we help?"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </div>

                <Button type="submit" size="default" className="gap-2">
                  <Send className="h-3.5 w-3.5" />
                  Send message
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}
