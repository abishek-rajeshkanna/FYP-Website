import { motion } from 'framer-motion'
import { useInView } from '../hooks/useInView'
import { Cpu, Network, Activity, GitBranch } from 'lucide-react'

const cards = [
  {
    icon: <Cpu size={20} />,
    color: 'blue',
    title: 'DRL-PPO Lane Change',
    desc: 'A Proximal Policy Optimization agent trained to guide an Emergency Vehicle through dense traffic by selecting optimal lane-change actions every 4 simulation steps.',
  },
  {
    icon: <Network size={20} />,
    color: 'green',
    title: 'MARL Signal Control',
    desc: 'Six independent actor networks share a centralized critic (CTDE) to coordinate traffic signal phases across a 2×3 junction grid, prioritizing EV passage.',
  },
  {
    icon: <Activity size={20} />,
    color: 'purple',
    title: 'SUMO Simulation',
    desc: 'Both models are trained and evaluated inside SUMO — a microscopic traffic simulator — with dynamic route generation producing randomized traffic demand each episode.',
  },
  {
    icon: <GitBranch size={20} />,
    color: 'orange',
    title: 'Integrated Pipeline',
    desc: 'The trained PPO model is loaded into the MARL training loop, enabling joint optimization where signal agents learn to cooperate with the EV lane-change policy.',
  },
]

export default function Overview() {
  const [ref, inView] = useInView()

  return (
    <section className="section" id="overview" ref={ref}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
      >
        <div className="section-label">System Overview</div>
        <h2 className="section-title">Two Models, One Mission</h2>
        <p className="section-desc">
          The system tackles urban emergency response from two angles simultaneously —
          the vehicle decides where to go, the grid decides when to let it through.
        </p>
      </motion.div>

      <div className="overview-grid">
        {cards.map((c, i) => (
          <motion.div
            className="overview-card"
            key={c.title}
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 + i * 0.1 }}
          >
            <div className={`card-icon ${c.color}`}>{c.icon}</div>
            <div className="card-title">{c.title}</div>
            <div className="card-desc">{c.desc}</div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
