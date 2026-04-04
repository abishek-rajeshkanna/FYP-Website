import { motion } from 'framer-motion'
import { useInView } from '../hooks/useInView'

const junctions = ['J0', 'J1', 'J2', 'J3', 'J4', 'J5']
const junctionSubs = ['2 neighbors', '3 neighbors', '2 neighbors', '2 neighbors', '3 neighbors', '2 neighbors']

const stateFields = [
  { label: 'Queue counts (4 lanes)', fields: ['q_lane0', 'q_lane1', 'q_lane2', 'q_lane3'], color: 'blue' },
  { label: 'Current phase', fields: ['phase'], color: 'purple' },
  { label: 'Neighbor phases (×2)', fields: ['neighbor_phase_0', 'neighbor_phase_1'], color: 'green' },
  { label: 'EV proximity', fields: ['ev_distance'], color: 'orange' as 'blue' | 'green' | 'purple' },
]

const mappoParams = [
  { key: 'n_agents', val: '6' },
  { key: 'state_dim', val: '8' },
  { key: 'action_dim', val: '2' },
  { key: 'gamma', val: '0.99' },
  { key: 'lambda (GAE)', val: '0.95' },
  { key: 'clip', val: '0.2' },
  { key: 'ppo_epochs', val: '4' },
  { key: 'batch_size', val: '64' },
  { key: 'entropy_coef', val: '0.01' },
  { key: 'critic_input', val: '6 × 8 = 48' },
]

export default function MARLSection() {
  const [ref, inView] = useInView()

  return (
    <section className="section" id="marl" ref={ref}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
      >
        <div className="section-label">Model 2</div>
        <h2 className="section-title">MARL — Multi-Agent Signal Control</h2>
        <p className="section-desc">
          Six traffic signal agents operate under the Centralized Training, Decentralized
          Execution (CTDE) paradigm. Each agent observes only its local state but a shared
          critic sees the full global state during training.
        </p>
      </motion.div>

      <motion.div
        className="marl-grid"
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.15 }}
      >
        {/* Junction topology */}
        <div className="marl-topology">
          <div className="topology-title">2 × 3 Junction Grid Topology</div>
          <div className="junction-grid">
            {junctions.map((j, i) => (
              <div className="junction" key={j}>
                {j}
                <span className="junction-sub">{junctionSubs[i]}</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: '1.5rem' }}>
            <div className="state-group-label" style={{ marginBottom: '0.75rem' }}>Per-Agent State — 8 dimensions</div>
            <div className="state-vector">
              {stateFields.map(g => (
                <div className="state-group" key={g.label} style={{ marginBottom: '0.5rem' }}>
                  <div className="state-group-label">{g.label}</div>
                  <div className="state-fields">
                    {g.fields.map(f => (
                      <span key={f} className={`state-field ${g.color}`}>{f}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Reward + params */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="reward-breakdown">
            <div className="topology-title">Reward Function</div>
            <div className="reward-formula">
              R = <span className="neg">- queue</span>{' '}
              <span className="neg">- 0.5 × wait</span>{' '}
              <span className="pos">+ 3 × ev_speed</span>{' '}
              <span className="neg">- 5 × ev_delay</span>
            </div>
            <div className="reward-items">
              {[
                { sign: '-', color: 'neg', text: 'Total halting vehicles across all lanes' },
                { sign: '-', color: 'neg', text: '0.5 × cumulative lane waiting time' },
                { sign: '+', color: 'pos', text: '3 × current EV speed (reward fast passage)' },
                { sign: '-', color: 'neg', text: '5 × EV speed deficit below 50 km/h' },
              ].map((r, i) => (
                <div className="reward-item" key={i}>
                  <span className={`reward-item-sign ${r.color}`}>{r.sign}</span>
                  <span className="reward-item-text">{r.text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="arch-panel">
            <div className="arch-panel-header">
              <div className="arch-panel-dot blue" />
              <div className="arch-panel-title">MAPPO HYPERPARAMETERS</div>
            </div>
            <div className="arch-panel-body">
              <div className="params-list">
                {mappoParams.map(p => (
                  <div className="param-row" key={p.key}>
                    <span className="param-key">{p.key}</span>
                    <span className="param-val">{p.val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* CTDE explanation */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.3 }}
        style={{ marginTop: '3rem' }}
      >
        <div className="arch-split">
          <div className="arch-panel">
            <div className="arch-panel-header">
              <div className="arch-panel-dot blue" />
              <div className="arch-panel-title">DECENTRALIZED ACTORS (×6)</div>
            </div>
            <div className="arch-panel-body">
              <div className="network-diagram">
                {[
                  { label: 'Local State', bar: 'input', text: '8-dim local observation', size: '8' },
                  { label: '', arrow: true },
                  { label: 'Hidden 1', bar: 'h1', text: 'Linear(8→64) → ReLU', size: '64' },
                  { label: '', arrow: true },
                  { label: 'Hidden 2', bar: 'h2', text: 'Linear(64→64) → ReLU', size: '64' },
                  { label: '', arrow: true },
                  { label: 'Output', bar: 'output', text: 'Logits → phase {0,1}', size: '2' },
                ].map((row, i) =>
                  (row as any).arrow ? (
                    <div key={i} className="net-arrow">↓</div>
                  ) : (
                    <div className="net-layer" key={i}>
                      <div className="net-label">{row.label}</div>
                      <div className={`net-bar ${row.bar}`}>{row.text}</div>
                      <div className="net-size">{row.size}</div>
                    </div>
                  )
                )}
              </div>
              <div style={{ marginTop: '1rem' }}>
                <div className="param-row">
                  <span className="param-key">Weight Init</span>
                  <span className="param-val green">Orthogonal</span>
                </div>
                <div className="param-row">
                  <span className="param-key">Execution</span>
                  <span className="param-val">Independent (no comm)</span>
                </div>
              </div>
            </div>
          </div>

          <div className="arch-panel">
            <div className="arch-panel-header">
              <div className="arch-panel-dot green" />
              <div className="arch-panel-title">CENTRALIZED CRITIC (×1)</div>
            </div>
            <div className="arch-panel-body">
              <div className="network-diagram">
                {[
                  { label: 'Global State', bar: 'input', text: 'concat all 6 agents = 48-dim', size: '48' },
                  { label: '', arrow: true },
                  { label: 'Hidden 1', bar: 'h1', text: 'Linear(48→128) → ReLU', size: '128' },
                  { label: '', arrow: true },
                  { label: 'LayerNorm', bar: 'h2', text: 'LayerNorm(128)', size: '128' },
                  { label: '', arrow: true },
                  { label: 'Hidden 2', bar: 'h3', text: 'Linear(128→128) → ReLU', size: '128' },
                  { label: '', arrow: true },
                  { label: 'Value', bar: 'output', text: 'V(s_global)', size: '1' },
                ].map((row, i) =>
                  (row as any).arrow ? (
                    <div key={i} className="net-arrow">↓</div>
                  ) : (
                    <div className="net-layer" key={i}>
                      <div className="net-label">{row.label}</div>
                      <div className={`net-bar ${row.bar}`}>{row.text}</div>
                      <div className="net-size">{row.size}</div>
                    </div>
                  )
                )}
              </div>
              <div style={{ marginTop: '1rem' }}>
                <div className="param-row">
                  <span className="param-key">Loss</span>
                  <span className="param-val green">MSE</span>
                </div>
                <div className="param-row">
                  <span className="param-key">Training only</span>
                  <span className="param-val purple">Not used at inference</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
