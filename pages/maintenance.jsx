import { useState, useEffect } from 'react'
import Head from 'next/head'
import { Clock, Wrench } from 'lucide-react'
import Logo from '../views/components/Logo'

export default function MaintenancePage() {
  const [timeRemaining, setTimeRemaining] = useState(null)
  const [maintenanceData, setMaintenanceData] = useState(null)

  useEffect(() => {
    fetchMaintenanceData()
    // Poll every second for timer updates
    const interval = setInterval(() => {
      fetchMaintenanceData()
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (maintenanceData?.endTime) {
      const calculateTimeRemaining = () => {
        const now = new Date().getTime()
        const end = new Date(maintenanceData.endTime).getTime()
        const difference = end - now

        if (difference <= 0) {
          setTimeRemaining({ days: 0, hours: 0, minutes: 0, seconds: 0, expired: true })
          return
        }

        const days = Math.floor(difference / (1000 * 60 * 60 * 24))
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((difference % (1000 * 60)) / 1000)

        setTimeRemaining({ days, hours, minutes, seconds, expired: false })
      }

      calculateTimeRemaining()
      const timerInterval = setInterval(calculateTimeRemaining, 1000)

      return () => clearInterval(timerInterval)
    }
  }, [maintenanceData])

  const fetchMaintenanceData = async () => {
    try {
      const response = await fetch('/api/maintenance')
      if (response.ok) {
        const data = await response.json()
        setMaintenanceData(data.maintenance)
        
        // If maintenance is not active, redirect to home
        if (!data.maintenance.isActive) {
          window.location.href = '/'
        }
      }
    } catch (error) {
      console.error('Error fetching maintenance data:', error)
    }
  }

  const formatTime = (value) => {
    return value.toString().padStart(2, '0')
  }

  return (
    <>
      <Head>
        <title>Under Maintenance - Wilderbots</title>
        <meta name="description" content="We are currently performing scheduled maintenance" />
        <link rel="icon" href="/logo-alone.png" type="image/png" />
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white font-sans flex items-center justify-center p-4">
        <div className="max-w-2xl w-full text-center space-y-8">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <Logo size={80} showText={true} />
          </div>

          {/* Maintenance Icon */}
          <div className="flex justify-center">
            <div className="w-32 h-32 bg-purple-600/20 rounded-full flex items-center justify-center border-4 border-purple-500/30">
              <Wrench className="w-16 h-16 text-purple-400 animate-pulse" />
            </div>
          </div>

          {/* Title */}
          <div>
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Under Maintenance
            </h1>
            <p className="text-xl text-gray-300">
              {maintenanceData?.message || 'We are currently performing scheduled maintenance. We will be back shortly!'}
            </p>
          </div>

          {/* Timer */}
          {maintenanceData?.endTime && timeRemaining && !timeRemaining.expired && (
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-800 p-8">
              <div className="flex items-center justify-center gap-2 mb-6">
                <Clock className="w-6 h-6 text-purple-400" />
                <h2 className="text-2xl font-semibold text-white">We&apos;ll be back in</h2>
              </div>
              
              <div className="flex items-center justify-center gap-4 flex-wrap">
                {timeRemaining.days > 0 && (
                  <div className="bg-gradient-to-br from-purple-600/20 to-purple-600/10 rounded-xl p-6 border border-purple-500/30 min-w-[120px]">
                    <div className="text-4xl font-bold text-purple-400 mb-2">
                      {formatTime(timeRemaining.days)}
                    </div>
                    <div className="text-sm text-gray-400 uppercase tracking-wide">
                      {timeRemaining.days === 1 ? 'Day' : 'Days'}
                    </div>
                  </div>
                )}
                <div className="bg-gradient-to-br from-blue-600/20 to-blue-600/10 rounded-xl p-6 border border-blue-500/30 min-w-[120px]">
                  <div className="text-4xl font-bold text-blue-400 mb-2">
                    {formatTime(timeRemaining.hours)}
                  </div>
                  <div className="text-sm text-gray-400 uppercase tracking-wide">Hours</div>
                </div>
                <div className="bg-gradient-to-br from-purple-600/20 to-purple-600/10 rounded-xl p-6 border border-purple-500/30 min-w-[120px]">
                  <div className="text-4xl font-bold text-purple-400 mb-2">
                    {formatTime(timeRemaining.minutes)}
                  </div>
                  <div className="text-sm text-gray-400 uppercase tracking-wide">Minutes</div>
                </div>
                <div className="bg-gradient-to-br from-blue-600/20 to-blue-600/10 rounded-xl p-6 border border-blue-500/30 min-w-[120px]">
                  <div className="text-4xl font-bold text-blue-400 mb-2">
                    {formatTime(timeRemaining.seconds)}
                  </div>
                  <div className="text-sm text-gray-400 uppercase tracking-wide">Seconds</div>
                </div>
              </div>
            </div>
          )}

          {timeRemaining?.expired && (
            <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-xl p-6">
              <p className="text-yellow-300">
                Maintenance should be complete soon. Please check back in a moment.
              </p>
            </div>
          )}

          {/* Additional Info */}
          <div className="pt-8">
            <p className="text-gray-400 text-sm">
              Thank you for your patience. We&apos;re working hard to improve your experience.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
