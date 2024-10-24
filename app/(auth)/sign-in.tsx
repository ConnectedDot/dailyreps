import { useSignIn } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import { Text, View, ActivityIndicator, TextInput } from "react-native";
import React, { useEffect, useState } from "react";
import Button from "@/components/Button";
import OAuthButton from "@/components/OAuthButton";
import MaterialCommunityIcons from "@expo/vector-icons/build/MaterialCommunityIcons";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "@/constants/styles";
// import { useColorScheme } from "@/hooks/useColorScheme.web";
import { NOTIFICATION_TYPE, useNotification } from "../src/Native Alert";

export default function SignInScreen() {
	const { signIn, setActive, isLoaded } = useSignIn();
	const router = useRouter();
	const { showDialog, showToast: AlertToast } = useNotification();

	// const colorScheme = useColorScheme();
	// const borderColor =
	// 	colorScheme === "dark" ? "#FFFFFF" : "rgba(0, 0, 0, 0.11)";

	const validateForm = (
		email: string,
		password: string
	): { textBody?: string; type?: any; title: string } => {
		let errors: { textBody?: string; type?: any; title: string } = {
			title: "",
		};

		if (!email) {
			errors = {
				textBody: "Email is required",
				type: NOTIFICATION_TYPE.DANGER,
				title: "",
			};
		} else if (!password) {
			errors = {
				textBody: "Password is required",
				type: NOTIFICATION_TYPE.DANGER,
				title: "",
			};
		}
		return errors;
	};


	// useEffect(() => {
	// 	if (notification.textBody) {
	// 		AlertToast(notification);
	// 	}
	// }, [notification]);

	const [formData, setFormData] = useState({ email: "", password: "" });



	const [Loading, setLoading] = React.useState(false);
	// const [password, setPassword] = React.useState("");


	const handleInputChange = (name: string, value: string) => {
		setFormData({ ...formData, [name]: value });
	};


	const onSignInPress = React.useCallback(async () => {
		if (!isLoaded) {
			return;
		}

		try {
			const { email, password } = formData;

			const validationErrors = validateForm(email, password);

			if (validationErrors.textBody) {
				AlertToast(validationErrors);
			} else {

				setLoading(true);
				const signInAttempt = await signIn.create({
					identifier: formData.email,
					password,
				});

				if (signInAttempt.status === "complete") {
					setLoading(false);
					await setActive({
						session: signInAttempt.createdSessionId,
					});

					router.replace("/");
				} else {
					setLoading(false);
					AlertToast({
						title: "Sign In Failed",
						textBody: JSON.stringify(signInAttempt, null, 2) || "An error occurred during sign-in.",
						type: NOTIFICATION_TYPE.DANGER,
					}); console.error(JSON.stringify(signInAttempt, null, 2));
				}
			}
		} catch (err: any) {
			console.error(JSON.stringify(err, null, 2));
		}
	}, [isLoaded]);

	if (!isLoaded) {
		return <ActivityIndicator size="large" />;
	}

	return (
		<ThemedView style={styles.authScreen}>
			<View style={styles.authForm}>
				{/* Header text */}
				<View
					style={{
						marginVertical: 20,
						alignItems: "center",
						margin: 20,
						padding: 10,
						borderRadius: 18,
						
					}}
				>
					<ThemedText> Sign into Daily Reps</ThemedText>
					<ThemedText type="default">
						Welcome back! Please sign in to continue
					</ThemedText>
				</View>

				{/* OAuth buttons */}
				<View
					style={{
						display: "flex",
						flexDirection: "row",
						gap: 8,
					}}
				>
					<View style={{ flex: 1 }}>
						<OAuthButton strategy="oauth_google">
							<MaterialCommunityIcons name="google" size={18} />

							<ThemedText type="small">Google </ThemedText>
						</OAuthButton>
					</View>
				</View>

				{/* Form separator */}
				<View style={{ flexDirection: "row", alignItems: "center" }}>
					<View style={{ flex: 1, height: 1, backgroundColor: "#eee" }} />
					<View>
						<ThemedText style={{ width: 50, textAlign: "center", color: "#555" }}>
							<ThemedText type="small">or</ThemedText>
						</ThemedText>
					</View>
					<View style={{ flex: 1, height: 1, backgroundColor: "#eee" }} />
				</View>

				{/* Input fields */}
				<View style={{ gap: 8, marginBottom: 24 }}>
					<View>
						<ThemedText style={{ width: 300 }}>Email address</ThemedText>
					</View>
					<ThemedView style={styles.inputContainer}>
						<TextInput
							style={styles.input}
							autoCapitalize="none"
							value={formData.email}
							onChangeText={value => handleInputChange("email", value)}

							// onChangeText={emailAddress => setEmailAddress(emailAddress)}
							className=""
						/>
					</ThemedView>
					<ThemedText style={{ width: 300 }}>Password </ThemedText>
					<ThemedView style={styles.inputContainer}>
						<TextInput
							style={styles.input}
							value={formData.password}
							secureTextEntry={true}
							onChangeText={value => handleInputChange("email", value)}
						/>
					</ThemedView>
				</View>

				{/* Sign in button */}
				<Button onPress={onSignInPress}>
					<ThemedText>Signn in </ThemedText>
					<Ionicons name="caret-forward" />
				</Button>

				{/* Suggest new users create an account */}
				<View
					style={{
						display: "flex",
						flexDirection: "row",
						gap: 4,
						justifyContent: "center",
						marginVertical: 18,
					}}
				>
					<ThemedText type="default">Don't have an account?</ThemedText>
					<Link href="/sign-up">


						{Loading ? (
							<ActivityIndicator size="small" color="#ffffff" />
						) : (
							<Text className="text-white font-bold text-xl">Sign Up</Text>
						)}


						{/* <Text style={{fontWeight: "bold"}}>
							
							
							
							Sign up
							
							</Text> */}
					</Link>
				</View>
			</View>
		</ThemedView>
	);
}
