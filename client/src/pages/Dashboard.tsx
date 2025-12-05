import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/auth/AuthContext'
import ColorBends from '../components/utils/ColorBends'
import TextPressure from '../components/utils/TextPressure'

import Relword from 'assets/relword_logo.png'
import Wordle from 'assets/wordle_logo.png'
import Quiz from 'assets/quizz_logo.png'
import Memory from 'assets/Memory_logo.png'
import linux from 'assets/linux_logo.png'
import reco from 'assets/reco_logo.png'
import Controller from 'components/Controller'
import Smale from 'components/Smale'

export default function Dashboard() {
  const navigate = useNavigate()
  const { logout } = useAuth()

  const [showController, setShowController] = React.useState(false)
  const [showSmale, setShowSmale] = React.useState(false)

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const cards = [
    { title: 'RELWORD', desc: "Relie les applis propriétaires à leurs alternatives libres !", img: Relword, action: () => navigate('../rel') },
    { title: 'WORDLE', desc: 'Devine le mot caché en 6 essais max !', img: Wordle, action: () => navigate('../wordle') },
    { title: 'QUIZ', desc: "Teste ta culture du libre et de l'écologie numérique !", img: Quiz, action: () => navigate('../quiz') },
    { title: 'MEMORY', desc: 'Exerce ta mémoire en retrouvant les paires !', img: Memory, action: () => navigate('../Memo') },
    { title: 'LINUX INSTALLER', desc: "Simule l'installation de ta première distribution Linux !", img: linux, action: () => navigate('../linux') },
    { title: 'RECO', desc: 'Donne une seconde vie à un vieux PC !', img: reco, action: () => navigate('../reco') },
  ]

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

      <div className="relative z-10 w-full min-h-screen flex flex-col items-center px-4 sm:px-6 md:px-8 py-8">
        {/* Header with Logout */}
        <div className="w-full max-w-7xl flex justify-end mb-4">
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-full bg-red-500/20 border border-red-500 text-red-500 hover:bg-red-500/30 transition-all backdrop-blur-sm font-bold text-sm"
          >
            Déconnexion
          </button>
        </div>

        {/* Title */}
        <div className="mb-8 sm:mb-12 w-full max-w-4xl text-center">
          <TextPressure
            text="Tableau de bord"
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

        {/* Grid */}
        <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-12">
          {cards.map((card, index) => (
            <div
              key={index}
              onClick={card.action}
              className="group relative flex flex-col overflow-hidden rounded-2xl p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl cursor-pointer"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <div className="relative mb-6 flex h-48 w-full items-center justify-center overflow-hidden rounded-xl bg-black/20">
                <img
                  src={card.img}
                  alt={card.title}
                  className="h-full w-full object-contain p-4 transition-transform duration-500 group-hover:scale-110"
                />
              </div>

              <h2 className="mb-3 text-2xl font-bold text-white group-hover:text-[#46D93B] transition-colors">
                {card.title}
              </h2>

              <p className="text-sm leading-relaxed text-gray-300">
                {card.desc}
              </p>

              <div className="mt-6 flex items-center text-[#46D93B] font-medium opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <span>Jouer maintenant</span>
                <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </div>
          ))}
        </div>

        {/* Footer action: open controller */}
        <div className="w-full max-w-7xl flex justify-center mt-4">
          <button
            onClick={() => setShowController(true)}
            className="cursor-pointer transition-transform duration-300 hover:scale-105 text-white px-6 py-3 rounded-[50px] font-medium"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            Débloquer avec la manette
          </button>
        </div>
      </div>

      {/* Controller Modal */}
      {showController && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div
            className="relative w-full max-w-lg rounded-2xl p-6 sm:p-8"
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-white text-xl font-semibold">Code d'accès</h3>
              <button
                onClick={() => setShowController(false)}
                className="text-white/70 hover:text-white"
                aria-label="Fermer"
              >
                ✕
              </button>
            </div>
            <Controller
              onSuccess={() => {
                setShowController(false)
                setShowSmale(true)
              }}
            />
          </div>
        </div>
      )}

      {/* Smale Overlay */}
      {showSmale && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="relative w-full rounded-2xl overflow-hidden"
               style={{
                 background: 'rgba(255, 255, 255, 0.06)',
                 backdropFilter: 'blur(10px)',
                 border: '1px solid rgba(255, 255, 255, 0.1)',
               }}>
            <div className="flex justify-between items-center p-4 border-b border-white/10">
              <h3 className="text-white text-xl font-semibold">Mode secret</h3>
              <button
                onClick={() => setShowSmale(false)}
                className="text-white/70 hover:text-white"
                aria-label="Fermer"
              >
                ✕
              </button>
            </div>
            <div className="p-4 bg-black/40">
              <Smale />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}