import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React from "react";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";
import { ClerkLoaded, ClerkProvider, useAuth } from "@clerk/clerk-expo";
import * as SecureStore from "expo-secure-store";
import { GestureHandlerRootView } from "react-native-gesture-handler";

// Import the necessary Convex components
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { NotificationProvider } from "./src/Native Alert";

// Create a Convex client
const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!, {
	unsavedChangesWarning: false,
});

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;
if (!publishableKey) {
	throw new Error(
		"Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env"
	);
}

const tokenCache = {
	async getToken(key: string) {
		try {
			const item = await SecureStore.getItemAsync(key);
			if (item) {
				console.log(`${key} was used 🔐 \n`);
			} else {
				console.log("No values stored under key: " + key);
			}
			return item;
		} catch (error) {
			console.error("SecureStore get item error: ", error);
			await SecureStore.deleteItemAsync(key);
			return null;
		}
	},
	async saveToken(key: string, value: string) {
		try {
			return SecureStore.setItemAsync(key, value);
		} catch (err) {
			return;
		}
	},
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
	const colorScheme = useColorScheme();
	const [loaded] = useFonts({
		PoppinsRegular: require("../assets/fonts/Poppins-Regular.ttf"),
		PoppinsBold: require("../assets/fonts/Poppins-Bold.ttf"),
		PoppinsSemiBold: require("../assets/fonts/Poppins-SemiBold.ttf"),
		PoppinsLight: require("../assets/fonts/Poppins-Light.ttf"),
	});

	React.useEffect(() => {
		if (loaded) {
			SplashScreen.hideAsync();
		}
	}, [loaded]);

	if (!loaded) {
		return null;
	}

	return (
		<GestureHandlerRootView style={{ flex: 1 }}>

			<ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
				{/* Wrap the app with the Convex/Clerk provider, using `useAuth` from Clerk for authentication */}
				<ConvexProviderWithClerk client={convex} useAuth={useAuth}>
					<ClerkLoaded>
						<ThemeProvider
							value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
						>
							<NotificationProvider>
								<Stack>
									<Stack.Screen name="(tabs)" options={{ headerShown: false }} />
									<Stack.Screen name="(auth)" options={{ headerShown: false }} />
									<Stack.Screen name="+not-found" />

									<Stack.Screen
										name="(screens)/new-workout"
										options={{
											title: "New workout",
											contentStyle: {
												backgroundColor: "white",
											},
										}}
									/>
									<Stack.Screen
										name="(screens)/log-reps/[workoutId]"
										options={{
											headerShown: false,
											title: "Log reps",
											contentStyle: {
												backgroundColor: "white",
												paddingTop: 8,
											},
										}}
									/>
									<Stack.Screen
										name="(screens)/edit-workout/[workoutId]"
										options={{
											headerShown: false,
											title: "Edit workout",
											contentStyle: {
												backgroundColor: "white",
												paddingTop: 8,
											},
										}}
									/>
									<Stack.Screen
										name="(screens)/edit-entry/[entryId]"
										options={{
											headerShown: false,
											title: "Edit entry",
											contentStyle: {
												backgroundColor: "white",
												paddingTop: 8,
											},
										}}
									/>
								</Stack>
							</NotificationProvider>
						</ThemeProvider>
					</ClerkLoaded>
				</ConvexProviderWithClerk>
			</ClerkProvider>

		</GestureHandlerRootView>
	);
}
