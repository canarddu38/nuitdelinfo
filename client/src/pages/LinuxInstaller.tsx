import { useState } from 'react'

type Step = {
  id: number
  title: string
  desc: string
  hint: string
}

const STEPS: Step[] = [
  { id: 1, title: 'Vérifier le disque', desc: "S'assurer que le disque est visible (ex: /dev/sda).", hint: 'lsblk' },
  { id: 2, title: 'Partitionner (simulé)', desc: 'Créer une partition Linux.', hint: 'parted /dev/sda mkpart primary ext4 1MiB 100%' },
  { id: 3, title: 'Formater & monter', desc: 'Formater la partition et la monter.', hint: 'mkfs.ext4 /dev/sda1 && mount /mnt' },
  { id: 4, title: 'Installer le système', desc: 'Copier les fichiers de base.', hint: 'install-base' },
  { id: 5, title: 'Configurer utilisateur & boot', desc: 'Créer utilisateur + installer GRUB.', hint: 'useradd demo && grub-install /dev/sda' },
  { id: 6, title: 'Redémarrer', desc: 'Redémarrer le système.', hint: 'reboot' },
]

export default function LinuxInstaller() {
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
    <div className="min-h-screen flex flex-col items-center justify-center p-5 text-white bg-gradient-to-br from-indigo-500 to-purple-600">

      <h1 className="text-[clamp(2rem,8vw,3.5rem)] font-bold mb-8 drop-shadow-md">
        Installation Linux
      </h1>

      <div className="flex gap-8 text-lg mb-5 text-center">
        <p>
          Étapes : <span className="font-bold text-yellow-400">{completed}</span> / {STEPS.length}
        </p>
        <p>
          Progression : <span className="font-bold text-yellow-400">{progress}%</span>
        </p>
      </div>

      <ol className="w-full max-w-3xl space-y-3">
        {STEPS.map((step, i) => (
          <li key={step.id}>
            <div className={`rounded-xl border-2 p-4 transition
              ${done[i]
                ? 'bg-emerald-500/30 border-emerald-500'
                : 'bg-white/10 border-white/30'}`
            }>
              <h2 className="text-xl font-bold">
                {i + 1}. {step.title}
              </h2>

              <p className="text-slate-200 mt-1">
                {step.desc}
              </p>

              <p className="mt-2 font-mono text-sm text-slate-300">
                {step.hint}
              </p>

              <div className="flex justify-end mt-4">
                <button
                  onClick={() => toggleStep(i)}
                  className="px-4 py-2 rounded-md font-bold
                    bg-indigo-400/30 border border-indigo-300/50
                    hover:bg-indigo-400/40 transition
                    disabled:opacity-50"
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
          className="px-6 py-2 font-bold rounded-md
            bg-indigo-400/40 border border-indigo-300
            hover:scale-105 transition disabled:opacity-50"
        >
          {runningAuto ? 'Automatique…' : 'Lancer tout'}
        </button>

        <button
          onClick={reset}
          className="px-6 py-2 font-bold rounded-md
            bg-indigo-400/40 border border-indigo-300
            hover:scale-105 transition"
        >
          Réinitialiser
        </button>
      </div>

      {allDone && (
        <div className="mt-8 max-w-lg text-center rounded-2xl p-5 border-2
          bg-emerald-500/30 border-emerald-500 animate-[slideIn_0.3s_ease-out]">

          <h2 className="text-2xl font-bold mb-3">
            Installation terminée 🎉
          </h2>

          <ul className="space-y-1 mb-5">
            <li>Système installé</li>
            <li>Utilisateur créé</li>
            <li>Chargeur configuré</li>
          </ul>

          <button
            onClick={() => alert('Redémarrage simulé — Linux prêt !')}
            className="px-6 py-2 font-bold rounded-md
              bg-indigo-400/40 border border-indigo-300 hover:scale-105 transition"
          >
            Redémarrer
          </button>
        </div>
      )}
    </div>
  )
}
