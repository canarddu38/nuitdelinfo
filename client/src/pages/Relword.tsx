import { useState, useRef } from "react";
import ShinyText from '../components/utils/ShinyText';
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

	const renderLines = () => {
	if (!containerRef.current) return null;
		const C = containerRef.current.getBoundingClientRect();

	return connections.map((c, i) => {
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
			stroke="black"
			strokeWidth={2}
		/>
		);
	});
	};

	return (
	<div className="bg-gray-100 min-h-screen flex flex-col items-center">
		<h2 className="text-2xl mb-3">
		Relie la colonne de gauche à des alternnatives open source
		</h2>

		<span className="ml-3 px-2 py-1 bg-blue-500 text-white rounded mb-3">
			{`Score : ${score}`}
		</span>

		<div ref={containerRef} className="relative flex justify-between max-w-4xl w-full">
		<svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
			{renderLines()}
		</svg>

		<div className="flex flex-col gap-3">
			{WORDS.map((w, i) => {
			const connected = connections.some(c => c.left === i);
			return (
				<div
				key={i}
				ref={el => (leftRefs.current[i] = el)}
				onClick={() => handleLeftClick(i)}
				className={`px-4 py-2 border rounded cursor-pointer ${
					connected
					? "bg-green-400"
					: selected === i
					? "outline-2 outline-blue-600 bg-blue-100"
					: "bg-white"
				}`}
				>
				{w.app}
				</div>
			);
			})}
		</div>

		<div className="flex flex-col gap-3">
			{rightWords.map((word, i) => {
			const connected = connections.some(c => c.right === i);
			return (
				<div
				key={i}
				ref={el => (rightRefs.current[i] = el)}
				onClick={() => handleRightClick(i)}
				className={`px-4 py-2 border rounded cursor-pointer ${
					connected ? "bg-green-400" : "bg-white"
				}`}
				>
				{word}
				</div>
			);
			})}
		</div>
		</div>
		{score >= 20 && (
		<div className="absolute w-full h-full bg-black bg-opacity-80 cursor-pointer" onClick={() =>navigate('../dashboard')}>
			<div className="flex flex-col items-center justify-center h-full text-white">
              <ShinyText
                text="Bien joué"
				className="text-4xl"
                disabled={false}
                speed={3}
              />
			  Clique pour retourner au Menu
			</div>

		</div>
		)}
	</div>
	);
	}
