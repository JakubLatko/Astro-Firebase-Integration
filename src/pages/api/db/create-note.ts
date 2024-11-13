import { app } from "@firebase/server";
import { getFirestore } from "firebase-admin/firestore";
import xss from "xss";
import { serverUser } from "@lib/auth/get-user";
import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request, redirect }) => {
	try {
		const user = await serverUser(request);
		const db = getFirestore(app);

		const { noteTitle } = await request.json();

		//Sanitize data
		const pureTitle = xss(noteTitle);

		if (!user)
			return new Response(
				JSON.stringify("User not found or not authenticated"),
				{
					status: 400,
				}
			);

		if (!pureTitle) {
			return new Response(JSON.stringify("Missing form data"), {
				status: 400,
			});
		}

		//check if title is too long
		if (pureTitle.length > 64)
			return new Response(JSON.stringify("Title is too long"), {
				status: 400,
			});

		//check if title is too short
		if (pureTitle.length < 1)
			return new Response(JSON.stringify("Title is too short"), {
				status: 400,
			});

		//check if note with that title already exists
		const noteExists = (
			await db
				.collection("users")
				.doc(user.uid)
				.collection("notes")
				.doc(pureTitle)
				.get()
		).exists;
		if (noteExists)
			return new Response(JSON.stringify("This note already exists"), {
				status: 400,
			});

		//creating note if it doesn't exist
		await db
			.collection("users")
			.doc(user.uid)
			.collection("notes")
			.doc(pureTitle)
			.set({ content: "" });

		return new Response(JSON.stringify("Note created"), {
			status: 200,
		});
	} catch {
		return new Response(JSON.stringify("Something went wrong"), {
			status: 500,
		});
	}
};
