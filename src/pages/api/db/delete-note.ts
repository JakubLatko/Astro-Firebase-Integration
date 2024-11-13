import type { APIRoute } from "astro";
import { getFirestore } from "firebase-admin/firestore";
import { app } from "@firebase/server";
import { serverUser } from "@lib/auth/get-user";

export const DELETE: APIRoute = async ({ request }) => {
	try {
		const db = getFirestore(app);
		const requestBody = await request.json();
		const user = await serverUser(request);

		if (!user) {
			return new Response(
				JSON.stringify("User not found or not authenticated"),
				{
					status: 400,
				}
			);
		}

		await db
			.collection("users")
			.doc(user.uid)
			.collection("notes")
			.doc(requestBody.noteId)
			.delete();
		return new Response(JSON.stringify("Note deleted"), { status: 200 });
	} catch {
		return new Response(JSON.stringify("Something went wrong"), {
			status: 500,
		});
	}
};
