# Google OAuth with Supabase in Next.js 15

This guide explains how to set up Google OAuth authentication using Supabase in your Next.js 15 app router project.

## Prerequisites

- A Supabase project
- A Google Cloud Platform account
- Next.js 15 app router project

## Setup Instructions

### 1. Configure Google OAuth Credentials

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to APIs & Services > Credentials
4. Click "Create Credentials" and select "OAuth client ID"
5. Set the Application type to "Web application"
6. Add a name for your OAuth client
7. Add authorized JavaScript origins:
   - For development: `http://localhost:3000`
   - For production: `https://your-production-domain.com` 
8. Add authorized redirect URIs:
   - For development: `http://localhost:3000/api/auth/callback`
   - For production: `https://your-production-domain.com/api/auth/callback`
9. Click "Create" and note the Client ID and Client Secret

### 2. Configure Supabase Auth

1. Go to your Supabase project dashboard
2. Navigate to Authentication > Providers
3. Find Google and toggle it to enabled
4. Enter your Google Client ID and Client Secret obtained in the previous step
5. **Important**: In the "Authorized redirect URIs" field, enter: `https://your-project-ref.supabase.co/auth/v1/callback`
6. Save the changes

### 3. Environment Variables

Add the following environment variables to your `.env.local` file:

```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# Site URL (used for OAuth redirects)
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

For production, make sure to update the `NEXT_PUBLIC_SITE_URL` to your production domain.

### 4. Testing

1. Start your Next.js development server:
   ```
   npm run dev
   ```
2. Navigate to `/sign-in` and click the "Sign in with Google" button
3. Complete the Google authentication flow
4. You should be redirected back to your application and logged in
5. Visit `/debug` to see your user information and confirm authentication status

## Troubleshooting

### Common Issues and Solutions

#### Not redirecting to Google login page

1. **Check environment variables**: Make sure `NEXT_PUBLIC_SITE_URL` is correctly set in `.env.local`.
2. **Open browser console**: Look for any errors when clicking the login button.
3. **Verify Supabase configuration**: Check that Google provider is enabled in Supabase dashboard.
4. **Check redirect URI**: In Google Cloud Console, ensure the redirect URI matches exactly what's in your code.

#### Google login happens but no user created

1. **Check Supabase callback URL**: In Supabase dashboard, make sure the callback URL is correct. It should be in the form of `https://your-project-ref.supabase.co/auth/v1/callback`.
2. **Check logs**: Open your browser console and check for any errors when redirecting back from Google.
3. **Verify Supabase setup**: Make sure your Supabase project is properly set up with Google OAuth credentials.
4. **Check network requests**: Monitor network requests during the login process to see if there are any errors.

#### Redirect URI mismatch errors

1. Make sure the redirect URI in your code, Google Cloud Console, and Supabase all match exactly.
2. For local development, use `http://localhost:3000/api/auth/callback`.
3. For production, use your actual domain like `https://your-domain.com/api/auth/callback`.

### Debugging Tips

1. Use the `/debug` page to see your current authentication status and user information.
2. Check browser console for error messages.
3. Verify network requests in the browser's developer tools Network tab.
4. In Supabase dashboard, check Auth > Logs for any authentication attempts and their status.

## Additional Resources

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Next.js Authentication Documentation](https://nextjs.org/docs/pages/building-your-application/authentication) 