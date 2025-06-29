import { Resend } from 'resend'

// Initialize Resend only if API key is available
const resendApiKey = process.env.RESEND_API_KEY
const resend = resendApiKey ? new Resend(resendApiKey) : null

export interface EmailTemplate {
  to: string
  subject: string
  html: string
  text?: string
}

export interface EmailData {
  name?: string
  email?: string
  verificationUrl?: string
  resetUrl?: string
  quoteName?: string
  projectName?: string
  amount?: number
  currency?: string
}

// Base email template
const getBaseTemplate = (content: string, title: string) => `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f5f5f5;
    }
    .email-container {
      background: white;
      border-radius: 8px;
      padding: 30px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
      padding-bottom: 20px;
      border-bottom: 2px solid #3b82f6;
    }
    .logo {
      font-size: 24px;
      font-weight: bold;
      color: #3b82f6;
      margin-bottom: 10px;
    }
    .button {
      display: inline-block;
      background: #3b82f6;
      color: white;
      padding: 12px 24px;
      text-decoration: none;
      border-radius: 6px;
      margin: 20px 0;
      font-weight: 500;
    }
    .footer {
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
      font-size: 14px;
      color: #6b7280;
      text-align: center;
    }
    .highlight {
      background: #f0f9ff;
      padding: 15px;
      border-radius: 6px;
      border-left: 4px solid #3b82f6;
      margin: 15px 0;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <div class="logo">Code Solutions Studio</div>
      <p>Soluciones tecnológicas integrales</p>
    </div>
    
    ${content}
    
    <div class="footer">
      <p>
        <strong>Code Solutions Studio</strong><br>
        Email: info@codesolutionstudio.com.mx<br>
        Web: <a href="https://codesolutionstudio.com.mx">codesolutionstudio.com.mx</a>
      </p>
      <p><small>Si no solicitaste este email, puedes ignorarlo de forma segura.</small></p>
    </div>
  </div>
</body>
</html>
`

// Email templates
export const emailTemplates = {
  welcome: (data: EmailData): EmailTemplate => ({
    to: data.email!,
    subject: '¡Bienvenido a Code Solutions Studio!',
    html: getBaseTemplate(`
      <h2>¡Hola ${data.name || 'Usuario'}!</h2>
      <p>¡Bienvenido a <strong>Code Solutions Studio</strong>! Nos alegra tenerte con nosotros.</p>
      
      <div class="highlight">
        <h3>¿Qué puedes hacer ahora?</h3>
        <ul>
          <li>🚀 Solicitar cotizaciones para tus proyectos</li>
          <li>📊 Hacer seguimiento de tus proyectos</li>
          <li>💬 Comunicarte directamente con nuestro equipo</li>
          <li>📁 Gestionar archivos y documentos</li>
        </ul>
      </div>
      
      <p style="text-align: center;">
        <a href="${process.env.NEXTAUTH_URL}/dashboard" class="button">
          Acceder a mi Dashboard
        </a>
      </p>
      
      <p>Si tienes alguna pregunta, no dudes en contactarnos. ¡Estamos aquí para ayudarte a hacer realidad tus ideas!</p>
    `, '¡Bienvenido a Code Solutions Studio!'),
    text: `¡Hola ${data.name || 'Usuario'}! Bienvenido a Code Solutions Studio. Accede a tu dashboard en ${process.env.NEXTAUTH_URL}/dashboard`
  }),

  emailVerification: (data: EmailData): EmailTemplate => ({
    to: data.email!,
    subject: 'Verifica tu dirección de email',
    html: getBaseTemplate(`
      <h2>Verifica tu dirección de email</h2>
      <p>Hola ${data.name || 'Usuario'},</p>
      <p>Gracias por registrarte en <strong>Code Solutions Studio</strong>. Para completar tu registro, necesitamos verificar tu dirección de email.</p>
      
      <p style="text-align: center;">
        <a href="${data.verificationUrl}" class="button">
          Verificar Email
        </a>
      </p>
      
      <p><small>Este enlace expirará en 24 horas por seguridad.</small></p>
      
      <p>Si el botón no funciona, copia y pega este enlace en tu navegador:</p>
      <p style="word-break: break-all; background: #f9fafb; padding: 10px; border-radius: 4px;">
        ${data.verificationUrl}
      </p>
    `, 'Verifica tu dirección de email'),
    text: `Verifica tu email en: ${data.verificationUrl}`
  }),

  passwordReset: (data: EmailData): EmailTemplate => ({
    to: data.email!,
    subject: 'Restablecer tu contraseña',
    html: getBaseTemplate(`
      <h2>Restablecer tu contraseña</h2>
      <p>Hola ${data.name || 'Usuario'},</p>
      <p>Recibimos una solicitud para restablecer la contraseña de tu cuenta en <strong>Code Solutions Studio</strong>.</p>
      
      <p style="text-align: center;">
        <a href="${data.resetUrl}" class="button">
          Restablecer Contraseña
        </a>
      </p>
      
      <div class="highlight">
        <p><strong>⚠️ Importante:</strong></p>
        <ul>
          <li>Este enlace expirará en 1 hora</li>
          <li>Solo puedes usarlo una vez</li>
          <li>Si no solicitaste este cambio, ignora este email</li>
        </ul>
      </div>
      
      <p>Si el botón no funciona, copia y pega este enlace en tu navegador:</p>
      <p style="word-break: break-all; background: #f9fafb; padding: 10px; border-radius: 4px;">
        ${data.resetUrl}
      </p>
    `, 'Restablecer tu contraseña'),
    text: `Restablece tu contraseña en: ${data.resetUrl}`
  }),

  quoteApproved: (data: EmailData): EmailTemplate => ({
    to: data.email!,
    subject: '🎉 ¡Tu cotización ha sido aprobada!',
    html: getBaseTemplate(`
      <h2>¡Excelentes noticias!</h2>
      <p>Hola ${data.name || 'Usuario'},</p>
      <p>Tu cotización para <strong>"${data.quoteName}"</strong> ha sido aprobada y tu proyecto está listo para comenzar.</p>
      
      <div class="highlight">
        <h3>Detalles de tu proyecto:</h3>
        <p><strong>Servicio:</strong> ${data.quoteName}</p>
        <p><strong>Monto:</strong> ${data.currency} ${data.amount?.toLocaleString()}</p>
      </div>
      
      <p style="text-align: center;">
        <a href="${process.env.NEXTAUTH_URL}/dashboard" class="button">
          Ver mi Proyecto
        </a>
      </p>
      
      <p>Nuestro equipo se pondrá en contacto contigo pronto para coordinar los siguientes pasos. ¡Estamos emocionados de trabajar contigo!</p>
    `, '¡Tu cotización ha sido aprobada!'),
    text: `Tu cotización "${data.quoteName}" ha sido aprobada. Monto: ${data.currency} ${data.amount?.toLocaleString()}`
  }),

  projectUpdate: (data: EmailData): EmailTemplate => ({
    to: data.email!,
    subject: `📋 Actualización de proyecto: ${data.projectName}`,
    html: getBaseTemplate(`
      <h2>Actualización de tu proyecto</h2>
      <p>Hola ${data.name || 'Usuario'},</p>
      <p>Tu proyecto <strong>"${data.projectName}"</strong> tiene una nueva actualización.</p>
      
      <p style="text-align: center;">
        <a href="${process.env.NEXTAUTH_URL}/dashboard" class="button">
          Ver Detalles
        </a>
      </p>
      
      <p>Revisa tu dashboard para ver todos los detalles de la actualización y cualquier comentario del equipo.</p>
    `, `Actualización de proyecto: ${data.projectName}`),
    text: `Tu proyecto "${data.projectName}" tiene una nueva actualización. Ve a tu dashboard para más detalles.`
  }),

  contactFormSubmission: (data: EmailData): EmailTemplate => ({
    to: process.env.ADMIN_EMAIL || 'carlossaulcante@outlook.com',
    subject: `📝 Nuevo mensaje de contacto - ${data.name}`,
    html: getBaseTemplate(`
      <h2>Nuevo mensaje desde el formulario de contacto</h2>
      
      <div class="highlight">
        <h3>Información del contacto:</h3>
        <p><strong>Nombre:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
      </div>
      
      <p style="text-align: center;">
        <a href="${process.env.NEXTAUTH_URL}/admin" class="button">
          Ver en Panel Admin
        </a>
      </p>
      
      <p>Revisa el panel de administración para responder a este mensaje.</p>
    `, `Nuevo mensaje de contacto - ${data.name}`),
    text: `Nuevo mensaje de contacto de ${data.name} (${data.email}). Revisa el panel de administración.`
  })
}

// Main email sending function
export async function sendEmail(template: EmailTemplate): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    // Check if Resend is configured
    if (!resend) {
      console.warn('Resend not configured - email would be sent to:', template.to)
      console.warn('Subject:', template.subject)
      return {
        success: true,
        messageId: `mock-${Date.now()}`,
        error: 'Resend not configured - email simulated'
      }
    }

    const result = await resend.emails.send({
      from: 'Code Solutions Studio <noreply@codesolutionstudio.com.mx>',
      to: template.to,
      subject: template.subject,
      html: template.html,
      text: template.text,
    })

    console.log('Email sent successfully:', result.data?.id)
    return {
      success: true,
      messageId: result.data?.id
    }
  } catch (error) {
    console.error('Error sending email:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

// Convenience functions
export const sendWelcomeEmail = (email: string, name?: string) =>
  sendEmail(emailTemplates.welcome({ email, name }))

export const sendVerificationEmail = (email: string, verificationUrl: string, name?: string) =>
  sendEmail(emailTemplates.emailVerification({ email, verificationUrl, name }))

export const sendPasswordResetEmail = (email: string, resetUrl: string, name?: string) =>
  sendEmail(emailTemplates.passwordReset({ email, resetUrl, name }))

export const sendQuoteApprovedEmail = (email: string, quoteName: string, amount: number, currency: string, name?: string) =>
  sendEmail(emailTemplates.quoteApproved({ email, name, quoteName, amount, currency }))

export const sendProjectUpdateEmail = (email: string, projectName: string, name?: string) =>
  sendEmail(emailTemplates.projectUpdate({ email, name, projectName }))

export const sendContactFormNotification = (name: string, email: string) =>
  sendEmail(emailTemplates.contactFormSubmission({ name, email }))

// Additional utility functions for specific scenarios
export async function sendPaymentConfirmationEmail(
  to: string,
  name: string,
  paymentData: {
    amount: number;
    currency: string;
    projectTitle: string;
    paymentId: string;
  }
): Promise<boolean> {
  const template: EmailTemplate = {
    to,
    subject: 'Confirmación de pago recibido - Code Solutions Studio',
    html: getBaseTemplate(`
      <h2 style="color: #10b981;">¡Pago Confirmado!</h2>
      <p>Hola <strong>${name}</strong>,</p>
      
      <p>¡Excelentes noticias! Hemos recibido tu pago exitosamente.</p>
      
      <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3b82f6;">
        <h3 style="margin-top: 0; color: #1e40af;">Detalles del pago:</h3>
        <p><strong>Proyecto:</strong> ${paymentData.projectTitle}</p>
        <p><strong>Monto:</strong> $${paymentData.amount} ${paymentData.currency}</p>
        <p><strong>ID de referencia:</strong> ${paymentData.paymentId}</p>
        <p><strong>Fecha:</strong> ${new Date().toLocaleString('es-MX')}</p>
      </div>
      
      <p>Tu proyecto ya está siendo procesado y nuestro equipo se pondrá en contacto contigo pronto para coordinar los siguientes pasos.</p>
      
      <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
        <p style="margin: 0;"><strong>💡 Próximos pasos:</strong></p>
        <ul style="margin: 10px 0;">
          <li>Recibirás un email con los detalles del proyecto en las próximas 24 horas</li>
          <li>Un miembro de nuestro equipo te contactará para la reunión inicial</li>
          <li>Podrás seguir el progreso desde tu panel de usuario</li>
        </ul>
      </div>
      
      <p>Si tienes alguna pregunta, no dudes en contactarnos:</p>
      <ul>
        <li>📧 Email: hola@codesolutionstudio.com.mx</li>
        <li>📱 WhatsApp: +52 (555) 123-4567</li>
      </ul>
      
      <p>¡Gracias por confiar en Code Solutions Studio!</p>
    `, 'Confirmación de pago'),
    text: `Pago confirmado para el proyecto ${paymentData.projectTitle}. Monto: $${paymentData.amount} ${paymentData.currency}. ID: ${paymentData.paymentId}`
  }
  
  const result = await sendEmail(template)
  return result.success
}

export async function sendAdminNotificationEmail(
  subject: string,
  htmlContent: string
): Promise<boolean> {
  if (!process.env.ADMIN_EMAIL) {
    console.warn('ADMIN_EMAIL not configured');
    return false;
  }

  const template: EmailTemplate = {
    to: process.env.ADMIN_EMAIL,
    subject: `[Admin] ${subject} - Code Solutions Studio`,
    html: getBaseTemplate(`
      <h2 style="color: #dc2626;">Notificación del Sistema</h2>
      ${htmlContent}
      <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
      <p style="color: #6b7280; font-size: 14px;">
        <strong>Fecha:</strong> ${new Date().toLocaleString('es-MX')}<br>
        <strong>Sistema:</strong> Code Solutions Studio
      </p>
    `, 'Notificación Admin'),
    text: `${subject} - ${htmlContent.replace(/<[^>]*>/g, '')}`
  }
  
  const result = await sendEmail(template)
  return result.success
}
