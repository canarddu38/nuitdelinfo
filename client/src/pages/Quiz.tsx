import { useEffect, useState } from 'react'

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
		if (!locked) return 'bg-white/20 border-white/40 text-white'
		if (i === q.answerIndex) return 'bg-green-500 border-green-500 text-white'
		if (selected === i) return 'bg-red-500 border-red-500 text-white'
		return 'bg-white/20 border-white/40 text-white'
	}

	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-500 to-indigo-500 text-white p-5">
			<h1 className="text-4xl sm:text-5xl font-bold mb-8 drop-shadow-md">Quiz</h1>

			<div className="flex gap-6 mb-5 text-center text-lg sm:text-xl">
				<span>
					Question {idx + 1} / {QUESTIONS.length}
				</span>
				<span>
					Score: <span className="font-bold text-yellow-400">{score}</span>
				</span>
			</div>

			<div className="p-5 rounded-xl text-center max-w-[90vw] mb-5 bg-black/25 border border-white/25 animate-slide-in">
				<p className="text-xl sm:text-2xl font-bold">{q.prompt}</p>
			</div>

			<div className="w-full max-w-[700px] flex flex-col gap-2.5 mb-5">
				{q.choices.map((c, i) => (
					<button
						key={i}
						className={`px-4 py-2 rounded-md border font-bold text-left transition ${statusClass(i)}`}
						onClick={() => choose(i)}
						disabled={locked}
					>
						<span className="mr-2 font-bold">{String.fromCharCode(65 + i)}.</span> {c}
					</button>
				))}
			</div>

			<div className="w-full max-w-[700px] flex gap-2 justify-center flex-wrap">
				<button
					className="px-4 py-2 min-w-[100px] rounded-md bg-indigo-400/30 border border-indigo-600/60"
					onClick={prev}
					disabled={idx === 0}
				>
					← Précédent
				</button>
				{!finished && (
					<button
						className="px-4 py-2 min-w-[100px] rounded-md bg-indigo-400/30 border border-indigo-600/60"
						onClick={next}
						disabled={!locked}
					>
						Suivant →
					</button>
				)}
				{finished && (
					<button
						className="px-4 py-2 min-w-[100px] rounded-md bg-indigo-400/30 border border-indigo-600/60"
						onClick={restart}
					>
						Rejouer
					</button>
				)}
			</div>
		</div>
	)
}
