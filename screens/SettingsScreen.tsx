import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';

const SettingsScreen = () => {
  const { theme, isDarkMode, toggleTheme } = useTheme();
  const { logout } = useAuth();
  const navigation = useNavigation();

  const handleLogout = () => {
    logout();
    // Optional: navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>Settings</Text>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.card }]}
        onPress={toggleTheme}
      >
        <Text style={[styles.buttonText, { color: theme.text }]}>
          Switch to {isDarkMode ? 'Light' : 'Dark'} Mode
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.card }]}
        onPress={handleLogout}
      >
        <Text style={[styles.buttonText, { color: theme.text }]}>Log Out</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.card }]}
        onPress={() => navigation.goBack()}
      >
        <Text style={[styles.buttonText, { color: theme.text }]}>Go Back</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginBottom: 30,
  },
  button: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
    elevation: 2,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
  },
});


