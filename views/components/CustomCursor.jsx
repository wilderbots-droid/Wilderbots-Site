import { useState, useEffect } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export default function CustomCursor() {
  const [cursorVariant, setCursorVariant] = useState('default')
  const [isVisible, setIsVisible] = useState(false)

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  // Softer spring for the scale/interactions
  const scaleSpring = useSpring(cursorVariant === 'interactive' ? 1.5 : 1, {
    damping: 30,
    stiffness: 200
  })

  useEffect(() => {
    // Sync scaleSpring with cursorVariant
    scaleSpring.set(cursorVariant === 'interactive' ? 1.5 : 1)
  }, [cursorVariant, scaleSpring])

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
      if (!isVisible) setIsVisible(true)
    }

    const handleMouseOver = (e) => {
      const target = e.target
      const isInteractive = 
        target.tagName === 'BUTTON' || 
        target.tagName === 'A' || 
        target.closest('button') || 
        target.closest('a') ||
        target.getAttribute('role') === 'button' ||
        target.classList.contains('cursor-pointer')

      if (isInteractive) {
        setCursorVariant('interactive')
      } else {
        setCursorVariant('default')
      }
    }

    const handleMouseLeaveWindow = () => setIsVisible(false)
    const handleMouseEnterWindow = () => setIsVisible(true)

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseover', handleMouseOver)
    document.addEventListener('mouseleave', handleMouseLeaveWindow)
    document.addEventListener('mouseenter', handleMouseEnterWindow)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseover', handleMouseOver)
      document.removeEventListener('mouseleave', handleMouseLeaveWindow)
      document.removeEventListener('mouseenter', handleMouseEnterWindow)
    }
  }, [mouseX, mouseY, isVisible])

  const variants = {
    default: {
      height: 12,
      width: 12,
      backgroundColor: 'white',
      borderRadius: '50%',
      scale: 1
    },
    interactive: {
      height: 48,
      width: 48,
      backgroundColor: 'white',
      borderRadius: '50%',
      scale: 1.5
    }
  }

  if (typeof window === 'undefined') return null

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference"
      variants={variants}
      animate={cursorVariant}
      style={{
        x: mouseX,
        y: mouseY,
        translateX: '-50%',
        translateY: '-50%',
        opacity: isVisible ? 1 : 0
      }}
      transition={{
        scale: { type: 'spring', damping: 20, stiffness: 200 },
        layout: { duration: 0 }
      }}
    />
  )
}
