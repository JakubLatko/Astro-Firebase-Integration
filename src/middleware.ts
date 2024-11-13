import { defineMiddleware } from "astro/middleware";
import { getAuth } from "firebase-admin/auth";
import { app } from "@firebase/server";
import { toast } from "react-toastify";

const auth = getAuth(app);
interface middlewareResponse {
	accessible: boolean;
	toBeVerified: boolean;
}
export const onRequest = defineMiddleware(async (context, next) => {
	//general trycatch to redirect user to sign-in if something goes catastrophically wrong. But it won't, right?
	try {
		async function checkUser() {
			try {
				if (
					!context.cookies.has("__session") ||
					!context.cookies.get("__session")
				) {
					return { accessible: false, toBeVerified: false };
				}

				//absolutely no clue, how to remove this error. It just wants to be here i guess
				const sessionCookie = context.cookies.get("__session")?.value;
				if (!sessionCookie) {
					return { accessible: false, toBeVerified: false };
				}
				const decodedCookie =
					await auth.verifySessionCookie(sessionCookie);
				const user = await auth.getUser(decodedCookie.uid);

				//if there's no user redirect to signin
				if (!user) {
					return { accessible: false, toBeVerified: false };
				}

				//if email is not verified redirect to verify-email page
				if (user.emailVerified === false) {
					return { accessible: true, toBeVerified: true };
				} else {
					// everything is fine, email verified and user found
					return { accessible: true, toBeVerified: false };
				}
			} catch (error) {
				if (error instanceof Error) {
					toast.error(error.message);
				}
				//something went wrong, no access
				return { accessible: false, toBeVerified: false };
			}
		}
		// allow user to signin and signout
		if (
			context.url.pathname.startsWith("/api/auth/sign-in") ||
			context.url.pathname.startsWith("/api/auth/sign-out")
		) {
			return next();
		}

		// check if path contains protected routes
		if (
			context.url.pathname.startsWith("/p") ||
			context.url.pathname.startsWith("/api/auth") ||
			context.url.pathname.startsWith("/api/db")
		) {
			const checked: middlewareResponse = await checkUser();
			if (
				checked.accessible === true &&
				checked.toBeVerified === true &&
				context.url.pathname.startsWith("/p/verify-email")
			) {
				// allow to access verifying page
				return next();
			}
			if (checked.accessible === true && checked.toBeVerified === true) {
				//user has to have his email be verified
				return Response.redirect(
					new URL("/p/verify-email", context.url),
					303
				);
			}

			if (checked.accessible === true) {
				return next();
			} else {
				return Response.redirect(new URL("/sign-in", context.url));
			}
		} else {
			return next();
		}
	} catch {
		return Response.redirect(new URL("/sign-in", context.url));
	}
});
