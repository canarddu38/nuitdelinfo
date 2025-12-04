import express from "express";
import cors from "cors";
import Database from "better-sqlite3";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import crypto from "crypto";

dotenv.config();

const app = express();
const port = 8080;

app.use(cors());
app.use(express.json());

const secret = process.env.JWT_SECRET;
const db = new Database("database.db");

db.prepare(`
	CREATE TABLE IF NOT EXISTS users (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		username TEXT UNIQUE,
		password TEXT,
		token TEXT
	)
`).run();

app.post("/api/login", (req, res) => {
	const { username, password } = req.body;
	const hash = crypto.createHash("sha256").update(password).digest("base64");
	const user = db.prepare("SELECT * FROM users WHERE username = ? AND password = ?").get(username, hash);
	if (!user)
		return res.status(400).json({ success: false, message: "Invalid user" });
	return res.json({ success: true, token: user.token });
});

app.post("/api/register", (req, res) => {
	const { username, password } = req.body;
	if (username == undefined || password == undefined)
		return res.status(500).json({ success: false, message: "Invalid arguments" });
	const exists = db.prepare("SELECT * FROM users WHERE username = ?").get(username);
	if (exists)
		return res.status(400).json({ success: false, message: "User already exists" });
	const hash = crypto.createHash("sha256").update(password).digest("base64");
	const payload = { username };
	const token = jwt.sign(payload, secret, { expiresIn: "20m" });
	db.prepare("INSERT INTO users (username, password, token) VALUES (?, ?, ?)").run(username, hash, token);
	return res.json({ success: true });
});

app.get("/api/me", (req, res) => {
	const auth = req.headers.authorization;
	if (!auth)
		return res.status(401).json({ success: false });
	const token = auth.split(" ")[1];
	try {
		const data = jwt.verify(token, secret);
		return res.json({ success: true, user: data });
	} catch {
		return res.status(401).json({ success: false });
	}
});

app.listen(port, () => {
	console.log(`API running at http://localhost:${port}`);
});
