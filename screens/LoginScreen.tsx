import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig';

const LoginScreen = () => {
  const { theme } = useTheme();
  const { login, continueAsGuest } = useAuth();
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) return;

    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const user = result.user;
      login({ id: user.uid, email: user.email || '' });
    } catch (error: any) {
      if (error.code === 'auth/user-not-found') {
        // Auto-register if user doesn't exist
        try {
          const result = await createUserWithEmailAndPassword(auth, email, password);
          const user = result.user;
          login({ id: user.uid, email: user.email || '' });
        } catch (err) {
          if (err instanceof Error) {
            Alert.alert('Sign Up Failed', err.message);
          } else {
            Alert.alert('Sign Up Failed', 'An unknown error occurred.');
          }
        }
      } else {
        if (error instanceof Error) {
          Alert.alert('Login Failed', error.message);
        } else {
          Alert.alert('Login Failed', 'An unknown error occurred.');
        }
      }
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>
        Welcome to Virtual Fitting Room
      </Text>

      <TextInput
        style={[styles.input, { borderColor: theme.inputBorder, color: theme.text }]}
        placeholder="Enter your email"
        placeholderTextColor={theme.placeholder}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={[styles.input, { borderColor: theme.inputBorder, color: theme.text }]}
        placeholder="Enter your password"
        placeholderTextColor={theme.placeholder}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.card }]}
        onPress={handleLogin}
      >
        <Text style={[styles.buttonText, { color: theme.text }]}>Log In</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.card }]}
        onPress={continueAsGuest}
      >
        <Text style={[styles.buttonText, { color: theme.text }]}>
          Continue as Guest
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  button: {
    padding: 14,
    borderRadius: 10,
    marginTop: 10,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
