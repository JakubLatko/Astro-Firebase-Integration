import { app } from "@firebase/server";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { serverUser } from "@lib/auth/get-user";
import type { APIRoute } from "astro";

export const DELETE: APIRoute = async ({ request, cookies }) => {
	try {
		const auth = getAuth(app);
		const db = getFirestore(app);

		const user = await serverUser(request);
		if (!user) {
			return new Response(JSON.stringify("User not found"), {
				status: 400,
			});
		}

		await auth.deleteUser(user.uid);
		cookies.delete("__session", {
			path: "/",
		});

		await db.collection("users").doc(user.uid).delete();
		return new Response(JSON.stringify("Deleted user"), { status: 200 });
	} catch (error) {
		return new Response(JSON.stringify(error), { status: 500 });
	}
};
