export default function Marquee() {
  return (
    <div className="py-8 bg-neutral-900 border-y border-white/5 overflow-hidden">
      <div className="flex gap-16 animate-marquee whitespace-nowrap">
        {[...Array(10)].map((_, i) => (
          <span key={i} className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-500 to-gray-700 uppercase tracking-widest">
            Innovation • Future • Wilderbots • Tech • Neureck •
          </span>
        ))}
      </div>
    </div>
  )
}


