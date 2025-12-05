import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ColorBends from '../components/utils/ColorBends';
import TextPressure from '../components/utils/TextPressure';
import ShinyText from '../components/utils/ShinyText';

type Question = { id: number; prompt: string; choices: string[]; answerIndex: number }

const QUESTIONS: Question[] = [
	{
		id: 1,
		prompt: 'Quel est l’objectif principal de la démarche NIRD ?',
		choices: [
			'Acheter du matériel informatique neuf pour tous',
			'Développer les compétences en programmation du grand public',
			'Rendre le numérique plus accessible, autonome et écologique',
			'Moderniser les salles informatiques des lieux publics.',
		],
		answerIndex: 2,
	},
	{
		id: 2,
		prompt: 'Pourquoi reconditionner des ordinateurs au lieu d’en acheter des neufs ?',
		choices: [
			'Car il y a une limite d\'ordinateurs',
			'Pour apprendre l’électronique uniquement',
			'Pour réduire les déchets électroniques et les coûts',
			'42',
		],
		answerIndex: 2,
	},
	{
		id: 3,
		prompt: 'Qu’est-ce qu’un logiciel libre ?',
		choices: [
			'Un logiciel gratuit mais publicitaire',
			'Un logiciel dont le code est ouvert et modifiable par tous',
			'Un logiciel réservé aux experts en informatique',
			'Un logiciel uniquement disponible sur Linux',
		],
		answerIndex: 1,
	},
	{
		id: 4,
		prompt: 'Quel est l’un des avantages d’utiliser GNU/Linux dans un établissement ?',
		choices: [
			'Il rend automatiquement les ordinateurs 10 fois plus rapides',
			'Il empêche d’installer d’autres logiciels',
			'Il prolonge la durée de vie du matériel et ne nécessite pas d’abonnement',
			'Il fonctionne uniquement sur les ordinateurs récents',
		],
		answerIndex: 2,
	},
	{
		id: 5,
		prompt: 'Que permet le reconditionnement d’un ordinateur ?',
		choices: [
			'Le transformer en console de jeu',
			'Lui redonner de la valeur financière',
			'Lui offrir plusieurs années d’utilisation supplémentaire',
			'Le rendre compatible uniquement avec Windows',
		],
		answerIndex: 2,
	},
	{
		id: 6,
		prompt: 'Quel problème la NIRD cherche-t-elle à combattre ?',
		choices: [
			'Le piratage informatique',
			'L\'erreur 404',
			'La fracture numérique',
			'Le manque de formation professionnelle',
		],
		answerIndex: 2,
	},
	{
		id: 7,
		prompt: 'Quel acteur est indispensable pour faire vivre un projet NIRD ?',
		choices: [
			'Les magasins de téléphonie',
			'Les développeurs privés',
			'Les équipes éducatives et les collectivités locales',
			'Les vendeurs de matériel neuf',
		],
		answerIndex: 2,
	},
]

export default function Quiz() {
    const navigate = useNavigate()
	const [idx, setIdx] = useState(0)
	const [selected, setSelected] = useState<number | null>(null)
	const [locked, setLocked] = useState(false)
	const [score, setScore] = useState(0)
	const [finished, setFinished] = useState(false)

	const q = QUESTIONS[idx]

	function choose(i: number) {
		if (locked || finished) return
		setSelected(i)
		setLocked(true)
		if (i === q.answerIndex) setScore((s) => s + 1)
	}

	function next() {
		if (!locked) return
		if (idx + 1 >= QUESTIONS.length) {
			setFinished(true)
			return
		}
		setIdx((i) => i + 1)
		setSelected(null)
		setLocked(false)
	}

	function prev() {
		if (idx === 0) return
		setIdx((i) => i - 1)
		setSelected(null)
		setLocked(false)
	}

	function restart() {
		setIdx(0)
		setSelected(null)
		setLocked(false)
		setScore(0)
		setFinished(false)
	}

	useEffect(() => {
		const onKey = (e: KeyboardEvent) => {
			if (finished) return
			if (e.key >= '1' && e.key <= '4') {
				const i = Number(e.key) - 1
				if (i < q.choices.length) choose(i)
			} else if (e.key === 'Enter') next()
		}
		window.addEventListener('keydown', onKey)
		return () => window.removeEventListener('keydown', onKey)
	}, [idx, finished, q.choices.length])

	const statusClass = (i: number) => {
		if (!locked) return 'bg-white/5 border-white/10 text-white hover:bg-white/10'
		if (i === q.answerIndex) return 'bg-[#46D93B]/20 border-[#46D93B] text-[#46D93B]'
		if (selected === i) return 'bg-red-500/20 border-red-500 text-red-500'
		return 'bg-white/5 border-white/10 text-white/50'
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
						text="Quiz"
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
					<span>
						Question {idx + 1} / {QUESTIONS.length}
					</span>
					<span>
						Score: <span className="font-bold text-[#46D93B]">{score}</span>
					</span>
				</div>

				<div 
					className="p-6 rounded-2xl text-center w-full max-w-2xl mb-5 shadow-2xl"
					style={{
						background: 'rgba(255, 255, 255, 0.05)',
						backdropFilter: 'blur(10px)',
						border: '1px solid rgba(255, 255, 255, 0.1)',
					}}
				>
					<p className="text-xl sm:text-2xl font-bold text-white">{q.prompt}</p>
				</div>

				<div className="w-full max-w-2xl flex flex-col gap-3 mb-8">
					{q.choices.map((c, i) => (
						<button
							key={i}
							className={`px-6 py-4 rounded-xl border font-medium text-left transition-all ${statusClass(i)}`}
							style={{
								backdropFilter: 'blur(5px)',
							}}
							onClick={() => choose(i)}
							disabled={locked}
						>
							<span className="mr-2 font-bold opacity-50">{String.fromCharCode(65 + i)}.</span> {c}
						</button>
					))}
				</div>

				<div className="w-full max-w-2xl flex gap-4 justify-center flex-wrap">
					<button
						className="cursor-pointer transition-transform duration-300 hover:scale-105 text-white px-6 py-3 rounded-[50px] font-medium disabled:opacity-50 disabled:cursor-not-allowed"
						style={{
							background: 'rgba(255, 255, 255, 0.05)',
							backdropFilter: 'blur(10px)',
							border: '1px solid rgba(255, 255, 255, 0.1)',
						}}
						onClick={prev}
						disabled={idx === 0}
					>
						← Précédent
					</button>
					{!finished && (
						<button
							className="cursor-pointer transition-transform duration-300 hover:scale-105 text-white px-6 py-3 rounded-[50px] font-medium disabled:opacity-50 disabled:cursor-not-allowed"
							style={{
								background: 'rgba(0, 207, 0, 0.05)',
								backdropFilter: 'blur(10px)',
								border: '1px solid rgba(0, 207, 0, 0.3)',
							}}
							onClick={next}
							disabled={!locked}
						>
							<ShinyText text="Suivant →" disabled={false} speed={3} />
						</button>
					)}
					{finished && (
						<button
							className="cursor-pointer transition-transform duration-300 hover:scale-105 text-white px-6 py-3 rounded-[50px] font-medium"
							style={{
								background: 'rgba(0, 207, 0, 0.05)',
								backdropFilter: 'blur(10px)',
								border: '1px solid rgba(0, 207, 0, 0.3)',
							}}
							onClick={restart}
						>
							<ShinyText text="Rejouer" disabled={false} speed={3} />
						</button>
					)}
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
