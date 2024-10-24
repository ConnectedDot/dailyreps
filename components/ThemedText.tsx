import {Text, type TextProps, StyleSheet} from "react-native";

import {useThemeColor} from "@/hooks/useThemeColor";

export type ThemedTextProps = TextProps & {
	lightColor?: string;
	darkColor?: string;
	type?:
		| "default"
		| "title"
		| "defaultSemiBold"
		| "subtitle"
		| "link"
		| "small";
};

export function ThemedText({
	style,
	lightColor,
	darkColor,
	type = "default",
	...rest
}: ThemedTextProps) {
	const color = useThemeColor({light: lightColor, dark: darkColor}, "text");

	return (
		<Text
			style={[
				{color},
				type === "small" ? styles.small : undefined,
				type === "default" ? styles.default : undefined,
				type === "title" ? styles.title : undefined,
				type === "defaultSemiBold" ? styles.defaultSemiBold : undefined,
				type === "subtitle" ? styles.subtitle : undefined,
				type === "link" ? styles.link : undefined,
				style,
			]}
			{...rest}
		/>
	);
}

const styles = StyleSheet.create({
	small: {
		fontSize: 12,
		lineHeight: 24,
		fontFamily: "PoppinsRegular",
	},
	default: {
		fontSize: 16,
		lineHeight: 24,
		fontFamily: "PoppinsRegular",
	},

	defaultSemiBold: {
		fontSize: 16,
		lineHeight: 24,
		// fontWeight: "600",
		fontFamily: "PoppinsSemiBold",
	},
	title: {
		fontSize: 32,
		// fontWeight: "bold",
		lineHeight: 38,
		fontFamily: "PoppinsBold",
	},
	subtitle: {
		fontSize: 20,
		// fontWeight: "bold",
		fontFamily: "PoppinsRegular",
	},
	link: {
		lineHeight: 30,
		fontSize: 16,
		color: "#0a7ea4",
		fontFamily: "PoppinsRegular",
	},
});
