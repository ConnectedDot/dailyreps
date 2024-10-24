import {StyleSheet} from "react-native";

export const styles = StyleSheet.create({
	input: {
		height: 40,
		borderWidth: 1,
		padding: 10,
		borderRadius: 6,
		// borderColor: "rgba(0, 0, 0, 0.11)",
		// boxShadow: '1px 1px 5px rgba(0, 0, 0, 0.07)',

		width: "100%", // Modified width to be full
	},
	screen: {
		padding: 10,
		display: "flex",
		gap: 8,
	},
	otherscreen: {
		padding: 10,
		display: "flex",
		gap: 8,
		flex: 1,
		marginTop: 0,
	},
	authScreen: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		justifyContent: "center",
		alignItems: "center",
		padding: 20,
	},
	authForm: {
		padding: 18,
		display: "flex",
		gap: 8,
		width: "100%",
	},
	stepContainer: {
		gap: 8,
		padding: 10,
		marginBottom: 8,
		marginTop: 36,
	},
	inputContainer: {
		width: "100%", // Modified width to be full
	},
});
