import { motion } from 'framer-motion'
import { ArrowDown } from 'lucide-react'

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: 'easeOut' },
})

function scrollTo(id: string) {
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

export default function Hero() {
  return (
    <section className="hero" id="hero">
      <div className="hero-grid" />
      <div className="hero-glow" />

      <motion.div className="hero-badge" {...fade(0.1)}>
        <span className="hero-badge-dot" />
        Intelligent Traffic System
      </motion.div>

      <motion.h1 className="hero-title" {...fade(0.2)}>
        <span className="line-1">Quality aware lane changing</span>
        <span className="line-2">Intelligent traffic signalling</span>
      </motion.h1>

      <motion.p className="hero-sub" {...fade(0.3)}>
        A dual model deep reinforcement learning framework combining PPO-based Emergency
        Vehicle lane change control with Multi Agent signal coordination across a 6 junction
        urban grid simulated in SUMO.
      </motion.p>

      <motion.div className="hero-cta" {...fade(0.4)}>
        <button onClick={() => scrollTo('drl')} className="btn-primary">
          Explore Models <ArrowDown size={16} />
        </button>
        <button onClick={() => scrollTo('metrics')} className="btn-secondary">
          View Results
        </button>
      </motion.div>

      <motion.div className="hero-stats" {...fade(0.5)}>
        {[
          { val: '1000', label: 'Training Epochs' },
          { val: '6', label: 'Signal Agents' },
          { val: '29-dim', label: 'State Space' },
          { val: 'CTDE', label: 'MARL Paradigm' },
        ].map((s) => (
          <div className="hero-stat" key={s.label}>
            <div className="hero-stat-val">{s.val}</div>
            <div className="hero-stat-label">{s.label}</div>
          </div>
        ))}
      </motion.div>
    </section>
  )
}
