import { useRouter } from 'next/router'
import SignupPage from '../views/components/SignupPage'

export default function Signup() {
  const router = useRouter()
  
  const handleBack = () => {
    router.replace('/')
  }

  return <SignupPage onBack={handleBack} />
}

