import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ColorBends from '../components/utils/ColorBends';
import TextPressure from '../components/utils/TextPressure';
import ShinyText from '../components/utils/ShinyText';

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
  const navigate = useNavigate()
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
    <div className="relative w-full min-h-screen overflow-x-hidden bg-[#0a0a0a]">
      {/* Background Animation */}
      <div className="absolute inset-0 z-0">
        <ColorBends
          colors={["#1D6618", "#46D93B", "#00ffd1"]}
          rotation={0}
          speed={0.2}
          scale={0.5}
          frequency={0.8}
          warpStrength={1.0}
          mouseInfluence={1.0}
          parallax={0.6}
          noise={0.1}
        />
      </div>

      <div className="relative z-10 w-full min-h-screen flex flex-col items-center justify-center px-4 py-8">
        <div className="mb-8 w-full max-w-4xl text-center">
             <TextPressure
              text="Reconditionne ton PC !"
              flex={true}
              alpha={false}
              stroke={false}
              width={true}
              weight={false}
              italic={true}
              textColor="#ffffff"
              strokeColor="#ff0000"
              className="text-center w-full"
              minFontSize={36}
            />
        </div>

        <div 
          className="w-full max-w-2xl mb-8 p-6 rounded-2xl shadow-2xl"
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-white">
            <div className="text-center sm:text-left">
              <strong className="text-lg">Objectif</strong>
              <div className="text-white/70 text-sm mt-1">
                Choisis les étapes dans le bon ordre pour reconditionner un vieux PC.
              </div>
            </div>

            <div className="text-center sm:text-right min-w-[200px]">
              <div className="mb-2">Progress : <strong className="text-[#46D93B]">{progress}%</strong></div>
              <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#46D93B] transition-all duration-500"
                  style={{ width: `${progress}%` }} 
                />
              </div>
              <div className="mt-2 text-red-400 text-sm font-medium">
                Erreurs : {strikes}
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-3 w-full max-w-2xl">
          {shuffled.map((t, i) =>
            t ? (
              <button 
                key={i} 
                className={`p-4 rounded-xl border transition-all duration-300 font-medium text-left ${
                  revealed[t] 
                    ? 'bg-[#46D93B]/20 border-[#46D93B] text-[#46D93B]' 
                    : 'bg-white/5 border-white/10 text-white hover:bg-white/10 hover:scale-[1.02]'
                }`}
                style={{ backdropFilter: 'blur(5px)' }}
                onClick={() => handlePick(t)}
              >
                {t}
              </button>
            ) : (
              <div 
                key={i} 
                className="p-3 rounded-xl bg-white/5 border border-white/5 text-white/30 text-center text-sm italic"
              >
                Étape validée
              </div>
            )
          )}
        </div>

        {lastFeedback && (
          <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 px-6 py-3 rounded-full backdrop-blur-md border font-bold animate-[slideIn_0.3s_ease-out] ${
            lastFeedback.includes('Correct') 
              ? 'bg-[#46D93B]/20 border-[#46D93B] text-[#46D93B]' 
              : 'bg-red-500/20 border-red-500 text-red-500'
          }`}>
            {lastFeedback}
          </div>
        )}

        <div className="mt-8 flex gap-4">
          <button 
            className="cursor-pointer transition-transform duration-300 hover:scale-105 text-white px-6 py-3 rounded-[50px] font-medium"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
            onClick={restart}
          >
            Recommencer
          </button>

          <button 
            className="cursor-pointer transition-transform duration-300 hover:scale-105 text-white px-6 py-3 rounded-[50px] font-medium"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
            onClick={() => navigate(-1)}
          >
            Retour
          </button>
        </div>

        {done && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={restart}
          >
            <div 
              className="max-w-md w-full p-8 rounded-2xl text-center border animate-[slideIn_0.3s_ease-out]"
              style={{
                background: 'rgba(16, 185, 129, 0.1)',
                backdropFilter: 'blur(20px)',
                border: '1px solid #10b981',
              }}
              onClick={e => e.stopPropagation()}
            >
              <h2 className="text-3xl font-bold mb-4 text-white">Bravo 🎉</h2>
              <p className="text-white/80 mb-8">PC reconditionné avec succès !</p>
              <button 
                className="cursor-pointer transition-transform duration-300 hover:scale-105 text-white px-8 py-3 rounded-[50px] font-medium"
                style={{
                  background: 'rgba(0, 207, 0, 0.1)',
                  border: '1px solid rgba(0, 207, 0, 0.5)',
                }}
                onClick={restart}
              >
                <ShinyText text="Rejouer" disabled={false} speed={3} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
