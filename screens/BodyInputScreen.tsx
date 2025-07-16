import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useBodyInfo } from '../context/BodyInfoContext';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext'; // ✅ added

type RootStackParamList = {
  UploadClothing: undefined;
  BodyInput: undefined;
  Login: undefined; // ✅ ensure this is part of navigation
};

const BodyInputScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { bodyInfo, setBodyInfo } = useBodyInfo();
  const { height, weight, fitPreference } = bodyInfo;
  const { theme } = useTheme();
  const { isGuest } = useAuth(); // ✅ added

  const handleSubmit = () => {
    if (!height || !weight) {
      Alert.alert('Missing Info', 'Please enter both height and weight.');
      return;
    }

    Alert.alert('Saved', `Height: ${height} cm\nWeight: ${weight} kg\nFit: ${fitPreference || 'Normal'}`);

    // ✅ Prompt guest to sign up
    if (isGuest) {
      Alert.alert(
        'Want to save your measurements?',
        'Create an account to keep your body info synced and safe.',
        [
          { text: 'Not now', style: 'cancel' },
          { text: 'Create Account', onPress: () => navigation.navigate('Login') },
        ]
      );
    }
  };

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>Your Body Info</Text>

      <Text style={[styles.label, { color: theme.text }]}>Height (cm)</Text>
      <TextInput
        style={[styles.input, { borderColor: theme.inputBorder, color: theme.text }]}
        placeholder="e.g. 180"
        placeholderTextColor={theme.placeholder}
        keyboardType="numeric"
        value={height?.toString() || ''}
        onChangeText={(text) => setBodyInfo({ ...bodyInfo, height: text })}
      />

      <Text style={[styles.label, { color: theme.text }]}>Weight (kg)</Text>
      <TextInput
        style={[styles.input, { borderColor: theme.inputBorder, color: theme.text }]}
        placeholder="e.g. 75"
        placeholderTextColor={theme.placeholder}
        keyboardType="numeric"
        value={weight?.toString() || ''}
        onChangeText={(text) => setBodyInfo({ ...bodyInfo, weight: text })}
      />

      <Text style={[styles.label, { color: theme.text }]}>Fit Preference</Text>
      <TextInput
        style={[styles.input, { borderColor: theme.inputBorder, color: theme.text }]}
        placeholder="loose, tight, normal"
        placeholderTextColor={theme.placeholder}
        value={fitPreference || ''}
        onChangeText={(text) => setBodyInfo({ ...bodyInfo, fitPreference: text })}
      />

      <View style={styles.buttonWrapper}>
        <TouchableOpacity style={[styles.button, { backgroundColor: theme.button }]} onPress={handleSubmit}>
          <Text style={[styles.buttonText, { color: theme.buttonText }]}>Save Info</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.button }]}
          onPress={() => navigation.navigate('UploadClothing')}
        >
          <Text style={[styles.buttonText, { color: theme.buttonText }]}>Back to Upload</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flexGrow: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    marginBottom: 10,
  },
  buttonWrapper: {
    marginTop: 24,
  },
  button: {
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default BodyInputScreen;




