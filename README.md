# Project Setup Guide

## Environment Variables

To run this project, you will need to set up the following environment variables in your `.env` file. Below is a template with placeholder values - replace them with your actual credentials.

```env
# Database Configuration
DATABASE_URL="[your-mongodb-connection-string]"

# Authentication
NEXTAUTH_SECRET="[your-nextauth-secret]"
NEXTAUTH_URL="http://localhost:3000"

# Google Authentication
GOOGLE_API_KEY="[your-google-api-key]"
GOOGLE_CLIENT_ID="[your-google-client-id]"
GOOGLE_CLIENT_SECRET_KEY="[your-google-client-secret]"
GOOGLE_URI="[your-google-oauth-uri]"

# GitHub Authentication
GITHUB_CLIENT_ID="[your-github-client-id]"
GITHUB_SECRET_KEY="[your-github-secret]"

# Maps & Location Services
GOOGLE_MAP_API_KEY="[your-google-maps-api-key]"

# Uber Integration
UBER_CLIENT_SECRET_KEY="[your-uber-client-secret]"

# Email Configuration
RESEND_API_KEY="[your-resend-api-key]"
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER="[your-email]"
EMAIL_SERVER_PASSWORD="[your-email-app-password]"
EMAIL_USER="[your-email]"

# File Upload Configuration
UPLOADTHING_TOKEN="[your-uploadthing-token]"
UPLOADTHING_SECRET="[your-uploadthing-secret]"
UPLOADTHING_APP_ID="[your-uploadthing-app-id]"

# Video Streaming (Mux)
MUX_TOKEN_ID="[your-mux-token-id]"
MUX_TOKEN_SECRET="[your-mux-token-secret]"
```

## Features

This project includes:
- MongoDB Database integration
- NextAuth.js authentication with Google and GitHub providers
- Google Maps integration
- Uber API integration
- Email functionality using Gmail SMTP
- File upload capabilities using UploadThing
- Video streaming using Mux
- Location services integration

## Getting Started

1. Clone the repository
2. Create a `.env` file in the root directory
3. Fill in the environment variables with your credentials
4. Install dependencies:
   ```bash
   npm install
   ```
5. Run the development server:
   ```bash
   npm run dev
   ```

## Security Notes

- Never commit the `.env` file to version control
- Keep your API keys and secrets secure
- Regularly rotate your credentials
- Use appropriate access controls and restrictions for your API keys

## Required Services

To fully utilize this application, you'll need accounts with:
- MongoDB Atlas
- Google Cloud Platform
- GitHub (for OAuth)
- Uber Developer Platform
- UploadThing
- Mux
- Gmail (for SMTP)

## Additional Setup

### MongoDB
- Create a MongoDB Atlas cluster
- Configure network access and database user
- Copy the connection string to DATABASE_URL

### Google Setup
1. Create a project in Google Cloud Console
2. Enable necessary APIs (Maps, OAuth)
3. Configure OAuth consent screen
4. Create credentials and copy them to the appropriate environment variables

### Email Configuration
1. Enable 2-factor authentication in your Gmail account
2. Generate an app password
3. Use the app password in EMAIL_SERVER_PASSWORD

## Support

For any additional help or questions, please refer to the documentation of each service:
- [NextAuth.js Documentation](https://next-auth.js.org/)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Google Cloud Documentation](https://cloud.google.com/docs)
- [UploadThing Documentation](https://uploadthing.com/docs)
- [Mux Documentation](https://docs.mux.com/)
