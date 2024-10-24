import "dotenv/config";

export default ({config}) => {
	const isDevelopment = process.env.NODE_ENV === "development";
	return {
		...config,
		extra: {
			convexUrl: process.env.EXPO_PUBLIC_CONVEX_URL,
			clerkPublishableKey: process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY,
			isDevelopment,
		},
	};
};
