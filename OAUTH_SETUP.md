# OAuth Setup Guide for Wilderbots

This guide explains how to set up Google, GitHub, and Facebook OAuth authentication for your Wilderbots application.

## Changes Made

### 1. **Updated Components**
- **[views/components/SignupPage.jsx](views/components/SignupPage.jsx)** - Added OAuth provider buttons (Google, GitHub, Facebook)
- **[views/components/LoginPage.jsx](views/components/LoginPage.jsx)** - Added OAuth provider buttons for login

### 2. **New API Routes**
- **[pages/api/auth/oauth.js](pages/api/auth/oauth.js)** - Redirects users to provider OAuth login pages
- **[pages/api/auth/oauth-callback.js](pages/api/auth/oauth-callback.js)** - Handles OAuth callback and user creation/login

### 3. **Updated Database Model**
- **[models/User.js](models/User.js)** - Added OAuth fields:
  - `authProvider` - Stores which OAuth provider was used
  - `authProviderId` - Provider's unique user ID
  - `avatar` - User's profile picture from OAuth provider
  - `isEmailVerified` - Set to true for OAuth users
  - Made `password` optional for OAuth users

## Setup Instructions

### Step 1: Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to Credentials → Create OAuth 2.0 Client ID
5. Select "Web application"
6. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/oauth-callback` (development)
   - `https://yourdomain.com/api/auth/oauth-callback` (production)
7. Copy Client ID and Client Secret

### Step 2: GitHub OAuth Setup

1. Go to [GitHub Settings → Developer settings → OAuth Apps](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Fill in:
   - Application name: Wilderbots
   - Homepage URL: `http://localhost:3000` (or your domain)
   - Authorization callback URL: `http://localhost:3000/api/auth/oauth-callback`
4. Copy Client ID and generate Client Secret

### Step 3: Facebook OAuth Setup

1. Go to [Facebook Developers](https://developers.facebook.com)
2. Create a new app or use existing one
3. Add Facebook Login product
4. Go to Settings → Basic to get App ID and App Secret
5. Add valid OAuth Redirect URIs:
   - `http://localhost:3000/api/auth/oauth-callback`
   - `https://yourdomain.com/api/auth/oauth-callback`
6. Go to Settings → Basic Info and copy App ID and App Secret

### Step 4: Configure Environment Variables

1. Copy `.env.local.example` to `.env.local` if you don't have it
2. Add your OAuth credentials:

```env
# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# GitHub OAuth
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# Facebook OAuth
FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret

# Frontend URL (update for production)
NEXT_PUBLIC_FRONTEND_URL=http://localhost:3000
```

### Step 5: Install Dependencies (if needed)

The implementation uses built-in Node.js `fetch` API, so no additional packages are required.

## How It Works

1. User clicks OAuth provider button on Sign Up/Login page
2. User is redirected to `/api/auth/oauth?provider=google&type=signup`
3. Server redirects to provider's authorization page
4. User logs in with provider and authorizes app
5. Provider redirects to `/api/auth/oauth-callback` with authorization code
6. Server exchanges code for access token
7. Server fetches user info from provider
8. Server creates/finds user in database
9. Server generates JWT and sets secure cookies
10. User is redirected to `/dashboard`

## User Model Changes

The User model now supports two authentication methods:

### Traditional Email/Password
```javascript
{
  name: "John Doe",
  email: "john@example.com",
  password: "hashed_password",
  authProvider: null
}
```

### OAuth (Google/GitHub/Facebook)
```javascript
{
  name: "John Doe",
  email: "john@example.com",
  password: undefined,  // Not required for OAuth users
  authProvider: "google",
  authProviderId: "google_user_id",
  avatar: "https://...",
  isEmailVerified: true
}
```

## Testing

1. Start your development server: `npm run dev`
2. Navigate to `/signup` or `/login`
3. Click OAuth provider buttons
4. You should be redirected to provider login
5. After authorization, you'll be logged into your app

## Troubleshooting

### "OAuth credentials not configured"
- Make sure you've added OAuth credentials to `.env.local`
- Check that the variable names match exactly

### "Redirect URI mismatch"
- Verify the OAuth callback URL matches in provider settings
- Make sure `NEXT_PUBLIC_FRONTEND_URL` environment variable is correct

### Users not getting created
- Check MongoDB connection in `MONGODB_URI`
- Check server logs for any database errors

### Email not being returned from provider
- Some providers require specific scopes (email scope)
- Verify app permissions in provider dashboard

## Security Notes

- OAuth credentials are never exposed to frontend (stored in `.env.local`)
- Access tokens are used only on server-side
- JWTs are stored in HttpOnly cookies for security
- CSRF protection via state parameter in OAuth flow
- Password field is optional for OAuth users

## Next Steps

- Set up email verification for traditional signup users
- Add user profile completion after first OAuth login
- Implement account linking (same email, different OAuth providers)
- Add logout functionality
- Set up password reset for traditional users
