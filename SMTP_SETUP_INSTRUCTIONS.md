# Configuring Free SMTP Service

## Setting Up Ethereal.email (Recommended for Testing)

1. **Sign up for a free account** at [https://ethereal.email/](https://ethereal.email/)
   - This service provides temporary email addresses for testing
   - No credit card required
   - Provides real SMTP credentials that work for testing

2. **Get your SMTP credentials**
   - After signing up, you'll receive an email with your test account credentials
   - Or log in to your account and go to the "SMTP & API" section

3. **Create your environment file**
   ```bash
   # In your project root, create a .env file:
   touch .env
   ```

4. **Add your credentials to the .env file**
   ```
   SMTP_USER=your-test-email@ethereal.email
   SMTP_PASS=your-test-password
   CONTACT_EMAIL=alandanielalvarez0000@gmail.com
   ```

5. **Restart your development server**
   ```bash
   pnpm run dev
   ```

## Alternative: Using Gmail with App Passwords

1. **Enable 2-factor authentication** on your Google account
2. **Generate an App Password**:
   - Go to [Google Account Settings](https://myaccount.google.com/apppasswords)
   - Select "Mail" and your device
   - Copy the 16-character generated password
3. **Use these settings in your .env file**:
   ```
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=your-gmail@gmail.com
   SMTP_PASS=your-16-character-app-password
   CONTACT_EMAIL=alandanielalvarez0000@gmail.com
   ```

## Other Free SMTP Options

### Mailtrap (Testing)
- Sign up at [https://mailtrap.io/](https://mailtrap.io/)
- Use development SMTP settings from your inbox
```
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-username
SMTP_PASS=your-password
CONTACT_EMAIL=alandanielalvarez0000@gmail.com
```

### Outlook/Hotmail
```
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@outlook.com
SMTP_PASS=your-password
CONTACT_EMAIL=alandanielalvarez0000@gmail.com
```

## Production Considerations

For production use, consider these services with free tiers:
- **SendGrid**: 100 emails/day free forever
- **Mailgun**: 10,000 emails/month free for first 3 months
- **Amazon SES**: 62,000 emails/month free for first year (requires AWS account)

To use these in production:
1. Sign up for the service
2. Verify your sending domain
3. Update your .env file with the appropriate SMTP settings
4. Remember to never commit your .env file to version control

## Troubleshooting

- Make sure your .env file is named `.env` and not `.env.txt` or similar
- Ensure your .env file is in the project root directory
- Restart your development server after adding environment variables
- Check that your .gitignore file includes `.env` to prevent committing credentials

## Testing the Setup

After configuring your SMTP service:

1. Start your development server: `pnpm run dev`
2. Go to http://localhost:4321/contact
3. Fill out the contact form with test data
4. Submit the form and check for success message
5. Check your receiving email (or Ethereal inbox) for the message