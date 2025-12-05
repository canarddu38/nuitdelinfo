import { useEffect, useRef, useState } from 'react'

const WORD_LIST = ['INCLUSIF', 'RESPONSABLE', 'DURABLE']

type Status = 'empty' | 'correct' | 'present' | 'absent'
type KeyStatus = 'unused' | 'correct' | 'present' | 'absent'

export default function Wordle() {

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
    empty: 'bg-white/10 border-white',
    correct: 'bg-green-500 border-green-500 scale-105',
    present: 'bg-yellow-500 border-yellow-500 scale-105',
    absent: 'bg-gray-500/60 border-gray-500/60',
  }

  const keyStatusClass = {
    unused: 'bg-white/20 border-white/40 text-white',
    correct: 'bg-green-500 border-green-500',
    present: 'bg-yellow-500 border-yellow-500',
    absent: 'bg-gray-500/60 border-gray-500/60',
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-500 to-indigo-500 text-white p-5">
      <h1 className="text-4xl sm:text-5xl font-bold mb-8 drop-shadow-md">Wordle</h1>

      <div className="flex gap-6 mb-5 text-center text-lg sm:text-xl">
        <p>Guesses: <span className="font-bold text-yellow-400">{guesses.length}</span> / {MAX_GUESSES}</p>
        {!gameOver && <p>Current: <span className="font-bold text-yellow-400">{currentGuess}</span></p>}
      </div>
      {gameOver && (
        <div className={`p-5 rounded-xl text-center max-w-[90vw] mb-5 ${won ? 'bg-green-500/30 border-green-500' : 'bg-red-500/30 border-red-500'} border-2`}>
          <p className="text-2xl sm:text-3xl font-bold mb-2">{won ? '🎉 YOU WON!' : '😢 GAME OVER!'}</p>
          <p className="text-lg sm:text-xl mb-3">The word was: <strong className="text-yellow-400">{targetWord}</strong></p>
          <button className="px-4 py-2 rounded-md bg-white/20 hover:bg-white/30 transition" onClick={resetGame}>Play Again</button>
        </div>
      )}
      <div className="flex flex-col gap-2.5 mb-8">
        {Array.from({ length: MAX_GUESSES }).map((_, row) => (
          <div key={row} className="flex gap-2.5">
            {Array.from({ length: WORD_LENGTH }).map((_, col) => {
              const status = getLetterStatus(row, col)
              return (
                <div key={col} className={`w-[clamp(50px,12vw,70px)] h-[clamp(50px,12vw,70px)] border-2 flex items-center justify-center font-bold text-xl sm:text-2xl rounded-md transition ${statusClass[status]}`}>
                  {getLetterAtPosition(row, col)}
                </div>
              )
            })}
          </div>
        ))}
      </div>

      <div className="w-full max-w-[600px]">
        {KEYBOARD_ROWS.map((row, idx) => (
          <div key={idx} className="flex gap-1 justify-center flex-wrap mb-2">
            {row.map(letter => (
              <button
                key={letter}
                className={`px-3 py-2 min-w-[35px] rounded-md font-bold transition ${keyStatusClass[getKeyboardLetterStatus(letter)]}`}
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
        <div className="flex gap-1 justify-center mt-2">
          <button className="px-4 py-2 min-w-[60px] rounded-md bg-indigo-400/30 border border-indigo-600/60" onClick={() => setCurrentGuess(prev => prev.slice(0, -1))} disabled={gameOver}>← Back</button>
          <button className="px-4 py-2 min-w-[60px] rounded-md bg-indigo-400/30 border border-indigo-600/60" onClick={submitGuess} disabled={gameOver}>Enter</button>
        </div>
      </div>
    </div>
  )
}
