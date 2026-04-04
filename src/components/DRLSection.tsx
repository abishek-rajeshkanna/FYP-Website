import { motion } from 'framer-motion'
import { useInView } from '../hooks/useInView'

const params = [
  { key: 'STATE_DIM', val: '29', color: '' },
  { key: 'ACTION_DIM', val: '3  {-1, 0, +1}', color: 'green' },
  { key: 'GAMMA', val: '0.99', color: '' },
  { key: 'LAMBDA (GAE)', val: '0.95', color: 'purple' },
  { key: 'CLIP_EPS', val: '0.2', color: '' },
  { key: 'LR', val: '3e-4', color: 'orange' },
  { key: 'ROLLOUT_STEPS', val: '128', color: '' },
  { key: 'PPO_UPDATES', val: '4', color: 'purple' },
  { key: 'TRAIN_EPOCHS', val: '1000', color: '' },
  { key: 'BATCH_SIZE', val: '32', color: 'orange' },
  { key: 'ENTROPY_COEF', val: '0.02', color: '' },
  { key: 'VALUE_COEF', val: '1.0', color: 'green' },
]

const steps = [
  {
    title: 'Environment Reset & State Collection',
    desc: 'Each epoch begins with a SUMO reset. The EV spawns at a random position. The 29-dim state vector is assembled from the 6 nearest vehicles (lane, speed, acceleration, relative distance) plus 5 EV features.',
    code: `<span class="cm"># 6 neighbors × 4 features + 5 EV features</span>
state = av_feats + [<span class="fn">ev_lane</span>, <span class="fn">ev_speed</span>, <span class="fn">ev_acc</span>, <span class="num">0.0</span>, <span class="fn">ev_pos</span>]`,
  },
  {
    title: 'Action Sampling from Old Policy',
    desc: 'Actions are sampled from the OLD actor every 4 steps (decision interval). This decouples action frequency from simulation steps, reducing noise. The old log-probability is stored for the PPO ratio.',
    code: `<span class="kw">if</span> t % <span class="num">4</span> == <span class="num">0</span>:
    action, logp_old, value = agent.<span class="fn">get_action_and_logprob</span>(state)`,
  },
  {
    title: 'Rollout Buffer & GAE Computation',
    desc: 'After 128 steps, Generalized Advantage Estimation computes advantages using the critic\'s value estimates. Advantages are normalized before the update to stabilize training.',
    code: `delta = r[t] + γ * V[t+1] * (1-done) - V[t]
A[t] = delta + γ * λ * (1-done) * A[t+1]`,
  },
  {
    title: 'PPO-CLIP Update (4 epochs)',
    desc: 'The clipped surrogate objective prevents destructively large policy updates. Huber loss is used for the value function. Gradient norms are clipped at 0.5 for both actor and critic.',
    code: `ratio = <span class="fn">exp</span>(logp_new - logp_old)
L_clip = <span class="fn">min</span>(ratio * A, <span class="fn">clip</span>(ratio, <span class="num">0.8</span>, <span class="num">1.2</span>) * A)
loss = L_clip + <span class="num">1.0</span>*L_vf - <span class="num">0.02</span>*entropy`,
  },
  {
    title: 'Policy Refresh & LR Decay',
    desc: 'Every 100 epochs, small Gaussian noise is injected into actor weights to escape local optima. A linear LR scheduler decays the learning rate from 3e-4 to 3e-5 over 1000 epochs.',
    code: `<span class="cm"># Break local optima every 100 epochs</span>
param += <span class="fn">randn_like</span>(param) * <span class="num">0.1</span>
scheduler.<span class="fn">step</span>()  <span class="cm"># 3e-4 → 3e-5</span>`,
  },
]

export default function DRLSection() {
  const [ref, inView] = useInView()

  return (
    <section className="section" id="drl" ref={ref}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
      >
        <div className="section-label">Model 1</div>
        <h2 className="section-title">DRL-PPO — Emergency Vehicle Lane Change</h2>
        <p className="section-desc">
          A single-agent Proximal Policy Optimization model that learns to navigate an
          emergency vehicle through traffic by choosing to move left, stay, or move right
          at each decision step.
        </p>
      </motion.div>

      <motion.div
        className="arch-split"
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.15 }}
      >
        {/* Network Architecture */}
        <div className="arch-panel">
          <div className="arch-panel-header">
            <div className="arch-panel-dot blue" />
            <div className="arch-panel-title">ACTOR NETWORK ARCHITECTURE</div>
          </div>
          <div className="arch-panel-body">
            <div className="network-diagram">
              {[
                { label: 'Input', bar: 'input', text: '29 features', size: '29' },
                { label: '', bar: '', text: '', size: '', arrow: true },
                { label: 'Hidden 1', bar: 'h1', text: 'Linear → ReLU', size: '64' },
                { label: '', bar: '', text: '', size: '', arrow: true },
                { label: 'Hidden 2', bar: 'h2', text: 'Linear → ReLU', size: '128' },
                { label: '', bar: '', text: '', size: '', arrow: true },
                { label: 'Hidden 3', bar: 'h3', text: 'Linear → ReLU', size: '64' },
                { label: '', bar: '', text: '', size: '', arrow: true },
                { label: 'Output', bar: 'output', text: 'Logits → Categorical', size: '3' },
              ].map((row, i) =>
                row.arrow ? (
                  <div key={i} className="net-arrow" style={{ alignSelf: 'center' }}>↓</div>
                ) : (
                  <div className="net-layer" key={i}>
                    <div className="net-label">{row.label}</div>
                    <div className={`net-bar ${row.bar}`}>{row.text}</div>
                    <div className="net-size">{row.size}</div>
                  </div>
                )
              )}
            </div>
            <div style={{ marginTop: '1.5rem' }}>
              <div className="state-group-label" style={{ marginBottom: '0.75rem' }}>Critic mirrors Actor → outputs scalar V(s)</div>
              <div className="params-list">
                <div className="param-row">
                  <span className="param-key">Optimizer</span>
                  <span className="param-val">Adam (shared)</span>
                </div>
                <div className="param-row">
                  <span className="param-key">Value Loss</span>
                  <span className="param-val green">Huber (SmoothL1)</span>
                </div>
                <div className="param-row">
                  <span className="param-key">Grad Clip</span>
                  <span className="param-val purple">0.5</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* State Space + Hyperparams */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="arch-panel">
            <div className="arch-panel-header">
              <div className="arch-panel-dot green" />
              <div className="arch-panel-title">STATE VECTOR — 29 DIMENSIONS</div>
            </div>
            <div className="arch-panel-body">
              <div className="state-vector">
                <div className="state-group">
                  <div className="state-group-label">6 Nearest Vehicles × 4 features = 24</div>
                  <div className="state-fields">
                    {['lane_idx', 'speed', 'acceleration', 'rel_distance'].map(f => (
                      <span key={f} className="state-field blue">{f}</span>
                    ))}
                  </div>
                </div>
                <div className="state-group" style={{ marginTop: '0.75rem' }}>
                  <div className="state-group-label">EV Features × 5</div>
                  <div className="state-fields">
                    {['ev_lane', 'ev_speed', 'ev_acc', 'padding', 'ev_pos'].map(f => (
                      <span key={f} className="state-field green">{f}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="arch-panel">
            <div className="arch-panel-header">
              <div className="arch-panel-dot blue" />
              <div className="arch-panel-title">HYPERPARAMETERS</div>
            </div>
            <div className="arch-panel-body">
              <div className="params-list">
                {params.map(p => (
                  <div className="param-row" key={p.key}>
                    <span className="param-key">{p.key}</span>
                    <span className={`param-val ${p.color}`}>{p.val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Training Flow */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.3 }}
        style={{ marginTop: '4rem' }}
      >
        <div className="section-label">Training Pipeline</div>
        <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.5rem' }}>How the Agent Learns</h3>
        <p className="section-desc" style={{ marginBottom: 0 }}>
          Each epoch collects a 128-step rollout, computes GAE advantages, then runs 4 PPO update passes.
        </p>
        <div className="training-flow" style={{ marginTop: '2.5rem' }}>
          {steps.map((s, i) => (
            <div className="flow-step" key={s.title}>
              <div className="flow-num">{String(i + 1).padStart(2, '0')}</div>
              <div className="flow-content">
                <div className="flow-title">{s.title}</div>
                <div className="flow-desc">{s.desc}</div>
                <div className="flow-code" dangerouslySetInnerHTML={{ __html: s.code }} />
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
