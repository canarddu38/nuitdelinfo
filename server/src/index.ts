import express from "express";
import cors from "cors";
import Database from "better-sqlite3";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import v8 = require("v8");
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();
const port = 8080;

app.use(cors());
app.use(express.json());
app.use(cookieParser());

const secret = process.env.JWT_SECRET;
const db = new Database("database.db");

db.prepare(`
	CREATE TABLE IF NOT EXISTS users (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		username TEXT UNIQUE,
		password TEXT,
		token TEXT,
		xp INT
	)
`).run();

app.post("/api/addxp", (req, res) => {
	const token = req.cookies.token;
	const { amount }  = req.body;
	try {
		const data = jwt.decode(token, { complete: true }).payload;
		db.prepare("UPDATE users SET xp = xp + ? WHERE username = ?").run(amount, data.username) // /!\ critical vulnerability /!\
		return res.status(200).json({ success: true });
	} catch {
		return res.status(401).json({ success: false });
	}
});

app.post("/api/logout", (req, res) => {
	res.clearCookie('token', {
        httpOnly: true,
		secure: false,
		sameSite: "lax"
    });
	return res.json({ success: true });
});

app.post("/api/login", (req, res) => {
	const { username, password } = req.body;
	const hash = crypto.createHash("sha256").update(password).digest("base64");
	const user = db.prepare("SELECT * FROM users WHERE username = ? AND password = ?").get(username, hash);
	if (!user)
		return res.status(400).json({ success: false, message: "Invalid user" });
	res.cookie("token", user.token, {
        httpOnly: true,
		secure: false,
		sameSite: "lax",
		maxAge: 7 * 24 * 60 * 60 * 1000,
    });
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
	const payload = { username: username };
	const token = jwt.sign(payload, secret, { expiresIn: "20m" });
	db.prepare("INSERT INTO users (username, password, token, xp) VALUES (?, ?, ?, 0)").run(username, hash, token);
	return res.json({ success: true });
});

app.get("/api/me", (req, res) => {
	const token = req.cookies.token;
	try {
		const data = jwt.decode(token, { complete: true }).payload;
		const user = db.prepare("SELECT * FROM users WHERE username = ?").all(data.username) // /!\ critical vulnerability /!\
		return res.json({ success: true, user: {
				username: user[0].username, id: user[0].id, xp: user[0].xp
		}});
	} catch {
		return res.status(401).json({ success: false });
	}
});

app.listen(port, () => {
	console.log(`API running at http://localhost:${port}`);
});
