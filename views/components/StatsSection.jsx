export default function StatsSection() {
  return (
    <section className="py-20 bg-black border-y border-white/10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        <div className="scroll-scale-in">
          <div className="text-4xl md:text-5xl font-bold text-white mb-2">50k+</div>
          <div className="text-sm text-gray-500 uppercase tracking-widest">Kits Shipped</div>
        </div>
        <div className="scroll-scale-in" style={{ transitionDelay: '0.1s' }}>
          <div className="text-4xl md:text-5xl font-bold text-white mb-2">10k+</div>
          <div className="text-sm text-gray-500 uppercase tracking-widest">GitHub Stars</div>
        </div>
        <div className="scroll-scale-in" style={{ transitionDelay: '0.2s' }}>
          <div className="text-4xl md:text-5xl font-bold text-white mb-2">35</div>
          <div className="text-sm text-gray-500 uppercase tracking-widest">Countries</div>
        </div>
        <div className="scroll-scale-in" style={{ transitionDelay: '0.3s' }}>
          <div className="text-4xl md:text-5xl font-bold text-white mb-2">100+</div>
          <div className="text-sm text-gray-500 uppercase tracking-widest">Universities</div>
        </div>
      </div>
    </section>
  )
}
