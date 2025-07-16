import React, { useEffect } from 'react';
import { LogBox } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import UploadClothingScreen from './screens/UploadClothingScreen';
import BodyInputScreen from './screens/BodyInputScreen';
import ClothingGalleryScreen from './screens/ClothingGalleryScreen';
import EditClothingScreen from './screens/EditClothingScreen';
import SettingsScreen from './screens/SettingsScreen';
import LoginScreen from './screens/LoginScreen';
import { BodyInfoProvider } from './context/BodyInfoContext';
import { ClothingProvider } from './context/ClothingContext';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { RootStackParamList } from './types/navigation';

LogBox.ignoreLogs([
  'Open debugger to view warnings.', // 👈 this hides that annoying yellow box
]);

const Stack = createNativeStackNavigator<RootStackParamList>();

function AppNavigator() {
  const { isAuthenticated, isGuest } = useAuth();
  const showApp = isAuthenticated || isGuest;

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {showApp ? (
          <>
            <Stack.Screen name="UploadClothing" component={UploadClothingScreen} />
            <Stack.Screen name="BodyInput" component={BodyInputScreen} />
            <Stack.Screen name="ClothingGallery" component={ClothingGalleryScreen} />
            <Stack.Screen name="EditClothing" component={EditClothingScreen} />
            <Stack.Screen name="Settings" component={SettingsScreen} />
          </>
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <ClothingProvider>
          <BodyInfoProvider>
            <AppNavigator />
          </BodyInfoProvider>
        </ClothingProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}




