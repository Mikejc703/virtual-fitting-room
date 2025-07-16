import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

const LoginScreen = () => {
  const { theme } = useTheme();
  const { login, continueAsGuest } = useAuth();
  const navigation = useNavigation();
  const [email, setEmail] = useState('');

  const handleLogin = () => {
    if (!email.trim()) return;

    login({ id: Date.now().toString(), email });
    // You can optionally navigate if using auth gating later
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>Welcome to Virtual Fitting Room</Text>

      <TextInput
        style={[styles.input, { borderColor: theme.inputBorder, color: theme.text }]}
        placeholder="Enter your email"
        placeholderTextColor={theme.placeholder}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TouchableOpacity style={[styles.button, { backgroundColor: theme.card }]} onPress={handleLogin}>
        <Text style={[styles.buttonText, { color: theme.text }]}>Log In</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, { backgroundColor: theme.card }]} onPress={continueAsGuest}>
        <Text style={[styles.buttonText, { color: theme.text }]}>Continue as Guest</Text>
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
