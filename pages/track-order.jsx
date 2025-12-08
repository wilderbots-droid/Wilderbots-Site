import { useRouter } from 'next/router'
import OrderTrackerPage from '../views/components/OrderTrackerPage'

export default function TrackOrder() {
  const router = useRouter()
  
  const handleBack = () => {
    router.replace('/')
  }

  return <OrderTrackerPage onBack={handleBack} />
}

