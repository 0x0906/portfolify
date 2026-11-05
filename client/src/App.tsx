import { lazy, Suspense } from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { AuthProvider } from "@/context/AuthContext"
import { ThemeProvider } from "@/context/ThemeContext"
import { ProtectedRoute } from "@/components/layout/ProtectedRoute"

const LandingPage = lazy(() => import("@/pages/public/LandingPage").then((m) => ({ default: m.LandingPage })))
const AboutPage = lazy(() => import("@/pages/public/AboutPage").then((m) => ({ default: m.AboutPage })))
const FeaturesPage = lazy(() => import("@/pages/public/FeaturesPage").then((m) => ({ default: m.FeaturesPage })))
const ContactPage = lazy(() => import("@/pages/public/ContactPage").then((m) => ({ default: m.ContactPage })))
const PrivacyPage = lazy(() => import("@/pages/public/PrivacyPage").then((m) => ({ default: m.PrivacyPage })))
const TermsPage = lazy(() => import("@/pages/public/TermsPage").then((m) => ({ default: m.TermsPage })))
const TemplatesPage = lazy(() => import("@/pages/templates/TemplatesPage").then((m) => ({ default: m.TemplatesPage })))
const TemplatePreviewStandalone = lazy(() => import("@/pages/preview/TemplatePreviewStandalone").then((m) => ({ default: m.TemplatePreviewStandalone })))
const SignUpPage = lazy(() => import("@/pages/auth/SignUpPage").then((m) => ({ default: m.SignUpPage })))
const SignInPage = lazy(() => import("@/pages/auth/SignInPage").then((m) => ({ default: m.SignInPage })))
const ForgotPasswordPage = lazy(() => import("@/pages/auth/ForgotPasswordPage").then((m) => ({ default: m.ForgotPasswordPage })))
const ResetPasswordPage = lazy(() => import("@/pages/auth/ResetPasswordPage").then((m) => ({ default: m.ResetPasswordPage })))
const VerifyEmailPage = lazy(() => import("@/pages/auth/VerifyEmailPage").then((m) => ({ default: m.VerifyEmailPage })))
const VerificationSentPage = lazy(() => import("@/pages/auth/VerificationSentPage").then((m) => ({ default: m.VerificationSentPage })))
const AuthErrorPage = lazy(() => import("@/pages/auth/AuthErrorPage").then((m) => ({ default: m.AuthErrorPage })))
const DashboardPage = lazy(() => import("@/pages/dashboard/DashboardPage").then((m) => ({ default: m.DashboardPage })))
const SettingsPage = lazy(() => import("@/pages/settings/SettingsPage").then((m) => ({ default: m.SettingsPage })))
const EditorPage = lazy(() => import("@/pages/editor/EditorPage").then((m) => ({ default: m.EditorPage })))
const PreviewPage = lazy(() => import("@/pages/preview/PreviewPage").then((m) => ({ default: m.PreviewPage })))
const PublicPortfolioPage = lazy(() => import("@/pages/public/PublicPortfolioPage").then((m) => ({ default: m.PublicPortfolioPage })))
const NotFoundPage = lazy(() => import("@/pages/public/NotFoundPage").then((m) => ({ default: m.NotFoundPage })))
const ServerErrorPage = lazy(() => import("@/pages/public/ServerErrorPage").then((m) => ({ default: m.ServerErrorPage })))
const UnauthorizedPage = lazy(() => import("@/pages/public/UnauthorizedPage").then((m) => ({ default: m.UnauthorizedPage })))
const MaintenancePage = lazy(() => import("@/pages/public/MaintenancePage").then((m) => ({ default: m.MaintenancePage })))

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <Router>
            <Suspense
              fallback={
                <div className="min-h-screen flex items-center justify-center bg-[var(--color-paper)] text-[var(--color-muted)] text-sm font-mono">
                  Loading…
                </div>
              }
            >
              <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/features" element={<FeaturesPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/terms" element={<TermsPage />} />

            <Route path="/templates" element={<TemplatesPage />} />
            <Route path="/preview-template/:templateId" element={<TemplatePreviewStandalone />} />

            <Route path="/sign-up" element={<SignUpPage />} />
            <Route path="/register" element={<SignUpPage />} />
            <Route path="/sign-in" element={<SignInPage />} />
            <Route path="/login" element={<SignInPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/verify-email" element={<VerifyEmailPage />} />
            <Route path="/verification-sent" element={<VerificationSentPage />} />
            <Route path="/auth/error" element={<AuthErrorPage />} />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <SettingsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/editor"
              element={
                <ProtectedRoute>
                  <EditorPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/editor/:id"
              element={
                <ProtectedRoute>
                  <EditorPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/preview"
              element={
                <ProtectedRoute>
                  <PreviewPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/preview/:id"
              element={
                <ProtectedRoute>
                  <PreviewPage />
                </ProtectedRoute>
              }
            />

            <Route path="/500" element={<ServerErrorPage />} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />
            <Route path="/maintenance" element={<MaintenancePage />} />

            <Route path="/:username" element={<PublicPortfolioPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </Router>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
  )
}

export default App
