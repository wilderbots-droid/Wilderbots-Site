import { useRouter } from 'next/router'
import DashboardPage from '../views/components/DashboardPage'

export default function Dashboard() {
  const router = useRouter()
  
  const handleBack = () => {
    router.replace('/')
  }

  return <DashboardPage onBack={handleBack} />
}

