import { useState } from 'react'

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
    <div className="min-h-screen w-full flex flex-col items-center px-4 py-7 bg-gradient-to-b from-[#6b63e6] via-[#7a5fd3] to-[#6f5bb3] text-white">

      <h1 className="text-5xl md:text-4xl sm:text-[34px] mb-4 text-center font-bold drop-shadow-lg">
        Memory: mot ↔ définition
      </h1>

      <div className="mb-4">
        <button
          onClick={resetGame}
          className="px-4 py-2 rounded-xl bg-white/10 border border-white/10 shadow-lg font-bold hover:bg-white/20 transition"
        >
          Nouvelle partie
        </button>
      </div>

      <p className="text-2xl font-bold mb-4 drop-shadow-lg">
        Score: {score}
      </p>

      {win && (
        <div className="mb-4 px-4 py-2 rounded-lg bg-white/10 font-extrabold text-center">
          Bravo — toutes les tuiles sont trouvées, vous avez gagné !
        </div>
      )}

      {/* GRID */}
      <div className="flex flex-col items-center gap-3 max-w-[1040px] mx-auto">
        {grid.map((row, i) => (
          <div
            key={i}
            className="flex gap-3 flex-wrap justify-center"
          >
            {row.map((card, j) => {
              const isOpen = open[i][j]
              const isFound = found[i][j]

              return (
                <div
                  key={j}
                  onClick={() => flip(i, j)}
                  className={`
                    w-[200px] h-[200px] md:w-[140px] md:h-[140px]
                    sm:w-[calc(50%-8px)] sm:h-[110px]
                    text-[22px] md:text-[20px] sm:text-[16px]
                    flex items-center justify-center text-center
                    rounded-lg p-2 select-none cursor-pointer
                    border border-white/10 shadow-xl
                    transition-all duration-150 ease-out
                    ${isOpen || isFound ? 'bg-white text-[#222]' : 'bg-[#7a63d6] text-transparent hover:-translate-y-1 hover:scale-[1.02] hover:shadow-2xl'}
                    ${isFound ? 'bg-emerald-600 text-white scale-[1.02]' : ''}
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
      <div className="mt-5 w-full max-w-md bg-white/5 p-3 rounded-lg border-t border-white/10">
        <h3 className="font-bold mb-2">Pairs validées</h3>

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
            return <div className="opacity-70">Aucune paire validée</div>

          return (
            <ul className="space-y-1 text-sm">
              {pairs.map((p, idx) => (
                <li
                  key={idx}
                  className="p-2 rounded bg-gradient-to-r from-white/5 to-white/0"
                >
                  {p}
                </li>
              ))}
            </ul>
          )
        })()}
      </div>
    </div>
  )
}
