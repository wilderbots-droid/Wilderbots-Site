import { useRouter } from 'next/router'
import AboutUsPage from '../views/components/AboutUsPage'

export default function About() {
  const router = useRouter()
  
  const handleBack = () => {
    router.replace('/')
  }

  return <AboutUsPage onBack={handleBack} />
}

