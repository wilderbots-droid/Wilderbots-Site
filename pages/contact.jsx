import { useRouter } from 'next/router'
import ContactUsPage from '../views/components/ContactUsPage'

export default function Contact() {
  const router = useRouter()
  
  const handleBack = () => {
    router.replace('/')
  }

  return <ContactUsPage onBack={handleBack} />
}

