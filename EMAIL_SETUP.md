# Setting up Email Functionality

## Using a Free SMTP Service

This project uses nodemailer with a free SMTP service for sending emails from the contact form.

### Option 1: Ethereal.email (Recommended for Testing)

1. Visit [https://ethereal.email/](https://ethereal.email/) and create a free account
2. Copy your SMTP credentials from your Ethereal account dashboard
3. Create a `.env` file in your project root with the following content:
   ```
   SMTP_USER=your-ethereal-email@ethereal.email
   SMTP_PASS=your-ethereal-password
   CONTACT_EMAIL=your-receiving-email@example.com
   ```
4. Replace the placeholder values with your actual credentials

### Option 2: Gmail (with App Password)

1. Enable 2-factor authentication on your Google account
2. Generate an App Password at [https://myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
3. Create a `.env` file with:
   ```
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=your-gmail@gmail.com
   SMTP_PASS=your-16-digit-app-password
   CONTACT_EMAIL=your-receiving-email@example.com
   ```

### Option 3: Outlook/Hotmail

1. Create a `.env` file with:
   ```
   SMTP_HOST=smtp-mail.outlook.com
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=your-outlook-email@outlook.com
   SMTP_PASS=your-password
   CONTACT_EMAIL=your-receiving-email@example.com
   ```

### Option 4: Mailgun (Free Tier Available)

1. Sign up at [https://www.mailgun.com/](https://www.mailgun.com/)
2. Create a `.env` file with:
   ```
   SMTP_HOST=smtp.mailgun.org
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=your-mailgun-smtp-username
   SMTP_PASS=your-mailgun-smtp-password
   CONTACT_EMAIL=your-receiving-email@example.com
   ```

### Environment Variables

The application uses the following environment variables:

- `SMTP_HOST`: SMTP server hostname (optional, defaults to Ethereal)
- `SMTP_PORT`: SMTP server port (optional, defaults to 587)
- `SMTP_SECURE`: Whether to use secure connection (optional, defaults to false)
- `SMTP_USER`: Your SMTP username
- `SMTP_PASS`: Your SMTP password
- `CONTACT_EMAIL`: The email address where contact form submissions should be sent

## Production Considerations

For production use, consider:
- Using a paid SMTP service with higher sending limits (SendGrid, Amazon SES, etc.)
- Setting up proper email authentication (SPF, DKIM)
- Adding rate limiting to prevent spam
- Implementing proper error handling and logging
- Using environment variables for all sensitive configuration