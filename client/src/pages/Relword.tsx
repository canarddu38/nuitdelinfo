import { useState, useRef, useEffect } from "react";
import ShinyText from '../components/utils/ShinyText';
import ColorBends from '../components/utils/ColorBends';
import TextPressure from '../components/utils/TextPressure';
import { useNavigate } from "react-router-dom";

interface Word {
  app: string;
  altern: string;
}

const WORDS: Word[] = [
	{app: "Google", altern: "Brave" },
	{app: "Chrome", altern: "Firefox" },
	{app: "Google Drive", altern: "Nextcloud" },
	{app: "Gmail", altern: "ProtonMail" },
	{app: "WhatsApp", altern: "Signal" },
	{app: "Office", altern: "LibreOffice" },
	{app: "GitHub", altern: "Gitea" },
	{app: "Maps", altern: "OpenStreetMap" },
	{app: "Passwords Drive", altern: "Bitwarden" },
	{app: "Windows", altern: "Linux" },
	{app: "ChatGPT", altern: "LLAMA" },
	{app: "Spotify", altern: "Funkwhale" },
];

function shuffle<T>(array: T[]): T[] {
	const arr = [...array];
	for (let i = arr.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[arr[i], arr[j]] = [arr[j], arr[i]];
	}
	return arr;
}

export default function Relword() {
	const navigate = useNavigate();
	const [selected, setSelected] = useState<number | null>(null);
	const [connections, setConnections] = useState<{ left: number; right: number }[]>([]);
	const [score, setScore] = useState<number>(0);
	const [lines, setLines] = useState<JSX.Element[]>([]);

	const containerRef = useRef<HTMLDivElement>(null);
	const leftRefs = useRef<(HTMLDivElement | null)[]>([]);
	const rightRefs = useRef<(HTMLDivElement | null)[]>([]);

	const [rightWords] = useState(() => shuffle(WORDS.map(w => w.altern)));

	const handleLeftClick = (index: number) => {
		if (connections.some(c => c.left === index))
			return;
		setSelected(index);
	};

	const handleRightClick = (index: number) => {
		if (selected === null)
			return;
		if (connections.some(c => c.right === index))
			return;

		const leftWord = WORDS[selected].altern;
		const rightWord = rightWords[index];

		if (leftWord === rightWord) {
			setConnections(prev => [...prev, { left: selected, right: index }]);
			setScore(prev => prev + 10);
		}
		setSelected(null);
	};

	useEffect(() => {
		const updateLines = () => {
			if (!containerRef.current) return;
			const C = containerRef.current.getBoundingClientRect();

			const newLines = connections.map((c, i) => {
				const L = leftRefs.current[c.left]?.getBoundingClientRect();
				const R = rightRefs.current[c.right]?.getBoundingClientRect();
				if (!L || !R) return null;

				return (
					<line
						key={i}
						x1={L.right - C.left}
						y1={L.top + L.height / 2 - C.top}
						x2={R.left - C.left}
						y2={R.top + R.height / 2 - C.top}
						stroke="#46D93B"
						strokeWidth={2}
						strokeOpacity={0.6}
					/>
				);
			}).filter(Boolean) as JSX.Element[];
			setLines(newLines);
		};

		updateLines();
		window.addEventListener('resize', updateLines);
		return () => window.removeEventListener('resize', updateLines);
	}, [connections, selected]);

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

		<div className="relative z-10 w-full min-h-screen flex flex-col items-center px-4 py-8">
			<div className="mb-8 w-full max-w-4xl text-center">
				<TextPressure
					text="Relword"
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

			<div className="mb-6 text-center">
				<h2 className="text-xl text-white/80 mb-2">
					Relie la colonne de gauche à des alternatives open source
				</h2>
				<span className="inline-block px-4 py-2 rounded-full bg-[#46D93B]/20 border border-[#46D93B] text-[#46D93B] font-bold">
					{`Score : ${score}`}
				</span>
			</div>

			<div 
				ref={containerRef} 
				className="relative w-full max-w-4xl p-6 rounded-2xl shadow-2xl flex justify-between gap-8 sm:gap-16"
				style={{
					background: 'rgba(255, 255, 255, 0.05)',
					backdropFilter: 'blur(10px)',
					border: '1px solid rgba(255, 255, 255, 0.1)',
				}}
			>
				<svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
					{lines}
				</svg>

				<div className="flex flex-col gap-4 w-1/2 z-10">
					{WORDS.map((w, i) => {
						const isConnected = connections.some(c => c.left === i);
						const isSelected = selected === i;
						return (
							<div
								key={i}
								ref={el => leftRefs.current[i] = el}
								onClick={() => handleLeftClick(i)}
								className={`p-3 rounded-lg text-center cursor-pointer transition-all duration-300 border ${
									isConnected 
										? 'bg-[#46D93B]/20 border-[#46D93B] text-[#46D93B]' 
										: isSelected
											? 'bg-white/20 border-white text-white scale-105'
											: 'bg-white/5 border-white/10 text-white hover:bg-white/10'
								}`}
							>
								{w.app}
							</div>
						);
					})}
				</div>

				<div className="flex flex-col gap-4 w-1/2 z-10">
					{rightWords.map((w, i) => {
						const isConnected = connections.some(c => c.right === i);
						return (
							<div
								key={i}
								ref={el => rightRefs.current[i] = el}
								onClick={() => handleRightClick(i)}
								className={`p-3 rounded-lg text-center cursor-pointer transition-all duration-300 border ${
									isConnected 
										? 'bg-[#46D93B]/20 border-[#46D93B] text-[#46D93B]' 
										: 'bg-white/5 border-white/10 text-white hover:bg-white/10'
								}`}
							>
								{w}
							</div>
						);
					})}
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
		{score >= 120 && (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={() =>navigate('../dashboard')}>
			<div className="flex flex-col items-center justify-center h-full text-white">
              <ShinyText
                text="Bien joué"
				className="text-4xl mb-4"
                disabled={false}
                speed={3}
              />
			  <p className="text-white/70">Clique pour retourner au Menu</p>
			</div>

		</div>
		)}
	</div>
	);
}
