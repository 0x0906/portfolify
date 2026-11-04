import { Resend } from "resend"

const resendApiKey = process.env.RESEND_API_KEY
const emailFrom = process.env.EMAIL_FROM || "Portfolify <onboarding@resend.dev>"

const resend = resendApiKey ? new Resend(resendApiKey) : null

export async function sendVerificationEmail(to: string, verificationUrl: string) {
  console.log(`Verification email sent to: ${to} -> ${verificationUrl}`)

  if (!resend) {
    return { success: true, simulated: true }
  }

  try {
    const result = await resend.emails.send({
      from: emailFrom,
      to,
      subject: "Verify your Portfolify email address",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; rounded: 8px;">
          <h2 style="color: #0f172a; margin-bottom: 16px;">Welcome to Portfolify!</h2>
          <p style="color: #475569; font-size: 16px; line-height: 24px;">
            Please verify your email address to activate your account and start creating your developer portfolio.
          </p>
          <div style="margin: 32px 0;">
            <a href="${verificationUrl}" style="background-color: #2563eb; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block;">
              Verify Email Address
            </a>
          </div>
          <p style="color: #64748b; font-size: 14px;">
            This link is valid for a limited time. If you did not create an account with Portfolify, you can safely ignore this email.
          </p>
        </div>
      `,
    })
    return { success: true, id: result.data?.id }
  } catch (error) {
    console.error("Error sending verification email with Resend:", error)
    return { success: false, error }
  }
}

export async function sendPasswordResetEmail(to: string, resetUrl: string) {
  console.log(`Password reset email sent to: ${to} -> ${resetUrl}`)

  if (!resend) {
    return { success: true, simulated: true }
  }

  try {
    const result = await resend.emails.send({
      from: emailFrom,
      to,
      subject: "Reset your Portfolify password",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; rounded: 8px;">
          <h2 style="color: #0f172a; margin-bottom: 16px;">Reset Password Request</h2>
          <p style="color: #475569; font-size: 16px; line-height: 24px;">
            We received a request to reset your password. Click the button below to choose a new password:
          </p>
          <div style="margin: 32px 0;">
            <a href="${resetUrl}" style="background-color: #0f172a; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block;">
              Reset Password
            </a>
          </div>
          <p style="color: #64748b; font-size: 14px;">
            This link is single-use and will expire shortly. If you did not request this, please secure your account.
          </p>
        </div>
      `,
    })
    return { success: true, id: result.data?.id }
  } catch (error) {
    console.error("Error sending password reset email with Resend:", error)
    return { success: false, error }
  }
}
