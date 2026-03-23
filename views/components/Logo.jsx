import Image from 'next/image'

export default function Logo({ size = 120, showText = true, className = "", onClick }) {
  // Use logo-alone.png when only logo is needed (showText=false)
  // Use logo.png when logo with text is needed (showText=true)
  const logoImage = showText ? '/logo.png' : '/logo-alone.png'
  
  // Adjust size based on where it's used
  const logoHeight = size
  const logoWidth = showText ? size * 2.5 : size // logo-alone is square, logo.png is wider

  return (
    <div 
      className={`flex items-center bg-transparent ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
    >
      <div className="relative bg-transparent" style={{ width: `${logoWidth}px`, height: `${logoHeight}px` }}>
        <Image
          src={logoImage}
          alt="Wilderbots"
          fill
          className="object-contain"
          unoptimized
          priority
        />
      </div>
    </div>
  )
}
