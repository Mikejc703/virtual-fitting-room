import React, { useState } from 'react';
import { LogBox, Alert, View, Text, Image, StyleSheet, PermissionsAndroid, Platform, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { launchImageLibrary, launchCamera, Asset } from 'react-native-image-picker';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { useBodyInfo } from '../context/BodyInfoContext';
import { useClothing } from '../context/ClothingContext';
import { useAuth } from '../context/AuthContext'; // ✅ added
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';

type RootStackParamList = {
  UploadClothing: undefined;
  BodyInput: undefined;
  ClothingGallery: undefined;
  Settings: undefined;
  Login: undefined; // make sure Login is defined
};

LogBox.ignoreLogs(["Text strings must be rendered within a <Text> component"]);

const UploadClothingScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { addItem } = useClothing();
  const { isGuest } = useAuth(); // ✅ added
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [clothingName, setClothingName] = useState<string>('');
  const { bodyInfo } = useBodyInfo();
  const { height, weight, fitPreference } = bodyInfo;

  const handleImagePicked = (assets?: Asset[]) => {
    if (assets && assets.length > 0 && assets[0].uri) {
      setImageUri(assets[0].uri);
    }
  };

  const pickImage = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 1,
        includeBase64: false,
        selectionLimit: 1,
      },
      (response) => {
        if (response.didCancel) return;
        if (response.errorMessage) {
          Alert.alert('Error', response.errorMessage);
          return;
        }
        handleImagePicked(response.assets);
      }
    );
  };

  const requestCameraPermission = async (): Promise<boolean> => {
    if (Platform.OS !== 'android') return true;
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Camera Permission',
          message: 'This app needs access to your camera to take photos.',
          buttonPositive: 'OK',
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  const takePhoto = async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) {
      Alert.alert('Permission denied', 'Camera access is required to take photos.');
      return;
    }

    launchCamera(
      {
        mediaType: 'photo',
        quality: 1,
        includeBase64: false,
        saveToPhotos: true,
      },
      (response) => {
        if (response.didCancel) return;
        if (response.errorMessage) {
          Alert.alert('Error', response.errorMessage);
          return;
        }
        handleImagePicked(response.assets);
      }
    );
  };

  const handleSaveClothing = () => {
    if (!imageUri || !clothingName.trim()) {
      Alert.alert('Missing Info', 'Please add an image and name your clothing item.');
      return;
    }

    addItem({ uri: imageUri, description: clothingName });
    Alert.alert('Saved!', 'Your clothing item was saved.');
    setClothingName('');
    setImageUri(null);
    navigation.navigate('ClothingGallery');

    // ✅ Show prompt to guests
    if (isGuest) {
      Alert.alert(
        'Want to save your closet?',
        'Create an account to keep your outfits and measurements.',
        [
          { text: 'Not now', style: 'cancel' },
          { text: 'Create Account', onPress: () => navigation.navigate('Login') },
        ]
      );
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={[styles.title, { color: theme.text }]}>Upload a Clothing Item</Text>

        <View style={styles.bodyInfoBox}>
          <Text style={[styles.bodyInfoText, { color: theme.text }]}>Height: {height || 'N/A'} cm</Text>
          <Text style={[styles.bodyInfoText, { color: theme.text }]}>Weight: {weight || 'N/A'} kg</Text>
          <Text style={[styles.bodyInfoText, { color: theme.text }]}>Fit: {fitPreference || 'N/A'}</Text>
        </View>

        <TextInput
          style={[styles.input, { borderColor: theme.inputBorder, color: theme.text }]}
          placeholder="Clothing Name or Description"
          placeholderTextColor={theme.placeholder}
          value={clothingName}
          onChangeText={setClothingName}
        />

        <TouchableOpacity style={styles.button} onPress={pickImage}>
          <Text style={styles.buttonText}>Pick an Image</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={takePhoto}>
          <Text style={styles.buttonText}>Take a Photo</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleSaveClothing}>
          <Text style={styles.buttonText}>Save Clothing Item</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('BodyInput')}>
          <Text style={styles.buttonText}>Go to Body Input</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('ClothingGallery')}>
          <Text style={styles.buttonText}>Go to Clothing Gallery</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Settings')}>
          <Text style={styles.buttonText}>Settings</Text>
        </TouchableOpacity>

        {imageUri && <Image source={{ uri: imageUri }} style={styles.preview} />}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    width: '100%',
    marginBottom: 16,
  },
  preview: {
    width: 200,
    height: 200,
    marginTop: 20,
    borderRadius: 10,
  },
  bodyInfoBox: {
    marginBottom: 24,
    alignItems: 'center',
  },
  bodyInfoText: {
    fontSize: 16,
    marginBottom: 4,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default UploadClothingScreen;
