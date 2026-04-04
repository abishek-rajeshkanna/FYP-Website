import { motion } from 'framer-motion'
import { useInView } from '../hooks/useInView'
import type { LightboxImg } from '../App'

import ss1 from '../assets/Screenshot 2026-04-04 102711.png'
import ss2 from '../assets/Screenshot 2026-04-04 102729.png'
import ss3 from '../assets/Screenshot 2026-04-04 102742.png'
import ss4 from '../assets/Screenshot 2026-04-04 102757.png'
import ss5 from '../assets/Screenshot 2026-04-04 102813.png'
import training from '../assets/ppo_training_progress.png'

const items = [
  { src: training, caption: 'PPO Training Reward Curve — 1000 epochs', color: '#388bfd', span: true },
  { src: ss1, caption: 'SUMO Simulation — EV navigating traffic', color: '#3fb950', span: false },
  { src: ss2, caption: 'Multi-lane scenario with surrounding vehicles', color: '#bc8cff', span: false },
  { src: ss3, caption: 'Signal phase coordination across junctions', color: '#f78166', span: false },
  { src: ss4, caption: 'EV clearance path — signal preemption active', color: '#388bfd', span: false },
  { src: ss5, caption: 'Dense traffic evaluation run', color: '#e3b341', span: false },
]

interface Props { onOpen: (src: LightboxImg) => void }

export default function Gallery({ onOpen }: Props) {
  const [ref, inView] = useInView()

  return (
    <div className="gallery-inner" id="gallery" ref={ref}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
      >
        <div className="section-label">Simulation Gallery</div>
        <h2 className="section-title">Models in Action</h2>
        <p className="section-desc">
          Screenshots and training curves captured directly from SUMO simulation runs
          and the PPO training loop.
        </p>
      </motion.div>

      <div className="gallery-grid">
        {items.map((item, i) => (
          <motion.div
            key={i}
            className={`gallery-item${item.span ? ' span-2' : ''}`}
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.05 * i }}
            onClick={() => onOpen(item.src)}
          >
            <img src={item.src} alt={item.caption} />
            <div className="gallery-caption">
              <div className="gallery-caption-dot" style={{ background: item.color }} />
              {item.caption}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
