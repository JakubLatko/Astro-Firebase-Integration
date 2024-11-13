import { app } from "@firebase/server";
import { encryptData } from "@lib/encryption/encryptData";
import type { APIRoute } from "astro";
import { getFirestore } from "firebase-admin/firestore";
import xss from "xss";
import { serverUser } from "@lib/auth/get-user";
const db = getFirestore(app);

export const PUT: APIRoute = async ({ request }) => {
	try {
		const user = await serverUser(request);
		const { noteTitle, noteContent } = await request.json();

		if (!noteTitle || !noteContent) {
			return new Response(JSON.stringify("Missing form data"), {
				status: 400,
			});
		}

		if (!user) {
			return new Response(
				JSON.stringify("User not found or not authenticated"),
				{
					status: 400,
				}
			);
		}

		//Sanitize data
		const pureTitle = xss(noteTitle);
		const pureContent = xss(noteContent);
		const encryptedData = encryptData(pureContent);

		await db
			.collection("users")
			.doc(user.uid)
			.collection("notes")
			.doc(pureTitle)
			.set({ content: encryptedData });
		return new Response(JSON.stringify("Note saved"), { status: 200 });
	} catch {
		return new Response(JSON.stringify("Something went wrong"), {
			status: 500,
		});
	}
};
