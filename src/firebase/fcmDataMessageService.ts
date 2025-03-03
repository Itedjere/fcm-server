import admin from "./firebaseAdmin.js";
import { Message } from "firebase-admin/messaging";

export const sendDataMessage = async (
	tokens: string[],
	title: string,
	body: string,
	link?: string
) => {
	const message: admin.messaging.MulticastMessage = {
		tokens,
		data: {
			title,
			body,
			link: link || "", // Ensure link is a string, even if undefined
		},
	};

	try {
		const response = await admin.messaging().sendEachForMulticast(message);
		if (response.failureCount > 0) {
			const failedTokens = [];
			response.responses.forEach((resp, idx) => {
				if (!resp.success) {
					failedTokens.push(tokens[idx]);
				}
			});
			console.log("List of tokens that caused failures: " + failedTokens);
		}
		console.log("FCM Notification Sent:", response);
		return response;
	} catch (error) {
		console.error("Error sending FCM notification:", error);
		throw new Error("Failed to send notification");
	}
};
