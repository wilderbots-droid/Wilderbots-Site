import { useRouter } from 'next/router'
import FAQPage from '../views/components/FAQPage'

export default function FAQ() {
  const router = useRouter()
  
  const handleBack = () => {
    router.replace('/')
  }

  return <FAQPage onBack={handleBack} />
}

