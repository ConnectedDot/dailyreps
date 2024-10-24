import {Redirect, Stack} from "expo-router";
import {useAuth} from "@clerk/clerk-expo";
import {Tabs} from "expo-router";
import React from "react";

import {TabBarIcon} from "@/components/navigation/TabBarIcon";
import {Colors} from "@/constants/Colors";
import {useColorScheme} from "@/hooks/useColorScheme";
import {GestureHandlerRootView} from "react-native-gesture-handler";

export default function AuthRoutesLayout() {
	const colorScheme = useColorScheme();
	const {isSignedIn} = useAuth();

	if (isSignedIn) {
		return <Redirect href={"/"} />;
	}

	return (
		<Stack>
			<Stack.Screen name="sign-in" options={{headerShown: false}} />
			<Stack.Screen name="sign-up" options={{headerShown: false}} />
		</Stack>
	);
}
