import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
	apiKey: "your apiKey",
	authDomain: "your authDomain",
	projectId: "your projectId",
	storageBucket: "your storageBucket",
	messagingSenderId: "your messagingSenderId",
	appId: "your appId",
	measurementId: "measurementId",
};

// Initialize Firebase for client
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
