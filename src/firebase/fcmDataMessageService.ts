import admin from "./firebaseAdmin.js";
import { Message } from "firebase-admin/messaging";

export const sendDataMessage = async (
	token: string,
	title: string,
	body: string,
	link?: string
) => {
	const message: Message = {
		token,
		data: {
			title,
			body,
			link,
		},
	};

	try {
		const response = await admin.messaging().send(message);
		console.log("FCM Notification Sent:", response);
		return response;
	} catch (error) {
		console.error("Error sending FCM notification:", error);
		throw new Error("Failed to send notification");
	}
};
