import admin from "./firebaseAdmin.js";
import { Message } from "firebase-admin/messaging";

export const sendNotificationMessage = async (
	token: string,
	title: string,
	body: string,
	link?: string
) => {
	const message: Message = {
		token,
		notification: { title, body },
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
