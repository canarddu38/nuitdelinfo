import React from 'react'
import controller from 'assets/controller.svg'
// Tailwind-styled controller for entering a Konami-like code.
// Props: onSuccess() -> called when the sequence is correct.
export default function Controller({ onSuccess }: { onSuccess: () => void }) {
	const CODE = ['UP', 'UP', 'DOWN', 'DOWN', 'LEFT', 'RIGHT', 'LEFT', 'RIGHT', 'B', 'A', 'START']
	const [sequence, setSequence] = React.useState<string[]>([])
	const [error, setError] = React.useState<string | null>(null)

	const push = (key: string) => {
		setError(null)
		setSequence(prev => {
			const next = [...prev, key]
			if (next.length > CODE.length) return [key]
			return next
		})
	}

	const confirm = () => {
		if (sequence.length !== CODE.length) {
			setError('Code incomplet')
			return
		}
		const ok = sequence.every((s, i) => s === CODE[i])
		if (ok) onSuccess()
		else {
			setError('Code incorrect')
			setSequence([])
		}
	}

	const clear = () => {
		setSequence([])
		setError(null)
	}

		return (
			<div className="flex flex-col gap-4">
				{/* Controller graphic with overlayed buttons */}
				<div className="relative mx-auto w-full max-w-md sm:max-w-lg">
					<img src={controller} alt="controller" className="w-full h-auto select-none" />

					{/* D-Pad */}
					<button aria-label="Up" onClick={() => push('UP')}
						className="absolute -translate-x-1/2 -translate-y-1/2 bg-white/10 text-white border border-white/20 hover:bg-white/20 rounded-md backdrop-blur-sm"
						style={{ left: '22%', top: '28%', width: '12%', height: '8%' }}>
						↑
					</button>
					<button aria-label="Left" onClick={() => push('LEFT')}
						className="absolute -translate-x-1/2 -translate-y-1/2 bg-white/10 text-white border border-white/20 hover:bg-white/20 rounded-md backdrop-blur-sm"
						style={{ left: '16%', top: '35%', width: '12%', height: '8%' }}>
						←
					</button>
					<button aria-label="Down" onClick={() => push('DOWN')}
						className="absolute -translate-x-1/2 -translate-y-1/2 bg-white/10 text-white border border-white/20 hover:bg-white/20 rounded-md backdrop-blur-sm"
						style={{ left: '22%', top: '42%', width: '12%', height: '8%' }}>
						↓
					</button>
					<button aria-label="Right" onClick={() => push('RIGHT')}
						className="absolute -translate-x-1/2 -translate-y-1/2 bg-white/10 text-white border border-white/20 hover:bg-white/20 rounded-md backdrop-blur-sm"
						style={{ left: '28%', top: '35%', width: '12%', height: '8%' }}>
						→
					</button>

					{/* AB buttons */}
					<button aria-label="B" onClick={() => push('B')}
						className="absolute -translate-x-1/2 -translate-y-1/2 bg-white/10 text-white border border-white/20 hover:bg-white/20 rounded-full backdrop-blur-sm"
						style={{ left: '72%', top: '33%', width: '10%', height: '10%' }}>B</button>
					<button aria-label="A" onClick={() => push('A')}
						className="absolute -translate-x-1/2 -translate-y-1/2 bg-white/10 text-white border border-white/20 hover:bg-white/20 rounded-full backdrop-blur-sm"
						style={{ left: '80%', top: '37%', width: '10%', height: '10%' }}>A</button>

					{/* Start */}
					<button aria-label="Start" onClick={() => push('START')}
						className="absolute -translate-x-1/2 -translate-y-1/2 bg-[#46D93B]/20 text-[#46D93B] border border-[#46D93B] hover:bg-[#46D93B]/30 rounded-full font-semibold px-3 backdrop-blur-sm"
						style={{ left: '50%', top: '58%', height: '8%' }}>Start</button>
				</div>

				{/* Actions */}
				<div className="flex items-center justify-center gap-3 mt-2">
					<button onClick={confirm} className="px-6 py-2 rounded-full bg-[#46D93B]/20 border border-[#46D93B] text-[#46D93B] font-bold hover:bg-[#46D93B]/30">Valider</button>
					<button onClick={clear} className="px-6 py-2 rounded-full bg-white/10 border border-white/20 text-white hover:bg-white/20">Effacer</button>
				</div>

				<div className="text-center text-white/70 text-sm">Code saisi: {sequence.join(' ')}</div>
				{error && <div className="text-center text-red-400 text-sm">{error}</div>}
			</div>
		)
}