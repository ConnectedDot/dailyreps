import React, {createContext, ReactElement, useContext} from "react";
import {
	AlertNotificationRoot,
	Dialog,
	Toast,
	ALERT_TYPE as NotificationAlertType, // Renaming to avoid conflicts
} from "react-native-alert-notification";
import {StyleProp, TextStyle} from "react-native";

export type CustomAlertType = "ERROR" | "WARNING" | "INFO" | "SUCCESS";

export const NOTIFICATION_TYPE = NotificationAlertType;
export type IConfig = {
	type?: NotificationAlertType;
	title?: string;
	textBody?: string;
	autoClose?: number | boolean;
	titleStyle?: StyleProp<TextStyle>;
	textBodyStyle?: StyleProp<TextStyle>;
	button?: string;
	closeOnOverlayTap?: boolean;
	onPress?: () => void;
	onPressButton?: () => void;
	onShow?: () => void;
	onHide?: () => void;
};

// Define the context type
interface NotificationContextType {
	showDialog: (config: IConfig) => void;
	showToast: (config: IConfig) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
	undefined
);

export const NotificationProvider = ({
	children,
}: {
	children: ReactElement | ReactElement[];
}) => {

	// Function to show dialog
	const showDialog = (config: IConfig) => {
		Dialog.show({
			type: config.type || NotificationAlertType.SUCCESS, // Use the imported type
			title: config.title || "",
			textBody: config.textBody || "",
			button: config.button || "",
			autoClose: config.autoClose || false,
			closeOnOverlayTap: config.closeOnOverlayTap || true,
			onPressButton: config.onPressButton || (() => Dialog.hide()),
			onShow: config.onShow,
			onHide: config.onHide,
		});
	};

	// Function to show toast
	const showToast = (config: IConfig) => {
		Toast.show({
			type: config.type || NotificationAlertType.SUCCESS, // Use the imported type
			title: config.title || "",
			textBody: config.textBody || "",
			autoClose: config.autoClose || 3000,
			titleStyle: config.titleStyle,
			textBodyStyle: config.textBodyStyle,
			onPress: config.onPress,
			onShow: config.onShow,
			onHide: config.onHide,
		});
	};

	return (
		<NotificationContext.Provider value={{showDialog, showToast}}>
			<AlertNotificationRoot>{children}</AlertNotificationRoot>
		</NotificationContext.Provider>
	);
};

// Custom hook to use Notification
export const useNotification = (): NotificationContextType => {
	const context = useContext(NotificationContext);
	if (!context) {
		throw new Error(
			"useNotification must be used within a NotificationProvider"
		);
	}
	return context;
};
