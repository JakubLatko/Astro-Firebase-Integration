import type { APIRoute } from "astro";
import { getAuth } from "firebase-admin/auth";
import { app } from "@firebase/server";
import { getFirestore } from "firebase-admin/firestore";

import { v4 as uuidv4 } from "uuid";
import { welcomeContent } from "@lib/welcome";
import xss from "xss";
import { isDisposableEmail } from "disposable-email-domains-js";
import { encryptData } from "@lib/encryption/encryptData";

export const POST: APIRoute = async ({ request }) => {
	try {
		const auth = getAuth(app);
		const db = getFirestore(app);

		const { password, email } = await request.json();

		if (!email || !password) {
			return new Response(JSON.stringify("Missing form data"), {
				status: 400,
			});
		}

		//Sanitize the inputs
		const pureEmail = xss(email);
		const purePassword = xss(password);

		//Check if the passwords are at least 8 characters long
		if (purePassword.length < 8) {
			return new Response(JSON.stringify("Password is too short"), {
				status: 400,
			});
		}
		//Check if the passwords are at least 8 characters long
		if (purePassword.length > 64) {
			return new Response(JSON.stringify("Password is too long"), {
				status: 400,
			});
		}
		//Check if the passwords contain at least one special character
		if (!/[!@#$%^&*]/.test(purePassword)) {
			return new Response(
				JSON.stringify(
					"Password doesn't contain at least one special character"
				),
				{ status: 400 }
			);
		}

		//Check if the passwords contain at least one number
		if (!/\d/.test(purePassword)) {
			return new Response(
				JSON.stringify("Password doesn't contain at least one digit"),
				{ status: 400 }
			);
		}

		//Check if the passwords contain at least one uppercase letter
		if (!/[A-Z]/.test(purePassword)) {
			return new Response(
				JSON.stringify(
					"Password doesn't contain at least one uppercase letter"
				),
				{ status: 400 }
			);
		}

		//Check if the email address is disposable
		if (isDisposableEmail(pureEmail)) {
			return new Response(
				JSON.stringify("This is a disposable email. Use real email."),
				{
					status: 400,
				}
			);
		}

		//Generate user id
		const id = uuidv4();

		//Create user in Firebase Auth
		await auth.createUser({
			uid: id,
			email: pureEmail,
			password: purePassword,
		});

		//Create a collection corresponding to user in Firebase Firestore
		await db.collection("users").doc(id).set({ email });
		await db
			.collection("users")
			.doc(id)
			.collection("notes")
			.doc("Welcome")
			.set({ content: encryptData(welcomeContent) });
		return new Response(JSON.stringify("User created"), {
			status: 200,
		});
	} catch (error) {
		return new Response(JSON.stringify(error), {
			status: 500,
		});
	}
};
