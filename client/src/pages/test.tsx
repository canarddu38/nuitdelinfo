import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Trophy, Lock, Check, Star, Zap, Shield, Users, Sparkles, X, LucideIcon } from 'lucide-react';

// --- TYPES & INTERFACES ---

interface ColorBendsProps {
  colors: string[];
  rotation: number;
  speed: number;
  scale: number;
  frequency: number;
  warpStrength: number;
  mouseInfluence: number;
  parallax: number;
  noise: number;
}

interface Question {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

interface WireItem {
  id: string;
  label: string;
  color: string;
}

interface WirePair {
  left: string;
  right: string;
}

interface MemoryCard {
  id: number;
  content: string;
  pair: string;
}

// Discriminated Union pour les types de niveaux
interface BaseLevel {
  id: number;
  title: string;
  subtitle: string;
  icon: LucideIcon;
  color: string;
  xpReward: number;
  badge: string;
}

interface QuizLevel extends BaseLevel {
  type: 'quiz';
  questions: Question[];
}

interface WireLevel extends BaseLevel {
  type: 'wire';
  wireGame: {
    leftSide: WireItem[];
    rightSide: WireItem[];
    correctPairs: WirePair[];
  };
}

interface MemoryLevel extends BaseLevel {
  type: 'memory';
  memoryCards: MemoryCard[];
}

type Level = QuizLevel | WireLevel | MemoryLevel;

// --- COMPOSANT BACKGROUND (THREE.JS) ---

const ColorBends: React.FC<ColorBendsProps> = ({ 
  colors, rotation, speed, scale, frequency, warpStrength, mouseInfluence, parallax, noise 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  const rafRef = useRef<number | null>(null);

  const MAX_COLORS = 8;
  
  const frag = `
    #define MAX_COLORS 8
    uniform vec2 uCanvas;
    uniform float uTime;
    uniform float uSpeed;
    uniform vec2 uRot;
    uniform int uColorCount;
    uniform vec3 uColors[MAX_COLORS];
    uniform int uTransparent;
    uniform float uScale;
    uniform float uFrequency;
    uniform float uWarpStrength;
    uniform vec2 uPointer;
    uniform float uMouseInfluence;
    uniform float uParallax;
    uniform float uNoise;
    varying vec2 vUv;

    void main() {
      float t = uTime * uSpeed;
      vec2 p = vUv * 2.0 - 1.0;
      p += uPointer * uParallax * 0.1;
      vec2 rp = vec2(p.x * uRot.x - p.y * uRot.y, p.x * uRot.y + p.y * uRot.x);
      vec2 q = vec2(rp.x * (uCanvas.x / uCanvas.y), rp.y);
      q /= max(uScale, 0.0001);
      q /= 0.5 + 0.2 * dot(q, q);
      q += 0.2 * cos(t) - 7.56;
      vec2 toward = (uPointer - rp);
      q += toward * uMouseInfluence * 0.2;

      vec3 col = vec3(0.0);
      float a = 1.0;

      if (uColorCount > 0) {
        vec2 s = q;
        vec3 sumCol = vec3(0.0);
        float cover = 0.0;
        for (int i = 0; i < MAX_COLORS; ++i) {
          if (i >= uColorCount) break;
          s -= 0.01;
          vec2 r = sin(1.5 * (s.yx * uFrequency) + 2.0 * cos(s * uFrequency));
          float m0 = length(r + sin(5.0 * r.y * uFrequency - 3.0 * t + float(i)) / 4.0);
          float kBelow = clamp(uWarpStrength, 0.0, 1.0);
          float kMix = pow(kBelow, 0.3);
          float gain = 1.0 + max(uWarpStrength - 1.0, 0.0);
          vec2 disp = (r - s) * kBelow;
          vec2 warped = s + disp * gain;
          float m1 = length(warped + sin(5.0 * warped.y * uFrequency - 3.0 * t + float(i)) / 4.0);
          float m = mix(m0, m1, kMix);
          float w = 1.0 - exp(-6.0 / exp(6.0 * m));
          sumCol += uColors[i] * w;
          cover = max(cover, w);
        }
        col = clamp(sumCol, 0.0, 1.0);
        a = uTransparent > 0 ? cover : 1.0;
      }

      if (uNoise > 0.0001) {
        float n = fract(sin(dot(gl_FragCoord.xy + vec2(uTime), vec2(12.9898, 78.233))) * 43758.5453123);
        col += (n - 0.5) * uNoise;
        col = clamp(col, 0.0, 1.0);
      }

      vec3 rgb = (uTransparent > 0) ? col * a : col;
      gl_FragColor = vec4(rgb, a);
    }
  `;

  const vert = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = vec4(position, 1.0);
    }
  `;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const geometry = new THREE.PlaneGeometry(2, 2);
    
    const uColorsArray = Array.from({ length: MAX_COLORS }, () => new THREE.Vector3(0, 0, 0));
    const material = new THREE.ShaderMaterial({
      vertexShader: vert,
      fragmentShader: frag,
      uniforms: {
        uCanvas: { value: new THREE.Vector2(1, 1) },
        uTime: { value: 0 },
        uSpeed: { value: speed },
        uRot: { value: new THREE.Vector2(1, 0) },
        uColorCount: { value: 0 },
        uColors: { value: uColorsArray },
        uTransparent: { value: 1 },
        uScale: { value: scale },
        uFrequency: { value: frequency },
        uWarpStrength: { value: warpStrength },
        uPointer: { value: new THREE.Vector2(0, 0) },
        uMouseInfluence: { value: mouseInfluence },
        uParallax: { value: parallax },
        uNoise: { value: noise }
      },
      transparent: true
    });
    materialRef.current = material;

    const toVec3 = (hex: string) => {
      const h = hex.replace('#', '').trim();
      let v: number[] = [];
      if (h.length === 3) {
        v = [parseInt(h[0] + h[0], 16), parseInt(h[1] + h[1], 16), parseInt(h[2] + h[2], 16)];
      } else {
        v = [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
      }
      return new THREE.Vector3(v[0] / 255, v[1] / 255, v[2] / 255);
    };

    const arr = colors.filter(Boolean).slice(0, MAX_COLORS).map(toVec3);
    for (let i = 0; i < MAX_COLORS; i++) {
      if (i < arr.length) material.uniforms.uColors.value[i].copy(arr[i]);
      else material.uniforms.uColors.value[i].set(0, 0, 0);
    }
    material.uniforms.uColorCount.value = arr.length;

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    container.appendChild(renderer.domElement);

    const clock = new THREE.Clock();
    const pointerTarget = new THREE.Vector2(0, 0);
    const pointerCurrent = new THREE.Vector2(0, 0);

    const handleResize = () => {
      const w = container.clientWidth || 1;
      const h = container.clientHeight || 1;
      renderer.setSize(w, h, false);
      material.uniforms.uCanvas.value.set(w, h);
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    const handlePointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      pointerTarget.set(x, y);
    };
    container.addEventListener('pointermove', handlePointerMove);

    const loop = () => {
      const dt = clock.getDelta();
      material.uniforms.uTime.value = clock.elapsedTime;
      const rad = (rotation * Math.PI) / 180;
      material.uniforms.uRot.value.set(Math.cos(rad), Math.sin(rad));
      
      pointerCurrent.lerp(pointerTarget, Math.min(1, dt * 8));
      material.uniforms.uPointer.value.copy(pointerCurrent);
      
      renderer.render(scene, camera);
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('pointermove', handlePointerMove);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [colors, rotation, speed, scale, frequency, warpStrength, mouseInfluence, parallax, noise]);

  return <div ref={containerRef} className="w-full h-full absolute inset-0" />;
};

// --- COMPOSANT PRINCIPAL NIRDQUEST ---

const NirdQuest: React.FC = () => {
  const [currentLevel, setCurrentLevel] = useState<number>(0);
  const [unlockedLevels, setUnlockedLevels] = useState<number[]>([0]);
  const [xp, setXp] = useState<number>(0);
  const [badges, setBadges] = useState<string[]>([]);
  const [showGame, setShowGame] = useState<boolean>(false);
  
  // Le jeu en cours peut être null, ou un Level spécifique
  const [gameData, setGameData] = useState<Level | null>(null);
  
  // États spécifiques aux jeux
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState<boolean>(false);
  const [connections, setConnections] = useState<WirePair[]>([]);
  const [selectedWire, setSelectedWire] = useState<{ side: 'left' | 'right', id: string } | null>(null);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedCards, setMatchedCards] = useState<number[]>([]);
  const [cards, setCards] = useState<MemoryCard[]>([]);

  // Données des niveaux
  const levels: Level[] = [
    {
      id: 0,
      title: "Le Réveil du Village",
      subtitle: "Découvrir NIRD",
      icon: Sparkles,
      color: "from-emerald-500 to-teal-500",
      xpReward: 100,
      badge: "🏰",
      type: "quiz",
      questions: [
        {
          question: "Qu'est-ce que NIRD signifie ?",
          options: ["Numérique Inclusif, Responsable et Durable", "Nouvelles Innovations Révolutionnaires", "Naviguer Intelligemment avec Ressources"],
          correct: 0,
          explanation: "NIRD = Numérique Inclusif, Responsable et Durable !"
        },
        {
          question: "Contre qui le village résiste-t-il ?",
          options: ["Les virus informatiques", "La dépendance aux Big Tech", "Le manque de formation"],
          correct: 1,
          explanation: "Mission : se libérer des géants technologiques ! 💪"
        }
      ]
    },
    {
      id: 1,
      title: "Reconnecte le Village",
      subtitle: "Répare les connexions",
      icon: Shield,
      color: "from-cyan-500 to-blue-500",
      xpReward: 150,
      badge: "⚡",
      type: "wire",
      wireGame: {
        leftSide: [
          { id: 'l1', label: 'Windows 10', color: 'bg-red-500' },
          { id: 'l2', label: 'Big Tech', color: 'bg-orange-500' },
          { id: 'l3', label: 'Licences coûteuses', color: 'bg-yellow-500' }
        ],
        rightSide: [
          { id: 'r1', label: 'Linux', color: 'bg-cyan-500' },
          { id: 'r2', label: 'Autonomie', color: 'bg-green-500' },
          { id: 'r3', label: 'Logiciels libres', color: 'bg-blue-500' }
        ],
        correctPairs: [
          { left: 'l1', right: 'r1' },
          { left: 'l2', right: 'r2' },
          { left: 'l3', right: 'r3' }
        ]
      }
    },
    {
      id: 2,
      title: "Mémoire du Village",
      subtitle: "Retrouve les paires NIRD",
      icon: Star,
      color: "from-purple-500 to-pink-500",
      xpReward: 200,
      badge: "🧠",
      type: "memory",
      memoryCards: [
        { id: 1, content: '♻️', pair: 'Durabilité' },
        { id: 2, content: 'Durabilité', pair: '♻️' },
        { id: 3, content: '🤝', pair: 'Inclusion' },
        { id: 4, content: 'Inclusion', pair: '🤝' },
        { id: 5, content: '🛡️', pair: 'Responsabilité' },
        { id: 6, content: 'Responsabilité', pair: '🛡️' },
        { id: 7, content: '🐧', pair: 'Linux' },
        { id: 8, content: 'Linux', pair: '🐧' }
      ]
    },
    {
      id: 3,
      title: "Les Acteurs du Village",
      subtitle: "Qui fait quoi ?",
      icon: Users,
      color: "from-green-500 to-emerald-500",
      xpReward: 250,
      badge: "👥",
      type: "quiz",
      questions: [
        {
          question: "Qui peut participer à NIRD ?",
          options: ["Uniquement les profs d'informatique", "Élèves, enseignants, collectivités...", "Seulement les grandes écoles"],
          correct: 1,
          explanation: "NIRD unit toute la communauté éducative ! 🤝"
        },
        {
          question: "Où est né le projet NIRD ?",
          options: ["À Paris", "Au lycée Carnot de Bruay-la-Buissière", "Dans une entreprise tech"],
          correct: 1,
          explanation: "Initiative d'en bas qui monte ! 🚀"
        }
      ]
    },
    {
      id: 4,
      title: "Câblage de la Résistance",
      subtitle: "Connecte les solutions",
      icon: Zap,
      color: "from-yellow-500 to-orange-500",
      xpReward: 300,
      badge: "🔌",
      type: "wire",
      wireGame: {
        leftSide: [
          { id: 'l1', label: 'Obsolescence', color: 'bg-red-500' },
          { id: 'l2', label: 'Dépendance', color: 'bg-orange-500' },
          { id: 'l3', label: 'Coût élevé', color: 'bg-yellow-500' }
        ],
        rightSide: [
          { id: 'r1', label: 'Réemploi', color: 'bg-green-500' },
          { id: 'r2', label: 'Logiciels libres', color: 'bg-cyan-500' },
          { id: 'r3', label: 'Mutualisation', color: 'bg-blue-500' }
        ],
        correctPairs: [
          { left: 'l1', right: 'r1' },
          { left: 'l2', right: 'r2' },
          { left: 'l3', right: 'r3' }
        ]
      }
    },
    {
      id: 5,
      title: "Champion du Village",
      subtitle: "Teste tes connaissances !",
      icon: Trophy,
      color: "from-pink-500 to-rose-500",
      xpReward: 500,
      badge: "🏆",
      type: "quiz",
      questions: [
        {
          question: "Quelle action NIRD est prioritaire ?",
          options: ["Acheter du matériel Apple", "Sobriété numérique", "Augmenter les abonnements"],
          correct: 1,
          explanation: "Moins mais mieux ! 🌱"
        },
        {
          question: "Objectif final de NIRD ?",
          options: ["Économiser uniquement", "Numérique autonome et éthique", "Tout remplacer"],
          correct: 1,
          explanation: "David bat Goliath ! 🎯"
        }
      ]
    }
  ];

  const startLevel = (levelId: number) => {
    const level = levels.find(l => l.id === levelId);
    if (!level) return;

    setCurrentLevel(levelId);
    setGameData(level);
    setSelectedAnswers([]);
    setShowResults(false);
    setConnections([]);
    setSelectedWire(null);
    setFlippedCards([]);
    setMatchedCards([]);
    
    if (level.type === 'memory') {
      const shuffled = [...level.memoryCards].sort(() => Math.random() - 0.5);
      setCards(shuffled);
    }
    
    setShowGame(true);
  };

  const selectAnswer = (questionIndex: number, answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[questionIndex] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleWireClick = (side: 'left' | 'right', id: string) => {
    if (selectedWire === null) {
      setSelectedWire({ side, id });
    } else {
      if (selectedWire.side !== side) {
        const newConnection = selectedWire.side === 'left' 
          ? { left: selectedWire.id, right: id }
          : { left: id, right: selectedWire.id };
        setConnections([...connections, newConnection]);
      }
      setSelectedWire(null);
    }
  };

  const handleCardClick = (index: number) => {
    if (flippedCards.length === 2 || flippedCards.includes(index) || matchedCards.includes(index)) return;

    const newFlipped = [...flippedCards, index];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      const [first, second] = newFlipped;
      const firstCard = cards[first];
      const secondCard = cards[second];

      if (firstCard.pair === secondCard.content || secondCard.pair === firstCard.content) {
        setTimeout(() => {
          setMatchedCards([...matchedCards, first, second]);
          setFlippedCards([]);
        }, 500);
      } else {
        setTimeout(() => setFlippedCards([]), 1000);
      }
    }
  };

  const completeLevel = () => {
    if (!gameData) return;
    const level = gameData;
    let success = false;

    if (level.type === 'quiz') {
      const correctAnswers = selectedAnswers.filter((answer, index) => 
        answer === level.questions[index].correct
      ).length;
      success = (correctAnswers / level.questions.length) >= 0.5;
    } else if (level.type === 'wire') {
      success = connections.length === level.wireGame.correctPairs.length &&
                connections.every(conn => 
                  level.wireGame.correctPairs.some(pair => 
                    pair.left === conn.left && pair.right === conn.right
                  )
                );
    } else if (level.type === 'memory') {
      success = matchedCards.length === cards.length;
    }

    if (success) {
      setXp(prev => prev + level.xpReward);
      if (!badges.includes(level.badge)) {
          setBadges(prev => [...prev, level.badge]);
      }
      
      if (!unlockedLevels.includes(currentLevel + 1) && currentLevel + 1 < levels.length) {
        setUnlockedLevels(prev => [...prev, currentLevel + 1]);
      }
    }
    
    setShowResults(true);
  };

  const closeGame = () => {
    setShowGame(false);
    setGameData(null);
  };

  // --- RENDER ---
  
  if (showGame && gameData) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <div className="absolute inset-0 bg-slate-950">
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

        <div className="relative z-10 p-6 min-h-screen flex items-center justify-center">
          <div className="max-w-4xl w-full">
            <div className="bg-black/40 backdrop-blur-2xl rounded-[2.5rem] p-10 shadow-2xl border border-emerald-500/20">
              {/* Header Jeu */}
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-5">
                  <div className={`w-20 h-20 bg-gradient-to-br ${gameData.color} rounded-3xl flex items-center justify-center shadow-2xl`}>
                    <gameData.icon className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-white">{gameData.title}</h2>
                    <p className="text-emerald-300 text-lg">{gameData.subtitle}</p>
                  </div>
                </div>
                <button
                  onClick={closeGame}
                  className="text-white/60 hover:text-white text-4xl font-light hover:scale-110 transition-all"
                >
                  ×
                </button>
              </div>

              {/* LOGIQUE JEU - QUIZ */}
              {gameData.type === 'quiz' && (
                <>
                  {!showResults ? (
                    <div className="space-y-6">
                      {gameData.questions.map((q, qIndex) => (
                        <div key={qIndex} className="bg-black/20 backdrop-blur-sm rounded-3xl p-6 border border-emerald-500/20">
                          <h3 className="text-xl font-bold text-white mb-4">{qIndex + 1}. {q.question}</h3>
                          <div className="space-y-3">
                            {q.options.map((option, oIndex) => (
                              <button
                                key={oIndex}
                                onClick={() => selectAnswer(qIndex, oIndex)}
                                className={`w-full p-4 rounded-2xl text-left transition-all font-medium ${
                                  selectedAnswers[qIndex] === oIndex
                                    ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-xl scale-105'
                                    : 'bg-black/30 text-white hover:bg-black/40 border border-emerald-500/20'
                                }`}
                              >
                                {option}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                      <button
                        onClick={completeLevel}
                        disabled={selectedAnswers.length !== gameData.questions.length}
                        className={`w-full py-5 rounded-3xl font-bold text-xl transition-all ${
                          selectedAnswers.length === gameData.questions.length
                            ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white hover:shadow-2xl hover:scale-105'
                            : 'bg-gray-800/50 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        Valider
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {gameData.questions.map((q, qIndex) => {
                        const isCorrect = selectedAnswers[qIndex] === q.correct;
                        return (
                          <div key={qIndex} className={`rounded-3xl p-6 border-2 ${
                            isCorrect ? 'bg-emerald-500/10 border-emerald-500' : 'bg-red-500/10 border-red-500'
                          }`}>
                            <div className="flex items-start gap-3">
                              {isCorrect ? <Check className="w-7 h-7 text-emerald-400" /> : <X className="w-7 h-7 text-red-400" />}
                              <div className="flex-1">
                                <h3 className="font-bold text-white mb-2">{q.question}</h3>
                                <div className="bg-black/20 rounded-2xl p-4 mt-3">
                                  <p className="text-white/90">{q.explanation}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      <div className="text-center space-y-6 pt-4">
                        <div className="text-5xl font-black text-white">
                          {selectedAnswers.filter((a, i) => gameData.type === 'quiz' && a === gameData.questions[i].correct).length} / {gameData.questions.length}
                        </div>
                        <div className="text-3xl">{gameData.badge}</div>
                        <div className="text-2xl text-emerald-300 font-bold">+{gameData.xpReward} XP</div>
                        <button
                          onClick={closeGame}
                          className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-10 py-4 rounded-3xl font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all"
                        >
                          Continuer l'aventure
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* LOGIQUE JEU - WIRE (Câblage) */}
              {gameData.type === 'wire' && (
                <>
                  {!showResults ? (
                    <div className="space-y-8">
                      <div className="text-center text-white/90 text-lg font-medium">Connecte chaque problème à sa solution ! 🔌</div>
                      <div className="grid grid-cols-2 gap-16 relative">
                        <div className="space-y-4">
                          {gameData.wireGame.leftSide.map((item) => (
                            <button
                              key={item.id}
                              onClick={() => handleWireClick('left', item.id)}
                              className={`w-full p-5 rounded-2xl font-bold text-white transition-all ${
                                selectedWire?.id === item.id
                                  ? `${item.color} shadow-2xl scale-110`
                                  : `${item.color}/80 hover:scale-105 border-2 border-black/20`
                              }`}
                            >
                              {item.label}
                            </button>
                          ))}
                        </div>
                        <div className="space-y-4">
                          {gameData.wireGame.rightSide.map((item) => (
                            <button
                              key={item.id}
                              onClick={() => handleWireClick('right', item.id)}
                              className={`w-full p-5 rounded-2xl font-bold text-white transition-all ${
                                selectedWire?.id === item.id
                                  ? `${item.color} shadow-2xl scale-110`
                                  : `${item.color}/80 hover:scale-105 border-2 border-black/20`
                              }`}
                            >
                              {item.label}
                            </button>
                          ))}
                        </div>
                        {/* SVG Lignes */}
                        <svg className="absolute inset-0 pointer-events-none" style={{ width: '100%', height: '100%' }}>
                          {connections.map((conn, i) => {
                            const leftIdx = gameData.wireGame.leftSide.findIndex(x => x.id === conn.left);
                            const rightIdx = gameData.wireGame.rightSide.findIndex(x => x.id === conn.right);
                            return (
                              <line
                                key={i}
                                x1="25%"
                                y1={`${(leftIdx + 0.5) * (100 / gameData.wireGame.leftSide.length)}%`}
                                x2="75%"
                                y2={`${(rightIdx + 0.5) * (100 / gameData.wireGame.rightSide.length)}%`}
                                stroke="#00ffd1"
                                strokeWidth="4"
                              />
                            );
                          })}
                        </svg>
                      </div>
                      <button
                        onClick={completeLevel}
                        disabled={connections.length !== gameData.wireGame.correctPairs.length}
                        className={`w-full py-5 rounded-3xl font-bold text-xl transition-all ${
                          connections.length === gameData.wireGame.correctPairs.length
                            ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white hover:shadow-2xl hover:scale-105'
                            : 'bg-gray-800/50 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        Vérifier
                      </button>
                    </div>
                  ) : (
                    <div className="text-center space-y-8">
                      <div className="text-6xl">⚡</div>
                      <div className="text-4xl font-black text-white">Village reconnecté !</div>
                      <div className="text-3xl">{gameData.badge}</div>
                      <div className="text-2xl text-emerald-300 font-bold">+{gameData.xpReward} XP</div>
                      <button
                        onClick={closeGame}
                        className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-10 py-4 rounded-3xl font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all"
                      >
                        Continuer l'aventure
                      </button>
                    </div>
                  )}
                </>
              )}

              {/* LOGIQUE JEU - MEMORY */}
              {gameData.type === 'memory' && (
                <>
                  {!showResults ? (
                    <div className="space-y-8">
                      <div className="text-center text-white/80 mb-4">Trouve les paires correspondantes !</div>
                      <div className="grid grid-cols-4 gap-4 perspective-1000">
                        {cards.map((card, index) => {
                          const isFlipped = flippedCards.includes(index) || matchedCards.includes(index);
                          const isMatched = matchedCards.includes(index);
                          return (
                            <button
                              key={index}
                              onClick={() => handleCardClick(index)}
                              disabled={isFlipped}
                              className={`aspect-square relative rounded-2xl transition-all duration-500 transform-style-3d ${
                                isFlipped ? 'rotate-y-180' : 'hover:scale-105'
                              }`}
                              style={{ transformStyle: 'preserve-3d', transition: 'transform 0.6s' }}
                            >
                              <div className={`absolute inset-0 bg-slate-800 border-2 border-emerald-500/30 rounded-2xl flex items-center justify-center backface-hidden ${isFlipped ? 'opacity-0' : 'opacity-100'}`}
                                   style={{ backfaceVisibility: 'hidden' }}>
                                <Sparkles className="text-emerald-500/50 w-8 h-8" />
                              </div>
                              
                              <div className={`absolute inset-0 flex items-center justify-center rounded-2xl backface-hidden ${
                                isMatched 
                                  ? 'bg-gradient-to-br from-emerald-500 to-cyan-500 shadow-[0_0_20px_rgba(16,185,129,0.5)]' 
                                  : 'bg-white text-slate-900'
                              }`}
                              style={{ 
                                backfaceVisibility: 'hidden', 
                                transform: 'rotateY(180deg)' 
                              }}>
                                <span className="text-3xl font-bold">{card.content}</span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center space-y-8">
                      <div className="text-6xl animate-bounce">🧠</div>
                      <div className="text-4xl font-black text-white">Mémoire Retrouvée !</div>
                      <div className="text-3xl">{gameData.badge}</div>
                      <div className="text-2xl text-emerald-300 font-bold">+{gameData.xpReward} XP</div>
                      <button
                        onClick={closeGame}
                        className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-10 py-4 rounded-3xl font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all"
                      >
                        Continuer l'aventure
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- MENU PRINCIPAL (MAP) ---
  return (
    <div className="min-h-screen relative bg-slate-950 font-sans text-slate-100 overflow-x-hidden selection:bg-emerald-500/30">
      <div className="fixed inset-0 z-0">
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

      <div className="relative z-10 max-w-lg mx-auto p-6 min-h-screen flex flex-col">
        <header className="flex items-center justify-between mb-12 bg-black/30 backdrop-blur-xl p-4 rounded-3xl border border-white/10 sticky top-4 z-50 shadow-2xl">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-full flex items-center justify-center font-bold text-black text-xl shadow-lg">
               N
             </div>
             <span className="font-black text-xl tracking-tight hidden sm:block">NIRD<span className="text-emerald-400">QUEST</span></span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded-full border border-white/10">
              <span className="text-yellow-400 drop-shadow-lg">⚡</span>
              <span className="font-bold text-yellow-100">{xp}</span>
            </div>
          </div>
        </header>

        <div className="flex-1 flex flex-col items-center gap-8 py-10 relative pb-32">
          <div className="absolute top-20 bottom-32 w-3 bg-black/20 rounded-full -z-10 ml-0">
            <div 
              className="w-full bg-gradient-to-b from-emerald-500 via-cyan-500 to-slate-800 rounded-full transition-all duration-1000 shadow-[0_0_20px_rgba(16,185,129,0.5)]"
              style={{ height: `${(unlockedLevels.length / levels.length) * 100}%` }}
            />
          </div>

          {levels.map((level, index) => {
            const isUnlocked = unlockedLevels.includes(level.id);
            const isCompleted = badges.includes(level.badge);
            const isNext = !isCompleted && isUnlocked;
            
            const translateClass = index % 2 === 0 ? '-translate-x-0' : 'translate-x-0';

            return (
              <div key={level.id} className={`relative flex items-center justify-center w-full transition-all duration-500 ${translateClass}`}>
                <button
                  onClick={() => isUnlocked ? startLevel(level.id) : null}
                  disabled={!isUnlocked}
                  className={`group relative w-28 h-28 flex items-center justify-center rounded-[2.5rem] transition-all duration-300 ${
                    isUnlocked 
                      ? `bg-gradient-to-b ${level.color} shadow-[0_10px_40px_-10px_rgba(0,0,0,0.6)] cursor-pointer hover:scale-110 hover:-translate-y-2 active:scale-95` 
                      : 'bg-slate-800 border-4 border-slate-700 cursor-not-allowed opacity-60 grayscale'
                  } ${isNext ? 'ring-4 ring-white/30 animate-pulse' : ''}`}
                >
                  <div className="relative z-10 transform transition-transform duration-300 group-hover:scale-110">
                    {isCompleted ? (
                      <span className="text-5xl drop-shadow-md filter">{level.badge}</span>
                    ) : isUnlocked ? (
                      <level.icon className="w-12 h-12 text-white drop-shadow-md" />
                    ) : (
                      <Lock className="w-10 h-10 text-slate-500" />
                    )}
                  </div>

                  {isCompleted && (
                    <div className="absolute -bottom-3 bg-yellow-400 text-yellow-950 text-[10px] font-black px-3 py-1 rounded-full shadow-lg flex items-center gap-1 border-2 border-yellow-200">
                      <Star className="w-3 h-3 fill-current" />
                      COMPLET
                    </div>
                  )}

                  <div className={`absolute top-0 left-32 bg-slate-900/90 backdrop-blur-md px-5 py-4 rounded-2xl w-56 text-left border border-white/10 shadow-2xl transition-all duration-300 pointer-events-none z-20 ${
                    isUnlocked ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
                  }`}>
                    <h3 className="font-bold text-white text-lg leading-tight mb-1">{level.title}</h3>
                    <p className="text-xs text-emerald-400 font-medium uppercase tracking-wider">{level.subtitle}</p>
                    <div className="mt-2 text-xs text-slate-400 flex items-center gap-1">
                      <span className="text-yellow-400">⚡</span> Gain: {level.xpReward} XP
                    </div>
                  </div>
                </button>
              </div>
            );
          })}
        </div>
        
        <div className="fixed bottom-0 left-0 right-0 bg-black/60 backdrop-blur-xl border-t border-white/10 p-4">
            <div className="max-w-lg mx-auto">
                <p className="text-xs text-slate-400 mb-2 font-bold uppercase tracking-widest text-center">Ta collection</p>
                <div className="flex justify-center gap-2 flex-wrap">
                    {badges.map((b, i) => (
                        <span key={i} className="text-2xl animate-bounce" style={{animationDelay: `${i * 100}ms`}}>{b}</span>
                    ))}
                    {badges.length === 0 && <span className="text-slate-600 text-sm italic">Gagne des niveaux pour collectionner des badges !</span>}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default NirdQuest;