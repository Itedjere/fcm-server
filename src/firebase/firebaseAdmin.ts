import admin from "firebase-admin";
import { readFileSync } from "fs";
import path from "path";
import { __dirname } from "../serverPath.js";

if (!admin.apps.length) {
	// Load service account JSON file securely
	const serviceAccountPath = path.resolve(
		__dirname,
		"../serviceAccountKey.json"
	);
	const serviceAccount = JSON.parse(
		readFileSync(serviceAccountPath, "utf-8")
	);
	// Initialize Firebase Admin SDK
	admin.initializeApp({
		credential: admin.credential.cert(serviceAccount),
	});
}

export default admin;
