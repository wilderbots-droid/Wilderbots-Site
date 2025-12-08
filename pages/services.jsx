import { useRouter } from 'next/router'
import ServicesPage from '../views/components/ServicesPage'

export default function Services() {
  const router = useRouter()
  
  const handleBack = () => {
    router.replace('/')
  }

  return <ServicesPage onBack={handleBack} />
}

