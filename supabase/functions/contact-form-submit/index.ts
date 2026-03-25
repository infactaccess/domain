// @ts-nocheck
// This is a Deno file for Supabase Edge Functions, not a Node/Next.js file.
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import nodemailer from "npm:nodemailer@6.9.9"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const body = await req.json()
        const { firstName, lastName, email, phone: phoneNumber, message, _gotcha } = body

        // 1. Anti-spam: Honeypot check
        // If the hidden honeypot field is filled out, this is likely a bot.
        // We return a "success" response so the bot thinks it succeeded and stops submitting.
        if (_gotcha) {
            console.log('Honeypot triggered, silently dropping submission.');
            return new Response(JSON.stringify({ success: true, message: 'Message sent successfully.' }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 200,
            })
        }

        // 2. Validate required fields
        if (!firstName?.trim() || !lastName?.trim() || !email?.trim() || !message?.trim()) {
            return new Response(JSON.stringify({ error: 'Missing required fields.' }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 400,
            })
        }

        // Sanitize and trim inputs
        const safeFirstName = firstName.trim()
        const safeLastName = lastName.trim()
        const safeEmail = email.trim()
        const safePhone = phoneNumber ? phoneNumber.trim() : ''
        const safeMessage = message.trim()

        // 3. Validate email format (basic regex)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(safeEmail)) {
            return new Response(JSON.stringify({ error: 'Invalid email address provided.' }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 400,
            })
        }

        // 4. Validate phone format (basic length check to prevent huge inputs)
        if (safePhone && safePhone.length > 25) {
            return new Response(JSON.stringify({ error: 'Phone number is too long.' }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 400,
            })
        }

        // Retrieve and validate SMTP configuration
        // The SMTP_PASSWORD MUST NOT be committed to git. It should be set securely via `npx supabase secrets set SMTP_PASSWORD="Infact*Access*2026"`
        const smtpPassword = Deno.env.get('SMTP_PASSWORD')

        if (!smtpPassword) {
            console.error('SMTP_PASSWORD secret is not configured.')
            return new Response(JSON.stringify({ error: 'Server configuration error.' }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 500,
            })
        }

        // 5. Configure Nodemailer transport for Hostinger
        const transporter = nodemailer.createTransport({
            host: 'smtp.hostinger.com',
            port: 465,
            secure: true, // Use SSL
            auth: {
                user: 'info@in-factaccess.com',
                pass: smtpPassword, // Use securely stored credential
            }
        })

        const fullName = `${safeFirstName} ${safeLastName}`
        const submissionTime = new Date().toISOString()
        const appName = "In-Fact Access"

        // 6. Build the email payload
        const mailOptions = {
            from: 'info@in-factaccess.com', // Must match auth user
            to: 'info@in-factaccess.com',   // Send notification back to our own inbox
            replyTo: safeEmail,             // Enables direct reply to the sender
            subject: `New Contact Form Submission - ${appName}`,
            text: `
New Contact Form Submission - ${appName}

Timestamp: ${submissionTime}

First Name: ${safeFirstName}
Last Name: ${safeLastName}
Full Name: ${fullName}
Email Address: ${safeEmail}
Phone Number: ${safePhone || 'N/A'}

Message:
${safeMessage}
      `,
            html: `
        <h2>New Contact Form Submission - ${appName}</h2>
        <p><strong>Timestamp:</strong> ${submissionTime}</p>
        <p><strong>First Name:</strong> ${safeFirstName}</p>
        <p><strong>Last Name:</strong> ${safeLastName}</p>
        <p><strong>Full Name:</strong> ${fullName}</p>
        <p><strong>Email Address:</strong> <a href="mailto:${safeEmail}">${safeEmail}</a></p>
        <p><strong>Phone Number:</strong> ${safePhone || 'N/A'}</p>
        <br/>
        <h3>Message:</h3>
        <p style="white-space: pre-wrap;">${safeMessage.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</p>
      `
        }

        // 7. Dispatch the email
        await transporter.sendMail(mailOptions)

        return new Response(JSON.stringify({ success: true, message: 'Message sent successfully.' }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
        })

    } catch (error) {
        if (error.name === 'SyntaxError') {
            return new Response(JSON.stringify({ error: 'Invalid request body.' }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 400,
            })
        }

        // Log the actual error internally (won't be exposed to the client)
        console.error('Error processing contact form submission:', error)

        // Return a generic error to the frontend
        return new Response(JSON.stringify({ error: 'Failed to send message. Please try again later.' }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 500,
        })
    }
})
