import type { APIRoute } from "astro";
import { getAuth } from "firebase-admin/auth";
import { app } from "@firebase/server";
import { serverUser } from "@lib/auth/get-user";
import xss from "xss";

const auth = getAuth(app);

export const POST: APIRoute = async ({ request }) => {
	try {
		const user = await serverUser(request);
		const { newPassword } = await request.json();
		const purePassword = xss(newPassword);
		if (!user) {
			return new Response(JSON.stringify("User not authenticated"), {
				status: 400,
			});
		}
		auth.updateUser(user.uid, { password: purePassword });
		return new Response(JSON.stringify("Success"), { status: 200 });
	} catch (error) {
		return new Response(JSON.stringify("Something went wrong: " + error), {
			status: 500,
		});
	}
};
