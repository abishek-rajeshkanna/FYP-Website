import './App.css'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

import Hero from './components/Hero'
import Overview from './components/Overview'
import DRLSection from './components/DRLSection'
import MARLSection from './components/MARLSection'
import Gallery from './components/Gallery'
import QoSSection from './components/QoSSection'
import TechStack from './components/TechStack'
import Footer from './components/Footer'

export type LightboxImg = string | null

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

export default function App() {
  const [lightbox, setLightbox] = useState<LightboxImg>(null)

  return (
    <div className="app">
      <nav className="nav">
        <div className="nav-logo">
          Intelligent traffic Signalling with Lane Change for Emergency Vehicles
        </div>
        <ul className="nav-links">
          <li><button className="nav-link-btn" onClick={() => scrollTo('overview')}>Overview</button></li>
          <li><button className="nav-link-btn" onClick={() => scrollTo('drl')}>DRL-PPO</button></li>
          <li><button className="nav-link-btn" onClick={() => scrollTo('marl')}>MARL Signal</button></li>
          <li><button className="nav-link-btn" onClick={() => scrollTo('gallery')}>Screenshots and Output</button></li>
          <li><button className="nav-link-btn" onClick={() => scrollTo('qos')}>QoS-V2X</button></li>
        </ul>
      </nav>

      <Hero />
      <div className="divider" />
      <Overview />
      <div className="divider" />
      <DRLSection />
      <div className="divider" />
      <MARLSection />
      <div className="gallery-bg">
        <Gallery onOpen={setLightbox} />
      </div>
      <div className="divider" />
      <QoSSection />
      <div className="divider" />
      <TechStack />
      <Footer />

      <AnimatePresence>
        {lightbox && (
          <motion.div
            className="lightbox-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
          >
            <motion.img
              className="lightbox-img"
              src={lightbox}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            />
            <div className="lightbox-close"><X size={28} /></div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
