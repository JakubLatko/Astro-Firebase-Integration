import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ redirect, cookies }) => {
	try {
		cookies.delete("__session", {
			path: "/",
		});
		return redirect("/sign-in");
	} catch {
		return new Response(JSON.stringify("Something went wrong"), {
			status: 500,
		});
	}
};
