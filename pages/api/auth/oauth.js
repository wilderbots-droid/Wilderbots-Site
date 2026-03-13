// OAuth redirect handler for Google, GitHub, and Facebook

export default function handler(req, res) {
  const { provider, type } = req.query

  if (!provider || !type) {
    return res.status(400).json({ error: 'Missing provider or type parameter' })
  }

  const FRONTEND_URL = process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000'
  const redirectUri = `${FRONTEND_URL}/api/auth/oauth-callback`

  const oauthConfigs = {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      authorizationUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID,
      authorizationUrl: 'https://github.com/login/oauth/authorize',
    },
    facebook: {
      clientId: process.env.FACEBOOK_APP_ID,
      authorizationUrl: 'https://www.facebook.com/v18.0/dialog/oauth',
    },
  }

  const config = oauthConfigs[provider]

  if (!config) {
    return res.status(400).json({ error: 'Invalid provider' })
  }

  if (!config.clientId) {
    return res.status(500).json({ error: `${provider} OAuth credentials not configured` })
  }

  const scope = {
    google: 'openid profile email',
    github: 'user:email',
    facebook: 'email,public_profile',
  }[provider]

  const params = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: scope,
    state: JSON.stringify({ provider, type, timestamp: Date.now() }),
  })

  if (provider === 'google') {
    params.append('access_type', 'offline')
    params.append('prompt', 'consent')
  }

  const authUrl = `${config.authorizationUrl}?${params.toString()}`

  res.redirect(authUrl)
}
