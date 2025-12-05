import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ColorBends from '../components/utils/ColorBends'
import TextPressure from '../components/utils/TextPressure'
import ShinyText from '../components/utils/ShinyText'

type Card = { id: number; kind: 'word' | 'def'; text: string }

const items: { id: number; word: string; def: string }[] = [
  { id: 1, word: 'PC trop lent', def: "Installer Linux léger" },
  { id: 2, word: 'Plus de mises à jour Windows', def: "Installer un SSD ou changer le disque" },
  { id: 3, word: 'Logiciels trop chers', def: "Utiliser des alternatives libres" },
  { id: 4, word: 'Ordinateur chauffe beaucoup', def: "Installer Linux pour continuer à utiliser le PC en sécurité" },
  { id: 5, word: 'Trop peu de stockage disponible', def: "Dépoussiérage + nettoyage interne" },
  { id: 6, word: 'Connexion internet trop limitée', def: "Utiliser des outils légers + synchronisation locale (ex : Nextcloud local)" },
]

function makeGrid(rows: number, cols: number) {
  const cards: Card[] = []

  for (const it of items) {
    cards.push({ id: it.id, kind: 'word', text: it.word })
    cards.push({ id: it.id, kind: 'def', text: it.def })
  }

  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[cards[i], cards[j]] = [cards[j], cards[i]]
  }

  const g: Card[][] = []
  let k = 0

  for (let r = 0; r < rows; r++) {
    const row: Card[] = []
    for (let c = 0; c < cols; c++) {
      row.push(cards[k++])
    }
    g.push(row)
  }

  return g
}

export default function Memory() {
  const navigate = useNavigate()
  const ROWS = 3
  const COLS = 4

  const [grid, setGrid] = useState<Card[][]>(() => makeGrid(ROWS, COLS))
  const [score, setScore] = useState(0)

  const [open, setOpen] = useState<boolean[][]>(
    Array.from({ length: ROWS }, () => Array(COLS).fill(false))
  )

  const [found, setFound] = useState<boolean[][]>(
    Array.from({ length: ROWS }, () => Array(COLS).fill(false))
  )

  const [busy, setBusy] = useState(false)
  const [win, setWin] = useState(false)

  function resetGame() {
    setGrid(makeGrid(ROWS, COLS))
    setOpen(Array.from({ length: ROWS }, () => Array(COLS).fill(false)))
    setFound(Array.from({ length: ROWS }, () => Array(COLS).fill(false)))
    setScore(0)
    setBusy(false)
    setWin(false)
  }

  function flip(r: number, c: number) {
    if (busy || found[r][c] || open[r][c] || win) return

    const no = open.map(row => row.slice())
    no[r][c] = true
    setOpen(no)

    const others: Array<[number, number]> = []

    for (let i = 0; i < ROWS; i++)
      for (let j = 0; j < COLS; j++)
        if (no[i][j] && !(i === r && j === c) && !found[i][j])
          others.push([i, j])

    if (others.length === 1) {
      const [r0, c0] = others[0]

      setBusy(true)
      setTimeout(() => {
        const cardA = grid[r0][c0]
        const cardB = grid[r][c]

        if (cardA.id === cardB.id && cardA.kind !== cardB.kind) {
          const nf = found.map(row => row.slice())
          nf[r0][c0] = true
          nf[r][c] = true
          setFound(nf)
          setScore(s => s + 1)

          if (nf.every(row => row.every(v => v))) setWin(true)
        } else {
          const nh = open.map(row => row.slice())
          nh[r0][c0] = false
          nh[r][c] = false
          setOpen(nh)
        }

        setBusy(false)
      }, 900)
    }
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

      <div className="relative z-10 w-full min-h-screen flex flex-col items-center px-4 py-8">
        <div className="mb-8 w-full max-w-4xl text-center">
          <TextPressure
            text="Memory"
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

        <div className="mb-6 flex flex-col items-center gap-4">
          <div className="flex gap-4">
            <button
              onClick={resetGame}
              className="px-6 py-2 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
            >
              Nouvelle partie
            </button>
            <span className="px-6 py-2 rounded-full bg-[#46D93B]/20 border border-[#46D93B] text-[#46D93B] font-bold backdrop-blur-sm">
              Score: {score}
            </span>
          </div>
        </div>

        {/* GRID */}
        <div className="flex flex-col items-center gap-4 w-full max-w-5xl mx-auto p-6 rounded-2xl"
             style={{
               background: 'rgba(255, 255, 255, 0.05)',
               backdropFilter: 'blur(10px)',
               border: '1px solid rgba(255, 255, 255, 0.1)',
             }}>
          {grid.map((row, i) => (
            <div
              key={i}
              className="flex gap-4 flex-wrap justify-center w-full"
            >
              {row.map((card, j) => {
                const isOpen = open[i][j]
                const isFound = found[i][j]

                return (
                  <div
                    key={j}
                    onClick={() => flip(i, j)}
                    className={`
                      w-[140px] h-[140px] md:w-[160px] md:h-[160px] lg:w-[180px] lg:h-[180px]
                      text-sm md:text-base lg:text-lg
                      flex items-center justify-center text-center
                      rounded-xl p-4 select-none cursor-pointer
                      border shadow-xl
                      transition-all duration-300 ease-out
                      ${isOpen || isFound 
                        ? isFound 
                          ? 'bg-[#46D93B]/20 border-[#46D93B] text-[#46D93B]' 
                          : 'bg-white/20 border-white text-white'
                        : 'bg-white/5 border-white/10 text-transparent hover:bg-white/10 hover:-translate-y-1 hover:scale-[1.02]'}
                    `}
                  >
                    {(isOpen || isFound) ? card.text : ''}
                  </div>
                )
              })}
            </div>
          ))}
        </div>

        {/* SUMMARY */}
        <div className="mt-8 w-full max-w-md p-6 rounded-xl border border-white/10 backdrop-blur-md bg-white/5">
          <h3 className="font-bold mb-4 text-white text-lg">Paires validées</h3>

          {(() => {
            const ids = new Set<number>()

            for (let i = 0; i < ROWS; i++)
              for (let j = 0; j < COLS; j++)
                if (found[i][j]) ids.add(grid[i][j].id)

            const pairs = Array.from(ids).map(id => {
              const it = items.find(x => x.id === id)!
              return `${it.word} : ${it.def}`
            })

            if (!pairs.length)
              return <div className="text-white/50 italic">Aucune paire validée</div>

            return (
              <ul className="space-y-2 text-sm text-white/80">
                {pairs.map((p, idx) => (
                  <li
                    key={idx}
                    className="p-3 rounded-lg bg-white/5 border border-white/5"
                  >
                    {p}
                  </li>
                ))}
              </ul>
            )
          })()}
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
      </div>

      {win && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={() => navigate('../dashboard')}>
          <div className="flex flex-col items-center justify-center h-full text-white text-center">
            <ShinyText
              text="Bien joué !"
              className="text-5xl mb-6"
              disabled={false}
              speed={3}
            />
            <p className="text-xl text-white/80 mb-8">Toutes les tuiles sont trouvées !</p>
            <p className="text-white/60 animate-pulse">Clique pour retourner au Menu</p>
          </div>
        </div>
      )}
    </div>
  )
}
