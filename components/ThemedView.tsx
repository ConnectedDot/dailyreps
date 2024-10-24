import {View, type ViewProps} from "react-native";

import {useThemeColor} from "@/hooks/useThemeColor";

export type ThemedViewProps = ViewProps & {
	lightColor?: string;
	darkColor?: string;
};

export function ThemedView({
	style,
	lightColor,
	darkColor,
	...otherProps
}: ThemedViewProps) {
	const backgroundColor = useThemeColor(
		{light: lightColor, dark: darkColor},
		"background"
	);

	return <View style={[{backgroundColor}, style]} {...otherProps} />;
}

// import {View, type ViewProps, useColorScheme} from "react-native";

// export type ThemedViewProps = ViewProps & {
// 	lightColor?: string;
// 	darkColor?: string;
// };

// export function ThemedView({
// 	style,
// 	lightColor,
// 	darkColor,
// 	...otherProps
// }: ThemedViewProps) {
// 	const colorScheme = useColorScheme();
// 	const backgroundColor =
// 		colorScheme === "dark" ? darkColor || "lightgray" : lightColor || "white";

// 	return <View style={[{backgroundColor}, style]} {...otherProps} />;
// }
