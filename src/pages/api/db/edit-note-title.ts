import type { APIRoute } from "astro";
import xss from "xss";
import { app } from "@firebase/server";
import { getFirestore } from "firebase-admin/firestore";
import { encryptData } from "@lib/encryption/encryptData";
import { serverUser } from "@lib/auth/get-user";

export const POST: APIRoute = async ({ request }) => {
	try {
		const db = getFirestore(app);
		const { oldNoteTitle, newNoteTitle, noteContent } =
			await request.json();
		//Sanitize data
		const oldPureTitle = xss(oldNoteTitle);
		const newPureTitle = xss(newNoteTitle);
		const pureContent = xss(noteContent);

		const user = await serverUser(request);

		if (!oldPureTitle || !newPureTitle) {
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
		const noteExists = (
			await db
				.collection("users")
				.doc(user.uid)
				.collection("notes")
				.doc(newPureTitle)
				.get()
		).exists;
		if (noteExists)
			return new Response(
				JSON.stringify("Note with this title already exists"),
				{
					status: 400,
				}
			);

		//find and delete old note with old title
		const oldNote = db
			.collection("users")
			.doc(user.uid)
			.collection("notes")
			.doc(oldPureTitle);

		oldNote.delete();

		//create new note with new title
		await db
			.collection("users")
			.doc(user.uid)
			.collection("notes")
			.doc(newPureTitle)
			.set({ content: encryptData(pureContent) });

		return new Response(JSON.stringify("Success"), {
			status: 200,
		});
	} catch {
		return new Response(JSON.stringify("Something went wrong"), {
			status: 500,
		});
	}
};
