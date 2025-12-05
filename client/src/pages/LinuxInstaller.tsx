import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ColorBends from '../components/utils/ColorBends';
import TextPressure from '../components/utils/TextPressure';
import ShinyText from '../components/utils/ShinyText';

type Step = {
  id: number
  title: string
  desc: string
  hint: string
}

const STEPS: Step[] = [
  {
    id: 1,
    title: "Télécharger l'ISO",
    desc: "Télécharger l'image ISO de la distribution Linux souhaitée.",
    hint: "wget https://example.com/linux.iso"
  },
  {
    id: 2,
    title: "Créer la clé USB bootable",
    desc: "Flasher l'ISO sur une clé USB avec un outil comme Rufus ou balenaEtcher.",
    hint: "balena-etcher linux.iso /dev/sdb"
  },
  {
    id: 3,
    title: "Démarrer sur la clé",
    desc: "Redémarrer le PC et booter sur la clé USB via le menu de boot.",
    hint: "F12 / F8 / ESC selon le fabricant"
  },
  {
    id: 4,
    title: "Lancer l'installation",
    desc: "Choisir 'Install Linux' depuis le menu de démarrage.",
    hint: "Start Installer"
  },
  {
    id: 5,
    title: "Installer Linux",
    desc: "Choisir la langue, le clavier, le disque et lancer la copie des fichiers.",
    hint: "Installation en cours..."
  },
  {
    id: 6,
    title: "Premier démarrage",
    desc: "Retirer la clé USB, redémarrer et accéder au bureau Linux.",
    hint: "reboot"
  }
]

export default function LinuxInstaller() {
  const navigate = useNavigate()
  const [done, setDone] = useState<boolean[]>(Array(STEPS.length).fill(false))
  const [runningAuto, setRunningAuto] = useState(false)

  const completed = done.filter(Boolean).length
  const progress = Math.round((completed / STEPS.length) * 100)
  const allDone = completed === STEPS.length

  function toggleStep(i: number) {
    setDone(prev => {
      const n = [...prev]
      n[i] = !n[i]
      return n
    })
  }

  function reset() {
    setDone(Array(STEPS.length).fill(false))
    setRunningAuto(false)
  }

  async function runAuto() {
    if (runningAuto) return
    setRunningAuto(true)

    for (let i = 0; i < STEPS.length; i++) {
      await new Promise(res => setTimeout(res, 600))
      setDone(prev => {
        const n = [...prev]
        n[i] = true
        return n
      })
    }

    setRunningAuto(false)
  }

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
              text="Installation Linux"
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

        <div className="flex gap-8 text-lg mb-5 text-center text-white">
          <p>
            Étapes : <span className="font-bold text-[#46D93B]">{completed}</span> / {STEPS.length}
          </p>
          <p>
            Progression : <span className="font-bold text-[#46D93B]">{progress}%</span>
          </p>
        </div>

        <ol className="w-full max-w-3xl space-y-3">
          {STEPS.map((step, i) => (
            <li key={step.id}>
              <div 
                className={`rounded-xl p-4 transition border ${
                  done[i]
                    ? 'bg-[#46D93B]/20 border-[#46D93B]'
                    : 'bg-white/5 border-white/10'
                }`}
                style={{
                  backdropFilter: 'blur(10px)',
                }}
              >
                <h2 className="text-xl font-bold text-white">
                  {i + 1}. {step.title}
                </h2>

                <p className="text-white/70 mt-1">
                  {step.desc}
                </p>

                <p className="mt-2 font-mono text-sm text-[#46D93B]">
                  {step.hint}
                </p>

                <div className="flex justify-end mt-4">
                  <button
                    onClick={() => toggleStep(i)}
                    className={`px-4 py-2 rounded-[50px] font-bold text-sm transition-all ${
                      done[i] 
                        ? 'bg-[#46D93B]/20 text-[#46D93B] border border-[#46D93B]/50' 
                        : 'bg-white/10 text-white border border-white/20 hover:bg-white/20'
                    }`}
                  >
                    {done[i] ? 'Fait ✓' : 'Marquer fait'}
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ol>

        <div className="flex gap-4 mt-6">
          <button
            onClick={runAuto}
            disabled={runningAuto || allDone}
            className="cursor-pointer transition-transform duration-300 hover:scale-105 text-white px-6 py-3 rounded-[50px] font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: 'rgba(0, 207, 0, 0.05)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(0, 207, 0, 0.3)',
            }}
          >
            <ShinyText text={runningAuto ? 'Automatique…' : 'Lancer tout'} disabled={false} speed={3} />
          </button>

          <button
            onClick={reset}
            className="cursor-pointer transition-transform duration-300 hover:scale-105 text-white px-6 py-3 rounded-[50px] font-medium"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            Réinitialiser
          </button>
        </div>

        <div className="mt-8">
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

        {allDone && (
          <div 
            className="mt-8 max-w-lg text-center rounded-2xl p-6 border animate-[slideIn_0.3s_ease-out]"
            style={{
              background: 'rgba(70, 217, 59, 0.1)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(70, 217, 59, 0.3)',
            }}
          >
            <h2 className="text-2xl font-bold mb-3 text-white">
              Installation terminée 🎉
            </h2>

            <ul className="space-y-1 mb-5 text-white/80">
              <li>Système installé</li>
              <li>Utilisateur créé</li>
              <li>Chargeur configuré</li>
            </ul>

            <button
              onClick={() => alert('Redémarrage simulé — Linux prêt !')}
              className="cursor-pointer transition-transform duration-300 hover:scale-105 text-white px-6 py-3 rounded-[50px] font-medium"
              style={{
                background: 'rgba(0, 207, 0, 0.05)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(0, 207, 0, 0.3)',
              }}
            >
              <ShinyText text="Redémarrer" disabled={false} speed={3} />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
