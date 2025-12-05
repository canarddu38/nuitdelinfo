
import ColorBends from '../components/utils/ColorBends';
import React from 'react';
import { useNavigate } from "react-router-dom";
import TextPressure from '../components/utils/TextPressure';
import Relworld from 'assets/relword_logo.png'
import Wordle from 'assets/wordle_logo.png'
import Quiz from 'assets/quizz_logo.png'
import Memory from 'assets/Memory_logo.png'
import linux from 'assets/linux_logo.png'
import reco from 'assets/reco_logo.png'

export default function Dashboad() {
    const navigate = useNavigate();
  function handleClick_rel () { 
    navigate("../rel");
  }
  function handleClick_word () { 
    navigate("../wordle");
  }
  function handleClick_quiz () {
    navigate("../quiz");
  }
  function handleClick_memo () { 
    navigate("../Memo");
  }
  function handleClick_linux () { 
    navigate("../linux");
  }
  function handleClick_reco () {
    navigate("../reco");
  }
  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden' }}>
      
      {/* Le composant d'arrière-plan */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}>
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
      <div className="relative z-10 w-full min-h-screen flex flex-col items-center center px-4 h-[300px] sm:px-6 md:px-8 py-8">
        {/* Title */}
        <div className="mb-8 sm:mb-12 w-full max-w-4xl text-center">
             <TextPressure
              text="Dashboard"
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
        <div className="w-full grid grid-cols-3 gap-4 h-[300px]">
          <div
              className="relative rounded-2xl p-6 sm:p-8 w-full h-200 shadow-2xl scaleBox cursor-pointer" onClick={handleClick_rel}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
            <div className="flex justify-center p-4 h-[300px]">
              <img 
                src={Relworld} // Utilisez la variable importée 
                className="w-300 h-300 md:w-960 " // Classes Tailwind pour le style
                />
          </div> 
              <h1 className="text-6xl font-semibold mb-3 text-white">RELWORD</h1>
              <p className="text-xl font-semibold mb-3 text-gray-400"> Dans ce jeu, il faut relier chaque application propriétaire à son équivalent open source. Cela permet de découvrir des alternatives libres, plus transparentes et respectueuses de la vie privée. Un jeu simple pour apprendre à remplacer des outils fermés par des solutions ouvertes.</p>
          </div>
          <div
              className="relative rounded-2xl p-6 sm:p-8 w-full h-200 shadow-2xl scaleBox cursor-pointer" onClick={handleClick_word}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
            <div className="flex justify-center p-4 h-[300px]">
              <img 
                src={Wordle} // Utilisez la variable importée 
                className="w-100 h-100 md:w-960" // Classes Tailwind pour le style
                />
          </div> 
              <h1 className="text-6xl font-semibold mb-3 text-white">Wordle</h1>
              <p className="text-xl font-semibold mb-3 text-gray-400"> Wordle est un jeu où tu dois deviner un mot secret en quelques essais. Les couleurs t’aident : vert si la lettre est bien placée, jaune si elle est dans le mot, gris si elle n’y est pas. Un petit jeu rapide et logique.</p>
          </div>
          <div
              className="relative rounded-2xl p-6 sm:p-8 w-full h-200 shadow-2xl scaleBox cursor-pointer" onClick={handleClick_quiz}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
            <div className="flex justify-center p-4 h-[300px]">
              <img 
                src={Quiz} // Utilisez la variable importée 
                className="**w-full h-auto md:w-960 rounded-lg shadow-xl**" // Classes Tailwind pour le style
                />
          </div> 
              <h1 className="text-6xl font-semibold mb-3 text-white">QUIZ</h1>
              <p className="text-xl font-semibold mb-3 text-gray-400"> Wordle est un jeu où tu dois deviner un mot secret en quelques essais. Les couleurs t’aident : vert si la lettre est bien placée, jaune si elle est dans le mot, gris si elle n’y est pas. Un petit jeu rapide et logique.</p>
          </div>
          <div
              className="relative rounded-2xl p-6 sm:p-8 w-full h-200 shadow-2xl scaleBox cursor-pointer" onClick={handleClick_memo}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
            <div className="flex justify-center p-4 h-[300px]">
              <img 
                src={Memory} // Utilisez la variable importée 
                className="**w-full h-auto md:w-960 rounded-lg shadow-xl**" // Classes Tailwind pour le style
                />
          </div> 
              <h1 className="text-6xl font-semibold mb-3 text-white">MEMORY</h1>
              <p className="text-xl font-semibold mb-3 text-gray-400">Dans ce memory, tu dois retrouver les paires en retournant deux cartes à la fois. Observe bien, mémorise les positions et retrouve toutes les correspondances le plus vite possible. Un jeu simple et amusant pour tester ta mémoire.</p>
          </div>
          <div
              className="relative rounded-2xl p-6 sm:p-8 w-full h-200 shadow-2xl scaleBox cursor-pointer" onClick={handleClick_linux}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
            <div className="flex justify-center p-4 h-[300px]">
              <img 
                src={linux} // Utilisez la variable importée 
                className="**w-full h-auto md:w-960 rounded-lg shadow-xl**" // Classes Tailwind pour le style
                />
          </div> 
              <h1 className="text-6xl font-semibold mb-3 text-white">Linux installer</h1>
              <p className="text-xl font-semibold mb-3 text-gray-400"> Cette activité te fait suivre les étapes d’installation d’une distribution Linux : choisir la version, configurer le disque, créer un utilisateur et lancer l’installation. Un moyen simple de découvrir comment mettre en place un système Linux.</p>
          </div>
          <div
              className="relative rounded-2xl p-6 sm:p-8 w-full h-200 shadow-2xl scaleBox cursor-pointer" onClick={handleClick_reco}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
            <div className="flex justify-center p-4 h-[300px]">
              <img 
                src={reco} // Utilisez la variable importée 
                className="**w-full h-auto md:w-960 rounded-lg shadow-xl**" // Classes Tailwind pour le style
                />
          </div> 
              <h1 className="text-6xl font-semibold mb-3 text-white">RECO</h1>
              <p className="text-xl font-semibold mb-3 text-gray-400"> Dans ce jeu, tu apprends à redonner vie à un vieux PC : nettoyer les composants, changer les pièces essentielles, installer un système léger et optimiser les performances. Une manière ludique de comprendre comment reconditionner et prolonger la durée de vie d’un ordinateur.</p>
          </div>
        </div>
      </div>
    </div>
  );
};