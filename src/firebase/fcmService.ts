import admin from "./firebaseAdmin.js";
import { Message } from "firebase-admin/messaging";

export const sendNotification = async (
	token: string,
	title: string,
	body: string,
	link?: string
) => {
	const message: Message = {
		notification: { title, body },
		token,
		webpush: link && {
			fcmOptions: {
				link,
			},
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
