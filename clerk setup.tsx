Create an Expo application
To get started using Clerk with Expo, create a new Expo project and install the necessary dependencies.
npm
yarn
pnpm
terminal

yarn dlx create-expo-app application-name --template blank && cd application-name
yarn dlx expo install react-dom react-native-web @expo/metro-runtime
2
Install @clerk/clerk-expo
To get started using Clerk with Expo, create a new Expo project and install the necessary dependencies.
npm
yarn
pnpm
terminal

yarn add @clerk/clerk-expo
3
Set your environment variables
Add these keys to your .env or create the file if it doesn't exist. Retrieve these keys anytime from the API keys page.

.env

EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_Z3Jvd2luZy10ZXJtaXRlLTU0LmNsZXJrLmFjY291bnRzLmRldiQ
4
Add <ClerkProvider> to your root layout
All Clerk hooks and components must be children of <ClerkProvider>, which provides active session and user context. Clerk also provides <ClerkLoaded>, which will not render child content unless the Clerk API has loaded.

To grant your entire app access to Clerk session data and ensure nothing renders until Clerk loads, add both components to your root layout as shown:

app/_layout.tsx

import { ClerkProvider, ClerkLoaded } from '@clerk/clerk-expo'
import { Slot } from 'expo-router'

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!

if (!publishableKey) {
  throw new Error(
    'Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env',
  )
}

function RootLayoutNav() {
  return (
    <ClerkProvider publishableKey={publishableKey}>
      <ClerkLoaded>
        <Slot />
      </ClerkLoaded>
    </ClerkProvider>
  )
}
5
Configure the Token Cache with Expo
The token cache is used to persist the active user's session token. Clerk stores this token in memory by default, however it is recommended to use a token cache for production applications.

Install expo-secure-store, which you'll use as your token cache.

When configuring a custom token cache, you must create an object that conforms to the TokenCacheinterface:

npm
yarn
pnpm
terminal

yarn add expo-secure-store
TokenCache

export interface TokenCache {
    getToken: (key: string) => Promise<string | undefined | null>
    saveToken: (key: string, token: string) => Promise<void>
    clearToken?: (key: string) => void
  }
The example to the right demonstrates an Expo layout that defines a custom token cache to securely store the user's session JWT using expo-secure-store:

Important

Data stored with `expo-secure-store` may not persist between new builds of your application unless you clear the app data of the previously installed build.
app/_layout.tsx

import * as SecureStore from 'expo-secure-store'
import { ClerkProvider, ClerkLoaded } from '@clerk/clerk-expo'
import { Slot } from 'expo-navigation'

const tokenCache = {
  async getToken(key: string) {
    try {
      const item = await SecureStore.getItemAsync(key)
      if (item) {
        console.log(`${key} was used 🔐 \n`)
      } else {
        console.log('No values stored under key: ' + key)
      }
      return item
    } catch (error) {
      console.error('SecureStore get item error: ', error)
      await SecureStore.deleteItemAsync(key)
      return null
    }
  },
  async saveToken(key: string, value: string) {
    try {
      return SecureStore.setItemAsync(key, value)
    } catch (err) {
      return
    }
  },
}

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!

if (!publishableKey) {
  throw new Error(
    'Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env',
  )
}

function RootLayoutNav() {
  return (
    <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
      <ClerkLoaded>
        <Slot />
      </ClerkLoaded>
    </ClerkProvider>
  )
}
Expand code
6
Create (home) route group layout
Create a (home) route group with this layout file.

app/(home)/_layout.tsx

import { Stack } from 'expo-router/stack'

export default function Layout() {
  return <Stack />
}
7
Conditionally render content
You can control which content signed-in and signed-out users can see with Clerk's prebuilt components. For this quickstart, you'll use:

<SignedIn> to render content only when the user is signed in.
<SignedOut> to render content only when the user is signed out.
In the same folder, create an index.tsx file and add the following code. It displays the user's email if they're signed in, or sign-in and sign-up links if they're not:

app/(home)/index.tsx

import { SignedIn, SignedOut, useUser } from '@clerk/clerk-expo'
import { Link } from 'expo-router'
import { Text, View } from 'react-native'

export default function Page() {
  const { user } = useUser()

  return (
    <View>
      <SignedIn>
        <Text>Hello {user?.emailAddresses[0].emailAddress}</Text>
      </SignedIn>
      <SignedOut>
        <Link href="/sign-in">
          <Text>Sign In</Text>
        </Link>
        <Link href="/sign-up">
          <Text>Sign Up</Text>
        </Link>
      </SignedOut>
    </View>
  )
}
8
Protect your auth routes in the layout
Create a new route group (auth) with a _layout.tsx file. This layout will redirect users to the home page if they're already signed in:

/app/(auth)/_layout.tsx

import { Redirect, Stack } from 'expo-router'
import { useAuth } from '@clerk/clerk-expo'

export default function AuthRoutesLayout() {
  const { isSignedIn } = useAuth()

  if (isSignedIn) {
    return <Redirect href={'/'} />
  }

  return <Stack />
}
9
Add sign-up page
The following example creates a sign-up page that allows users to sign up using email address and password, and sends an email verification code to confirm their email address.
/app/(auth)/sign-up.tsx

  import * as React from 'react'
import { TextInput, Button, View } from 'react-native'
import { useSignUp } from '@clerk/clerk-expo'
import { useRouter } from 'expo-router'

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp()
  const router = useRouter()

  const [emailAddress, setEmailAddress] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [pendingVerification, setPendingVerification] = React.useState(false)
  const [code, setCode] = React.useState('')

  const onSignUpPress = async () => {
    if (!isLoaded) {
      return
    }

    try {
      await signUp.create({
        emailAddress,
        password,
      })

      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })

      setPendingVerification(true)
    } catch (err: any) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2))
    }
  }

  const onPressVerify = async () => {
    if (!isLoaded) {
      return
    }

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      })

      if (completeSignUp.status === 'complete') {
        await setActive({ session: completeSignUp.createdSessionId })
        router.replace('/')
      } else {
        console.error(JSON.stringify(completeSignUp, null, 2))
      }
    } catch (err: any) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2))
    }
  }

  return (
    <View>
      {!pendingVerification && (
        <>
          <TextInput
            autoCapitalize="none"
            value={emailAddress}
            placeholder="Email..."
            onChangeText={(email)=> setEmailAddress(email)}
          />
          <TextInput
            value={password}
            placeholder="Password..."
            secureTextEntry={true}
            onChangeText={(password)=> setPassword(password)}
          />
          <Button title="Sign Up" onPress={onSignUpPress} />
        </>
      )}
      {pendingVerification && (
        <>
          <TextInput value={code} placeholder="Code..." onChangeText={(code)=> setCode(code)} />
          <Button title="Verify Email" onPress={onPressVerify} />
        </>
      )}
    </View>
  )
}
Collapse code
10
Add a sign-in page
The following example creates a sign-in page that allows users to sign in using email address and password, or navigate to the sign-up page.
/app/(auth)/sign-in.tsx

import { useSignIn } from '@clerk/clerk-expo'
import { Link, useRouter } from 'expo-router'
import { Text, TextInput, Button, View } from 'react-native'
import React from 'react'

export default function Page() {
  const { signIn, setActive, isLoaded } = useSignIn()
  const router = useRouter()

  const [emailAddress, setEmailAddress] = React.useState('')
  const [password, setPassword] = React.useState('')

  const onSignInPress = React.useCallback(async () => {
    if (!isLoaded) {
      return
    }

    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      })

      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId })
        router.replace('/')
      } else {
        // See https://clerk.com/docs/custom-flows/error-handling
        // for more info on error handling
        console.error(JSON.stringify(signInAttempt, null, 2))
      }
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2))
    }
  }, [isLoaded, emailAddress, password])

  return (
    <View>
      <TextInput
        autoCapitalize="none"
        value={emailAddress}
        placeholder="Email..."
        onChangeText={(emailAddress)=> setEmailAddress(emailAddress)}
      />
      <TextInput
        value={password}
        placeholder="Password..."
        secureTextEntry={true}
        onChangeText={(password)=> setPassword(password)}
      />
      <Button title="Sign In" onPress={onSignInPress} />
      <View>
        <Text>Don't have an account?</Text>
        <Link href="/sign-up">
          <Text>Sign up</Text>
        </Link>
      </View>
    </View>
  )
}
Collapse code
11
Enable OTA updates
Though not required, it is recommended to implement over-the-air (OTA) updates in your Expo application. This enables you to easily roll out Clerk's feature updates and security patches as they're released without having to resubmit your application to mobile marketplaces.
Create your first user
Run your project. Then, visit your app's homepage at http://localhost:8081 and sign up to create your first user.

npm
yarn
pnpm
terminal

yarn start





@react-native-async-storage/async-storage
Purpose: Used for storing non-sensitive data persistently.
Security: Data is not encrypted by default.
Use Case: Suitable for storing non-sensitive information like user preferences, app settings, and other general data.

// Using Async Storage

import AsyncStorage from "@react-native-async-storage/async-storage";

// Storing a user item
export const setUserItem = async (key: string, value: any) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
    console.log(`User item ${key} stored successfully:`, value);
  } catch (error) {
    console.error("Error setting item storage:", error);
  }
};

// Retrieving a user item
export const getUserItem = async (key: string) => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value != null ? JSON.parse(value) : null;
  } catch (error) {
    console.error("Error getting item storage:", error);
    return null;
  }
};



expo-secure-store
Purpose: Used for storing sensitive data securely.
Security: Data is encrypted and stored securely on the device.
Use Case: Ideal for storing sensitive information like authentication tokens, passwords, and other confidential data.
Example:


// Using Secure-store
import * as SecureStore from "expo-secure-store";

// Storing a secure item
await SecureStore.setItemAsync("secureToken", "secureValue");

// Retrieving a secure item
const secureToken = await SecureStore.getItemAsync("secureToken");
console.log("Retrieved secure token:", secureToken);






Here’s an example of how you might implement expiry logic using expo-secure-store:



import * as SecureStore from "expo-secure-store";

// Function to set an item with an expiry time (in milliseconds)
export const setSecureItemWithExpiry = async (key, value, expiryTime) => {
  const item = {
    value,
    expiry: Date.now() + expiryTime,
  };
  await SecureStore.setItemAsync(key, JSON.stringify(item));
};

// Function to get an item and check if it has expired
export const getSecureItemWithExpiry = async (key) => {
  const item = await SecureStore.getItemAsync(key);
  if (!item) return null;

  const parsedItem = JSON.parse(item);
  if (Date.now() > parsedItem.expiry) {
    await SecureStore.deleteItemAsync(key); // Remove expired item
    return null;
  }

  return parsedItem.value;
};

// Usage example
const key = "secureToken";
const value = "secureValue";
const expiryTime = 24 * 60 * 60 * 1000; // 1 day in milliseconds

// Set item with expiry
await setSecureItemWithExpiry(key, value, expiryTime);

// Get item and check expiry
const secureToken = await getSecureItemWithExpiry(key);
console.log("Retrieved secure token:", secureToken);