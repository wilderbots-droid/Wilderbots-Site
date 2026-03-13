import { initializeApp, getApps } from 'firebase/app'
import { getAuth, GoogleAuthProvider, signInWithPopup, setPersistence, browserLocalPersistence } from 'firebase/auth'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || `${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.appspot.com`,
}

// Debug: Log config (without sensitive data)
if (typeof window !== 'undefined') {
  console.log('🔍 Firebase Config Debug:')
  console.log('  API Key:', firebaseConfig.apiKey ? '✓ Set (' + firebaseConfig.apiKey.substring(0, 20) + '...)' : '✗ Missing')
  console.log('  Auth Domain:', firebaseConfig.authDomain || '✗ Missing')
  console.log('  Project ID:', firebaseConfig.projectId || '✗ Missing')
  console.log('  App ID:', firebaseConfig.appId || '✗ Missing')
  console.log('  Storage Bucket:', firebaseConfig.storageBucket || '✗ Missing')
}

// Validate config
if (!firebaseConfig.apiKey || !firebaseConfig.authDomain || !firebaseConfig.projectId) {
  console.error('❌ Firebase config incomplete. Please set all NEXT_PUBLIC_FIREBASE_* environment variables in .env.local')
  console.error('Required: NEXT_PUBLIC_FIREBASE_API_KEY, NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN, NEXT_PUBLIC_FIREBASE_PROJECT_ID, NEXT_PUBLIC_FIREBASE_APP_ID')
}

let auth = null
let app = null

try {
  if (!getApps().length) {
    app = initializeApp(firebaseConfig)
    auth = getAuth(app)
    // Enable persistence
    setPersistence(auth, browserLocalPersistence).catch((error) => {
      console.warn('Firebase persistence error:', error)
    })
    console.log('✅ Firebase initialized successfully with project:', firebaseConfig.projectId)
  } else {
    app = getApps()[0]
    auth = getAuth(app)
    console.log('✅ Firebase already initialized')
  }
} catch (error) {
  console.error('❌ Firebase initialization failed:', error.message)
}

const googleProvider = new GoogleAuthProvider()
googleProvider.addScope('profile')
googleProvider.addScope('email')

// Track ongoing popup requests to prevent duplicates
let isPopupRequesting = false

export async function signInWithGooglePopup() {
  if (!auth) {
    const error = 'Firebase not initialized. Check your environment variables.'
    console.error('❌', error)
    throw new Error(error)
  }
  
  // Prevent multiple concurrent popup requests
  if (isPopupRequesting) {
    console.warn('⚠️ Popup request already in progress. Ignoring duplicate request.')
    throw new Error('Authentication request already in progress. Please wait...')
  }
  
  isPopupRequesting = true
  
  try {
    console.log('🔵 Initiating Google Sign-In popup...')
    const result = await signInWithPopup(auth, googleProvider)
    console.log('✅ Google Sign-In successful:', result.user.email)
    
    const user = result.user
    const idToken = await user.getIdToken()
    return { user, idToken }
  } catch (error) {
    console.error('❌ Google sign-in error:', error.code, error.message)
    
    // Provide more helpful error messages
    let userMessage = error.message
    switch(error.code) {
      case 'auth/cancelled-popup-request':
        userMessage = 'Sign-in cancelled. Please click the button again to try.'
        break
      case 'auth/popup-closed-by-user':
        userMessage = 'You closed the sign-in popup. Please try again.'
        break
      case 'auth/api-key-not-valid':
        userMessage = 'API Key Error: Please check Firebase Console > Project Settings > API Keys. The API key may need to be unrestricted or have proper API permissions enabled.'
        break
      case 'auth/unauthorized-domain':
        userMessage = 'Domain Error: localhost:3000 is not authorized. Check Firebase Console > Authentication > Settings > Authorized domains'
        break
      case 'auth/operation-not-supported-in-this-environment':
        userMessage = 'Environment Error: Pop-ups are blocked or not supported. Try a different browser or check console for details.'
        break
      case 'auth/popup-blocked-by-browser':
        userMessage = 'Pop-up was blocked by your browser. Please allow pop-ups for this site and try again.'
        break
    }
    
    console.error('💡 Suggestion:', userMessage)
    throw new Error(userMessage)
  } finally {
    // Reset the flag after a small delay to allow for retry
    setTimeout(() => {
      isPopupRequesting = false
    }, 500)
  }
}

export { auth, googleProvider, app }

