import { useRouter } from 'next/router'
import CareersPage from '../views/components/CareersPage'

export default function Careers() {
  const router = useRouter()
  
  const handleBack = () => {
    router.replace('/')
  }

  return <CareersPage onBack={handleBack} />
}

