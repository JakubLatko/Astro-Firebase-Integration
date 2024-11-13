import type { APIRoute } from "astro";
import { getAuth } from "firebase-admin/auth";
import { app } from "@firebase/server";

export const GET: APIRoute = async ({ cookies, request }) => {
	try {
		const auth = getAuth(app);

		const idToken = request.headers
			.get("Authorization")
			?.split("Bearer ")[1];

		if (!idToken) {
			return new Response(JSON.stringify("Invalid credentials"), {
				status: 401,
			});
		}
		await auth.verifyIdToken(idToken);

		//Create and store session cookie
		const oneDay = 60 * 60 * 24 * 1000;
		const sessionCookie = await auth.createSessionCookie(idToken, {
			expiresIn: oneDay,
		});

		cookies.set("__session", sessionCookie, {
			path: "/",
		});

		return new Response(JSON.stringify("Success"), { status: 200 });
	} catch (error) {
		return new Response(JSON.stringify(error), {
			status: 500,
		});
	}
};
