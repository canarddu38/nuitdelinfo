import React from 'react'
import Snake from './Snake'

// "Smale" secret view: show a fun mini-game (reusing Snake component)
// Feel free to adapt visuals as needed
export default function Smale() {
  return (
    <div className="w-full min-h-[50vh] sm:min-h-[60vh] flex items-center justify-center p-2 sm:p-4">
      <div className="w-full  p-4 rounded-xl border border-white/10 bg-white/5">
        <h4 className="text-white text-base sm:text-lg font-semibold mb-2">Snake secret</h4>
        <p className="text-white/60 text-xs sm:text-sm mb-3 sm:mb-4">Vous avez déverrouillé le mode secret. Profitez du mini-jeu !</p>
        <div className="rounded-lg overflow-hidden border border-white/10 bg-black/40">
          <Snake />
        </div>
      </div>
    </div>
  )
}
