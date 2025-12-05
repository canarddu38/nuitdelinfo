import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ColorBends from '../components/utils/ColorBends';
import TextPressure from '../components/utils/TextPressure';
import ShinyText from '../components/utils/ShinyText';

const WORD_LIST = ['INCLUSIF', 'RESPONSABLE', 'DURABLE']

type Status = 'empty' | 'correct' | 'present' | 'absent'
type KeyStatus = 'unused' | 'correct' | 'present' | 'absent'

export default function Wordle() {
  const navigate = useNavigate()

  const [targetWord, setTargetWord] = useState('')
  const [guesses, setGuesses] = useState<string[]>([])
  const [currentGuess, setCurrentGuess] = useState('')
  const [gameOver, setGameOver] = useState(false)
  const [won, setWon] = useState(false)

  const currentGuessRef = useRef(currentGuess)
  const gameOverRef = useRef(gameOver)
  const targetRef = useRef(targetWord)

  const WORD_LENGTH = targetWord.length
  const MAX_GUESSES = Math.ceil(targetWord.length / 2) + 3

  useEffect(() => {
    const w = WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)]
    setTargetWord(w)
    targetRef.current = w
  }, [])

  useEffect(() => { currentGuessRef.current = currentGuess }, [currentGuess])
  useEffect(() => { gameOverRef.current = gameOver }, [gameOver])
  useEffect(() => { targetRef.current = targetWord }, [targetWord])

useEffect(() => {
  const onKey = (e: KeyboardEvent) => {
    if (gameOver || !targetWord) return
    const k = e.key.toUpperCase()
    if (/^[A-Z]$/.test(k) && currentGuess.length < WORD_LENGTH) {
      setCurrentGuess(prev => prev + k)
    } else if (e.key === 'Backspace') {
      setCurrentGuess(prev => prev.slice(0, -1))
    } else if (e.key === 'Enter') {
      submitGuess()
    }
  }
  window.addEventListener('keydown', onKey)
  return () => window.removeEventListener('keydown', onKey)
}, [currentGuess, gameOver, targetWord])

  function getLetterAtPosition(row: number, col: number): string {
    if (row < guesses.length) return guesses[row][col] || ''
    if (row === guesses.length) return currentGuess[col] || ''
    return ''
  }

  function getLetterStatus(row: number, col: number): Status {
    if (row >= guesses.length) return 'empty'
    const guess = guesses[row]
    if (guess.length !== targetWord.length) return 'empty'

    const counts: Record<string, number> = {}
    for (let i = 0; i < targetWord.length; i++) counts[targetWord[i]] = (counts[targetWord[i]] || 0) + 1

    const statuses: Status[] = Array(guess.length).fill('empty')
    for (let i = 0; i < guess.length; i++) {
      if (targetWord[i] === guess[i]) { statuses[i] = 'correct'; counts[guess[i]]!-- }
    }
    for (let i = 0; i < guess.length; i++) {
      if (statuses[i] === 'correct') continue
      const g = guess[i]
      if (counts[g] > 0) { statuses[i] = 'present'; counts[g]!-- } else { statuses[i] = 'absent' }
    }
    return statuses[col]
  }

  function getKeyboardLetterStatus(letter: string): KeyStatus {
    let hasCorrect = false, hasPresent = false, hasAbsent = false
    for (const guess of guesses) {
      for (let i = 0; i < guess.length; i++) {
        if (guess[i] !== letter) continue
        if (targetWord[i] === letter) hasCorrect = true
        else if (targetWord.includes(letter)) hasPresent = true
        else hasAbsent = true
      }
    }
    if (hasCorrect) return 'correct'
    if (hasPresent) return 'present'
    if (hasAbsent) return 'absent'
    return 'unused'
  }

  function submitGuess() {
  if (gameOver) return
  if (currentGuess.length !== WORD_LENGTH) return

  const nextGuesses = [...guesses, currentGuess]
  setGuesses(nextGuesses)
  setCurrentGuess('')

  if (currentGuess === targetWord) {
    setWon(true)
    setGameOver(true)
  } else if (nextGuesses.length >= MAX_GUESSES) {
    setGameOver(true)
  }
}


  function resetGame() {
    const w = WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)]
    setTargetWord(w); targetRef.current = w
    setGuesses([]); setCurrentGuess(''); currentGuessRef.current = ''
    setGameOver(false); gameOverRef.current = false; setWon(false)
  }

  const KEYBOARD_ROWS = [
    ['Q','W','E','R','T','Y','U','I','O','P'],
    ['A','S','D','F','G','H','J','K','L'],
    ['Z','X','C','V','B','N','M'],
  ]

  const statusClass = {
    empty: 'bg-white/5 border-white/10',
    correct: 'bg-[#46D93B]/20 border-[#46D93B] text-[#46D93B]',
    present: 'bg-yellow-500/20 border-yellow-500 text-yellow-500',
    absent: 'bg-white/5 border-white/10 text-white/30',
  }

  const keyStatusClass = {
    unused: 'bg-white/10 border-white/20 text-white hover:bg-white/20',
    correct: 'bg-[#46D93B]/20 border-[#46D93B] text-[#46D93B]',
    present: 'bg-yellow-500/20 border-yellow-500 text-yellow-500',
    absent: 'bg-white/5 border-white/10 text-white/30',
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
              text="Wordle"
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

        <div className="flex gap-6 mb-5 text-center text-lg sm:text-xl text-white">
          <p>Essais: <span className="font-bold text-[#46D93B]">{guesses.length}</span> / {MAX_GUESSES}</p>
          {!gameOver && <p>Actuel: <span className="font-bold text-[#46D93B]">{currentGuess}</span></p>}
        </div>

        {gameOver && (
          <div 
            className={`p-6 rounded-2xl text-center max-w-[90vw] mb-5 border animate-[slideIn_0.3s_ease-out] ${
              won 
                ? 'bg-[#46D93B]/10 border-[#46D93B]' 
                : 'bg-red-500/10 border-red-500'
            }`}
            style={{ backdropFilter: 'blur(10px)' }}
          >
            <p className="text-2xl sm:text-3xl font-bold mb-2 text-white">
              {won ? '🎉 GAGNÉ !' : '😢 PERDU !'}
            </p>
            <p className="text-lg sm:text-xl mb-4 text-white/80">
              Le mot était : <strong className="text-[#46D93B]">{targetWord}</strong>
            </p>
            <button 
              className="cursor-pointer transition-transform duration-300 hover:scale-105 text-white px-6 py-2 rounded-[50px] font-medium"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
              onClick={resetGame}
            >
              <ShinyText text="Rejouer" disabled={false} speed={3} />
            </button>
          </div>
        )}

        <div className="flex flex-col gap-2.5 mb-8">
          {Array.from({ length: MAX_GUESSES }).map((_, row) => (
            <div key={row} className="flex gap-2.5 justify-center">
              {Array.from({ length: WORD_LENGTH }).map((_, col) => {
                const status = getLetterStatus(row, col)
                return (
                  <div 
                    key={col} 
                    className={`w-[clamp(40px,10vw,60px)] h-[clamp(40px,10vw,60px)] border flex items-center text-white justify-center font-bold text-xl sm:text-2xl rounded-xl transition-all duration-300 ${statusClass[status]}`}
                    style={{ backdropFilter: 'blur(5px)' }}
                  >
                    {getLetterAtPosition(row, col)}
                  </div>
                )
              })}
            </div>
          ))}
        </div>

        <div className="w-full max-w-[600px]">
          {KEYBOARD_ROWS.map((row, idx) => (
            <div key={idx} className="flex gap-1.5 justify-center flex-wrap mb-2">
              {row.map(letter => (
                <button
                  key={letter}
                  className={`px-3 py-3 min-w-[35px] rounded-lg font-bold transition-all duration-200 border ${keyStatusClass[getKeyboardLetterStatus(letter)]}`}
                  style={{ backdropFilter: 'blur(5px)' }}
                  onClick={() => {
                    if (gameOver) return
                    if (currentGuess.length < WORD_LENGTH) setCurrentGuess(prev => prev + letter)
                  }}
                  disabled={gameOver}
                >
                  {letter}
                </button>
              ))}
            </div>
          ))}
          <div className="flex gap-2 justify-center mt-4">
            <button 
              className="px-6 py-2 rounded-[50px] bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all"
              onClick={() => setCurrentGuess(prev => prev.slice(0, -1))} 
              disabled={gameOver}
            >
              ← Effacer
            </button>
            <button 
              className="px-6 py-2 rounded-[50px] bg-[#46D93B]/20 border border-[#46D93B]/50 text-[#46D93B] hover:bg-[#46D93B]/30 transition-all font-bold"
              onClick={submitGuess} 
              disabled={gameOver}
            >
              Entrée
            </button>
          </div>
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
    </div>
  )
}
