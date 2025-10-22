import type { APIRoute } from 'astro';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    // Import nodemailer dynamically - proper import for nodemailer
    const nodemailerModule = await import('nodemailer');
    const nodemailer = nodemailerModule.default || nodemailerModule;
    
    // Parse the request body
    const formData = await request.json();
    
    // Extract form data
    const { firstName, lastName, company, email, projectValue, message } = formData;

    // Validate required fields
    if (!firstName || !lastName || !email || !message) {
      return new Response(
        JSON.stringify({ 
          error: 'Missing required fields' 
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Determine SMTP configuration based on environment variables
    let smtpConfig;
    
    if (import.meta.env.SMTP_HOST) {
      // Custom SMTP configuration
      smtpConfig = {
        host: import.meta.env.SMTP_HOST,
        port: parseInt(import.meta.env.SMTP_PORT || '587'),
        secure: import.meta.env.SMTP_SECURE === 'true', // true for 465, false for other ports
      };

      // Add authentication only if both user and password are provided
      if (import.meta.env.SMTP_USER && import.meta.env.SMTP_PASS) {
        smtpConfig.auth = {
          user: import.meta.env.SMTP_USER,
          pass: import.meta.env.SMTP_PASS,
        };
      }
    } else {
      // Create a test account on ethereal.email for testing
      const testAccount = await nodemailer.createTestAccount();
      smtpConfig = {
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: testAccount.user, // generated ethereal user
          pass: testAccount.pass, // generated ethereal password
        },
      };
    }

    // Create a transporter
    const transporter = nodemailer.createTransport(smtpConfig);

    // Define email options
    const mailOptions = {
      from: import.meta.env.SMTP_USER 
        ? `"Contact Form" <${import.meta.env.SMTP_USER}>`
        : `"Contact Form" <${smtpConfig.auth ? smtpConfig.auth.user : 'test@example.com'}>`, // Use test account user if available
      to: 'alandanielalvarez0000@gmail.com,reg333@regcc.net,gaxiolaomar04@gmail.com', // Send to multiple recipients
      replyTo: email, // Allow replies to go directly to the sender
      subject: `New Contact Form Submission: ${firstName} ${lastName}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>First Name:</strong> ${firstName}</p>
        <p><strong>Last Name:</strong> ${lastName}</p>
        <p><strong>Company:</strong> ${company || 'N/A'}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Investment Interest:</strong> ${projectValue || 'N/A'}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
        <hr>
        <p>This message was sent from your website contact form.</p>
      `,
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);

    // Log the test URL if using ethereal
    if (!import.meta.env.SMTP_HOST) {
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    }

    // Return success response
    return new Response(
      JSON.stringify({ 
        message: 'Email sent successfully',
        messageId: info.messageId
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error sending email:', error);
    
    // Provide more detailed error information in development
    if (process.env.NODE_ENV !== 'production') {
      console.error('SMTP Configuration:', {
        host: import.meta.env.SMTP_HOST,
        port: import.meta.env.SMTP_PORT,
        secure: import.meta.env.SMTP_SECURE,
        hasUser: !!import.meta.env.SMTP_USER,
        hasPass: !!import.meta.env.SMTP_PASS,
      });
    }
    
    return new Response(
      JSON.stringify({ 
        error: 'Failed to send email' 
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};