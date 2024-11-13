import { getAuth } from "firebase-admin/auth";
import { app } from "@firebase/server";
import type { AstroGlobal } from "astro";
import { UserRecord } from "firebase-admin/auth";

const auth = getAuth(app);

export async function frontmatterUser(Astro: AstroGlobal) {
	try {
		if (!Astro.cookies.has("__session")) {
			return Astro.redirect("/sign-in");
		}
		const sessionCookie = Astro.cookies.get("__session")?.value;
		if (!sessionCookie) {
			return Astro.redirect("/sign-in");
		}

		const decodedCookie = await auth.verifySessionCookie(sessionCookie);
		const user = await auth.getUser(decodedCookie.uid);

		if (user instanceof UserRecord) {
			return user as UserRecord;
		} else {
			throw new Error();
		}
	} catch {
		return null;
	}
}

export async function serverUser(request: Request) {
	try {
		const cookies = request.headers.get("Cookie")?.split(";");
		const sessionCookie = cookies?.find((cookie: string) =>
			cookie.includes("__session")
		);
		const splitCookie = sessionCookie?.split("=");
		if (!splitCookie) {
			throw new Error("Session cookie not found");
		}
		const decodedCookie = await auth.verifySessionCookie(splitCookie[1]);
		const user = await auth.getUser(decodedCookie.uid);
		if (!user || user instanceof Response) {
			throw new Error("User not found");
		}
		return user as UserRecord;
	} catch {
		return null;
	}
}
