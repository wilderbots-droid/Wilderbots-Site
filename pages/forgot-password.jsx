import { useRouter } from 'next/router'
import ForgotPasswordPage from '../views/components/ForgotPasswordPage'

export default function ForgotPassword() {
  const router = useRouter()
  
  const handleBack = () => {
    router.push('/login')
  }

  return <ForgotPasswordPage onBack={handleBack} />
}
