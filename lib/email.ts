import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'saad.naveed.dev@gmail.com',
    pass: 'drfw rnpt yich cwwi'
  }
})

export async function sendPasswordResetEmail(email: string, resetToken: string) {
  try {
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/reset?token=${resetToken}`
    
    const mailOptions = {
      from: 'saad.naveed.dev@gmail.com',
      to: email,
      subject: 'Password Reset - Brain MRI Platform',
      html: `
        <h2>Password Reset Request</h2>
        <p>You requested a password reset for your Brain MRI Platform account.</p>
        <p>Click the link below to reset your password:</p>
        <a href="${resetUrl}" style="background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
      `
    }

    console.log('Sending email with options:', { to: email, subject: mailOptions.subject })
    const result = await transporter.sendMail(mailOptions)
    console.log('Email sent result:', result.messageId)
    return result
  } catch (error) {
    console.error('Email send error:', error)
    throw error
  }
}