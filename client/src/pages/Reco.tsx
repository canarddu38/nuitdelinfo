import { useMemo, useState } from 'react'

type Step = { id: number; title: string; desc: string }

const STEPS: Step[] = [
  { id: 1, title: 'Inspecter le PC', desc: "Vérifier l'état général : boîtier, connecteurs, batterie (si portable) et composants visibles." },
  { id: 2, title: 'Nettoyer', desc: "Dépoussiérer ventilateurs, radiateurs et connecteurs pour éviter surchauffe." },
  { id: 3, title: 'Tester la RAM', desc: "Vérifier la mémoire (memtest simulé) et reseater les barrettes." },
  { id: 4, title: 'Remplacer le disque', desc: "Remplacer disque vieillissant par un SSD pour vitesse et fiabilité." },
  { id: 5, title: 'Mettre à jour le BIOS/firmware', desc: "Appliquer mise à jour firmware si nécessaire (simulé)." },
  { id: 6, title: 'Réinstaller OS', desc: "Installer un système léger (ex: Linux) et configurer les pilotes." },
  { id: 7, title: 'Tester & finaliser', desc: "Vérifier le démarrage, connexion réseau et performance ; emballer." },
]

function shuffle<T>(arr: T[]) {
  const a = arr.slice()
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function Reco() {
  const correctOrder = useMemo(() => STEPS.map(s => s.title), [])
  const [shuffled, setShuffled] = useState<string[]>(() => shuffle(correctOrder))
  const [index, setIndex] = useState(0)
  const [strikes, setStrikes] = useState(0)
  const [lastFeedback, setLastFeedback] = useState<string | null>(null)
  const [revealed, setRevealed] = useState<Record<string, boolean>>({})

  function handlePick(title: string) {
    if (index >= correctOrder.length) return

    if (title === correctOrder[index]) {
      setIndex(i => i + 1)
      setLastFeedback('Correct ✓')
      setRevealed(r => ({ ...r, [title]: true }))
      setShuffled(s => s.map(x => (x === title ? '' : x)))
    } else {
      setStrikes(s => s + 1)
      setLastFeedback('Mauvais ordre ✗')
      const next = correctOrder[index]
      setRevealed(r => ({ ...r, [next]: true }))
    }

    setTimeout(() => setLastFeedback(null), 900)
  }

  function restart() {
    setShuffled(shuffle(correctOrder))
    setIndex(0)
    setStrikes(0)
    setLastFeedback(null)
    setRevealed({})
  }

  const progress = Math.round((index / correctOrder.length) * 100)
  const done = index >= correctOrder.length

  return (
    <>
      <style>{`
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: Arial, sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 20px;
}

h1 {
  font-size: clamp(2rem, 8vw, 3.5rem);
  margin-bottom: 30px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.info {
  display: flex;
  gap: 30px;
  margin-bottom: 20px;
  font-size: clamp(1rem, 4vw, 1.2rem);
  text-align: center;
}

.message {
  margin: 10px 0;
  padding: 10px 15px;
  border-radius: 10px;
  text-align: center;
  max-width: 90vw;
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.message.won {
  background: rgba(16, 185, 129, 0.3);
  border: 2px solid #10b981;
}

.message .title {
  font-size: clamp(1.5rem, 5vw, 2rem);
  margin-bottom: 10px;
  font-weight: bold;
}

.message strong {
  color: #ffd700;
}

/* Keyboard */

.keyboard {
  margin-top: 30px;
  width: 100%;
  max-width: 600px;
}

.keyboard-row {
  display: flex;
  gap: 6px;
  margin-bottom: 8px;
  justify-content: center;
  flex-wrap: wrap;
}

.key {
  padding: 10px 12px;
  font-size: clamp(0.7rem, 2vw, 0.9rem);
  background: rgba(255,255,255,0.2);
  color: white;
  border: 1px solid rgba(255,255,255,0.4);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  font-weight: bold;
  min-width: 35px;
}

.key:hover:not(:disabled) {
  background: rgba(255,255,255,0.3);
  transform: scale(1.05);
}

.key.present {
  background: #f59e0b;
  border-color: #f59e0b;
}

.key.special {
  min-width: 60px;
  background: rgba(102,126,234,0.3);
  border-color: rgba(102,126,234,0.6);
}

.message.validated {
  opacity: 0.6;
  text-decoration: line-through;
  padding: 5px 10px;
  font-size: 0.85rem;
  text-align: center;
}

@media (max-width:600px) {
  .container {
    padding: 15px;
  }

  h1 {
    margin-bottom: 20px;
  }

  .info {
    gap: 20px;
    margin-bottom: 15px;
  }

  .key {
    padding: 8px 10px;
    min-width: 30px;
  }
}
      `}</style>

      <div className="container">
        <h1>Reconditionne ton PC !</h1>

        <div className="info" style={{ justifyContent: 'space-between', gap: 12 }}>
          <div>
            <strong>Objectif</strong>
            <div style={{ color: '#cbd5e1', fontSize: 13 }}>
              Choisis les étapes dans le bon ordre pour reconditionner un vieux PC.
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div>Progress : <strong>{progress}%</strong></div>
            <div style={{ background: 'rgba(255,255,255,0.1)', width: 220, height: 10, borderRadius: 6, marginTop: 6 }}>
              <div style={{ width: `${progress}%`, height: '100%', background: '#10b981', borderRadius: 6 }} />
            </div>
            <div style={{ marginTop: 6, color: '#f59e0b' }}>
              Strikes : {strikes}
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gap: 6, width: '100%', maxWidth: 600 }}>
          {shuffled.map((t, i) =>
            t ? (
              <button key={i} className={`key ${revealed[t] ? 'present' : ''}`} onClick={() => handlePick(t)}>
                {t}
              </button>
            ) : (
              <div key={i} className="message validated">Étape validée</div>
            )
          )}
        </div>

        {lastFeedback && <div className="message">{lastFeedback}</div>}

        <div className="keyboard">
          <div className="keyboard-row">
            <button className="key special" onClick={restart}>Recommencer</button>
          </div>
        </div>

        {done && (
          <div className="message won">
            <div className="title">Bravo 🎉</div>
            <div>PC reconditionné avec succès !</div>
          </div>
        )}
      </div>
    </>
  )
}
