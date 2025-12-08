import { useRouter } from 'next/router'
import LoginPage from '../views/components/LoginPage'

export default function Login() {
  const router = useRouter()
  
  const handleBack = () => {
    router.replace('/')
  }

  return <LoginPage onBack={handleBack} />
}

