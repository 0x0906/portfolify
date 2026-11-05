import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"
import { authClient } from "@/services/auth-client"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { UserAvatar } from "@/components/ui/avatar"
import {
  User,
  KeyRound,
  Trash2,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  ArrowLeft,
  ShieldCheck,
} from "lucide-react"

export function SettingsPage() {
  const navigate = useNavigate()
  const { user, signOut, refreshSession } = useAuth()

  const [name, setName] = useState(user?.name || "")
  const [image, setImage] = useState(user?.image || "")
  const [profileLoading, setProfileLoading] = useState(false)
  const [profileFeedback, setProfileFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null)

  useEffect(() => {
    if (user) {
      setName(user.name || "")
      setImage(user.image || "")
    }
  }, [user])

  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [passwordFeedback, setPasswordFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const [deleteConfirmation, setDeleteConfirmation] = useState("")
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    setProfileLoading(true)
    setProfileFeedback(null)

    const cleanImage = image.trim()

    try {
      const response = await (authClient as any).updateUser({
        name: name.trim(),
        image: cleanImage || null,
      })

      if (response && response.error) {
        setProfileFeedback({ type: "error", text: response.error.message || "Failed to update profile." })
      } else {
        await refreshSession()
        setProfileFeedback({ type: "success", text: "Profile updated successfully." })
      }
    } catch {
      setProfileFeedback({ type: "error", text: "Error updating profile. Please try again." })
    } finally {
      setProfileLoading(false)
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordFeedback(null)

    if (newPassword.length < 8) {
      setPasswordFeedback({ type: "error", text: "New password must be at least 8 characters long." })
      return
    }

    if (newPassword !== confirmPassword) {
      setPasswordFeedback({ type: "error", text: "New passwords do not match." })
      return
    }

    setPasswordLoading(true)

    try {
      const response = await (authClient as any).changePassword({
        currentPassword,
        newPassword,
        revokeOtherSessions: true,
      })

      if (response && response.error) {
        setPasswordFeedback({ type: "error", text: response.error.message || "Current password incorrect." })
      } else {
        setPasswordFeedback({ type: "success", text: "Password changed successfully." })
        setCurrentPassword("")
        setNewPassword("")
        setConfirmPassword("")
      }
    } catch {
      setPasswordFeedback({ type: "error", text: "An error occurred while changing password." })
    } finally {
      setPasswordLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== "DELETE") {
      setDeleteError("Please type DELETE to confirm.")
      return
    }

    setDeleteLoading(true)
    setDeleteError(null)

    try {
      const response = await (authClient as any).deleteUser()
      if (response && response.error) {
        setDeleteError(response.error.message || "Failed to delete account.")
      } else {
        await signOut()
        navigate("/")
      }
    } catch {
      setDeleteError("Error deleting account. Please try again.")
    } finally {
      setDeleteLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-paper)] text-[var(--color-ink)]">
      <Navbar />

      <main className="flex-1 py-10 sm:py-12">
        <div className="container mx-auto px-4 sm:px-6 max-w-4xl space-y-8">
          <div className="flex items-center justify-between pb-6 border-b border-[var(--color-rule)]">
            <div>
              <Button
                variant="ghost"
                size="sm"
                className="gap-1 mb-2 -ml-2 text-xs"
                onClick={() => navigate("/dashboard")}
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Back to Dashboard
              </Button>
              <h1 className="font-display font-semibold text-2xl sm:text-3xl tracking-tight text-[var(--color-ink)]">
                Account settings
              </h1>
              <p className="text-xs sm:text-sm text-[var(--color-muted)] mt-1">
                Manage your credentials, security preferences, and personal details.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <Card className="rounded-card border border-[var(--color-rule)] bg-[var(--color-paper-2)]">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-input bg-[var(--color-paper)] border border-[var(--color-rule)] flex items-center justify-center text-[var(--color-accent)]">
                    <User className="h-4 w-4" />
                  </div>
                  <div>
                    <CardTitle className="text-base sm:text-lg">Profile information</CardTitle>
                    <CardDescription>Update your display name, profile picture link, and view account status</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpdateProfile} className="space-y-4 max-w-md">
                  {profileFeedback && (
                    <div
                      className={`p-3 rounded-input text-xs flex items-center gap-2 ${
                        profileFeedback.type === "success"
                          ? "bg-[var(--color-paper)] text-[var(--color-success)] border border-emerald-500/30"
                          : "bg-[var(--color-paper)] text-[var(--color-error)] border border-[var(--color-error)]"
                      }`}
                    >
                      {profileFeedback.type === "success" ? (
                        <CheckCircle2 className="h-4 w-4 text-[var(--color-success)] shrink-0" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-[var(--color-error)] shrink-0" />
                      )}
                      <span>{profileFeedback.text}</span>
                    </div>
                  )}

                  
                  <div className="flex items-center gap-3.5 p-3 rounded-input bg-[var(--color-paper)] border border-[var(--color-rule)]">
                    <UserAvatar
                      src={image}
                      name={name || user?.name || user?.email}
                      size="lg"
                      className="ring-1 ring-[var(--color-rule-2)]"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-[var(--color-ink)] truncate">
                        {name.trim() || user?.name || "Your Name"}
                      </p>
                      <p className="text-[11px] text-[var(--color-muted)] truncate mt-0.5">
                        {image.trim() ? "Profile picture preview" : "Default profile icon (no image URL set)"}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-medium text-[var(--color-ink)]">Email address</label>
                    <div className="flex items-center gap-2">
                      <Input value={user?.email || ""} disabled className="bg-[var(--color-paper-3)] text-[var(--color-muted)] font-mono text-xs" />
                      {user?.emailVerified ? (
                        <Badge variant="success" className="gap-1 shrink-0">
                          <ShieldCheck className="h-3 w-3" />
                          Verified
                        </Badge>
                      ) : (
                        <Badge variant="destructive" className="shrink-0">Unverified</Badge>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-medium text-[var(--color-ink)]">Full name</label>
                    <Input
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      disabled={profileLoading}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label htmlFor="profile-image-input" className="block text-xs font-medium text-[var(--color-ink)]">
                        Profile picture link (URL)
                      </label>
                      {image.trim() && (
                        <button
                          type="button"
                          onClick={() => setImage("")}
                          className="text-[11px] text-[var(--color-muted)] hover:text-[var(--color-ink)] underline cursor-pointer"
                        >
                          Clear link
                        </button>
                      )}
                    </div>
                    <Input
                      id="profile-image-input"
                      type="url"
                      placeholder="https://example.com/avatar.jpg"
                      value={image}
                      onChange={(e) => setImage(e.target.value)}
                      disabled={profileLoading}
                    />
                    <p className="text-[11px] text-[var(--color-muted)]">
                      Paste a direct image link (PNG, JPG, WebP, SVG) to display beside your name.
                    </p>
                  </div>

                  <Button type="submit" size="sm" disabled={profileLoading}>
                    {profileLoading ? "Saving…" : "Save changes"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card className="rounded-card border border-[var(--color-rule)] bg-[var(--color-paper-2)]">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-input bg-[var(--color-paper)] border border-[var(--color-rule)] flex items-center justify-center text-[var(--color-accent)]">
                    <KeyRound className="h-4 w-4" />
                  </div>
                  <div>
                    <CardTitle className="text-base sm:text-lg">Change password</CardTitle>
                    <CardDescription>Update your credentials to maintain account security</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
                  {passwordFeedback && (
                    <div
                      className={`p-3 rounded-input text-xs flex items-center gap-2 ${
                        passwordFeedback.type === "success"
                          ? "bg-[var(--color-paper)] text-[var(--color-success)] border border-emerald-500/30"
                          : "bg-[var(--color-paper)] text-[var(--color-error)] border border-[var(--color-error)]"
                      }`}
                    >
                      {passwordFeedback.type === "success" ? (
                        <CheckCircle2 className="h-4 w-4 shrink-0" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 shrink-0" />
                      )}
                      <span>{passwordFeedback.text}</span>
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <label className="block text-xs font-medium text-[var(--color-ink)]">Current password</label>
                    <Input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      disabled={passwordLoading}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-medium text-[var(--color-ink)]">New password</label>
                    <Input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      disabled={passwordLoading}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-medium text-[var(--color-ink)]">Confirm new password</label>
                    <Input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      disabled={passwordLoading}
                    />
                  </div>

                  <Button type="submit" size="sm" disabled={passwordLoading}>
                    {passwordLoading ? "Updating..." : "Update password"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card className="rounded-card border border-[var(--color-error)]/30 bg-[var(--color-paper-2)]">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-input bg-[var(--color-paper)] border border-[var(--color-error)] text-[var(--color-error)] flex items-center justify-center">
                    <Trash2 className="h-4 w-4" />
                  </div>
                  <div>
                    <CardTitle className="text-base sm:text-lg text-[var(--color-error)]">
                      Delete account
                    </CardTitle>
                    <CardDescription>
                      Permanently remove your account, portfolio records, and published URL
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 max-w-md">
                {deleteError && (
                  <div className="p-3 rounded-input bg-[var(--color-paper)] text-[var(--color-error)] border border-[var(--color-error)] text-xs flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 shrink-0" />
                    <span>{deleteError}</span>
                  </div>
                )}

                <p className="text-xs text-[var(--color-muted)] leading-relaxed">
                  This action cannot be undone. All associated projects, work history, and published subdomains will be purged immediately.
                </p>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-[var(--color-muted)]">
                    Type DELETE to confirm:
                  </label>
                  <Input
                    placeholder="DELETE"
                    value={deleteConfirmation}
                    onChange={(e) => setDeleteConfirmation(e.target.value)}
                    disabled={deleteLoading}
                  />
                </div>

                <Button
                  variant="destructive"
                  size="sm"
                  className="gap-2"
                  onClick={handleDeleteAccount}
                  disabled={deleteConfirmation !== "DELETE" || deleteLoading}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  {deleteLoading ? "Deleting..." : "Permanently delete account"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
