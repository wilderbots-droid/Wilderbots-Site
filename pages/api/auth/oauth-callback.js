// OAuth callback handler for Google, GitHub, and Facebook

import connectDB from '../../../lib/mongodb'
import User from '../../../models/User'
import jwt from 'jsonwebtoken'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { code, state, error } = req.query

    if (error) {
      return res.redirect(`/login?error=${error}`)
    }

    if (!code || !state) {
      return res.status(400).json({ error: 'Missing code or state parameter' })
    }

    const stateData = JSON.parse(state)
    const { provider, type } = stateData

    // Exchange authorization code for access token
    const tokenData = await exchangeCodeForToken(provider, code)

    if (!tokenData) {
      return res.redirect(`/login?error=token_exchange_failed`)
    }

    // Get user info from provider
    const userInfo = await getUserInfo(provider, tokenData.access_token)

    if (!userInfo || !userInfo.email) {
      return res.redirect(`/login?error=unable_to_get_user_info`)
    }

    // Connect to database
    await connectDB()

    // Find or create user
    let user = await User.findOne({ email: userInfo.email })

    if (!user) {
      // Create new user if signing up
      if (type === 'signup') {
        user = await User.create({
          name: userInfo.name || 'User',
          email: userInfo.email,
          authProvider: provider,
          authProviderId: userInfo.id,
          avatar: userInfo.avatar,
          isEmailVerified: true, // OAuth providers verify emails
        })
      } else {
        return res.redirect(`/login?error=user_not_found`)
      }
    } else {
      // Update auth provider info if not already set
      if (!user.authProvider) {
        user.authProvider = provider
        user.authProviderId = userInfo.id
        if (userInfo.avatar) {
          user.avatar = userInfo.avatar
        }
        await user.save()
      }
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '30d' }
    )

    // Set secure cookie
    res.setHeader('Set-Cookie', [
      `wilderbots_token=${token}; Path=/; HttpOnly; Max-Age=2592000${
        process.env.NODE_ENV === 'production' ? '; Secure; SameSite=Strict' : ''
      }`,
      `wilderbots_user=${encodeURIComponent(JSON.stringify({
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      }))}; Path=/; Max-Age=2592000`,
    ])

    // Redirect to dashboard
    res.redirect('/dashboard')
  } catch (error) {
    console.error('OAuth callback error:', error)
    res.redirect(`/login?error=server_error`)
  }
}

async function exchangeCodeForToken(provider, code) {
  const FRONTEND_URL = process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000'
  const redirectUri = `${FRONTEND_URL}/api/auth/oauth-callback`

  const tokenEndpoints = {
    google: {
      url: 'https://oauth2.googleapis.com/token',
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
    github: {
      url: 'https://github.com/login/oauth/access_token',
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    },
    facebook: {
      url: 'https://graph.facebook.com/v18.0/oauth/access_token',
      clientId: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
    },
  }

  const config = tokenEndpoints[provider]

  if (!config) {
    return null
  }

  const params = new URLSearchParams({
    client_id: config.clientId,
    client_secret: config.clientSecret,
    code: code,
    redirect_uri: redirectUri,
  })

  if (provider === 'google') {
    params.append('grant_type', 'authorization_code')
  }

  try {
    const response = await fetch(config.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        ...(provider === 'github' && { Accept: 'application/json' }),
      },
      body: params.toString(),
    })

    const data = await response.json()

    return {
      access_token: data.access_token,
      token_type: data.token_type || 'Bearer',
    }
  } catch (error) {
    console.error(`Token exchange failed for ${provider}:`, error)
    return null
  }
}

async function getUserInfo(provider, accessToken) {
  const endpoints = {
    google: 'https://www.googleapis.com/oauth2/v2/userinfo',
    github: 'https://api.github.com/user',
    facebook: 'https://graph.facebook.com/me?fields=id,name,email,picture',
  }

  const endpoint = endpoints[provider]

  if (!endpoint) {
    return null
  }

  try {
    const response = await fetch(endpoint, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        ...(provider === 'github' && { 'User-Agent': 'Wilderbots-App' }),
      },
    })

    const data = await response.json()

    if (provider === 'google') {
      return {
        id: data.id,
        name: data.name,
        email: data.email,
        avatar: data.picture,
      }
    } else if (provider === 'github') {
      return {
        id: data.id,
        name: data.name || data.login,
        email: data.email,
        avatar: data.avatar_url,
      }
    } else if (provider === 'facebook') {
      return {
        id: data.id,
        name: data.name,
        email: data.email,
        avatar: data.picture?.data?.url,
      }
    }
  } catch (error) {
    console.error(`Failed to get user info from ${provider}:`, error)
    return null
  }
}
