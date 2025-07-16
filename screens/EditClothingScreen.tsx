import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { useClothing } from '../context/ClothingContext';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../context/ThemeContext';

type RootStackParamList = {
  EditClothing: { index: number };
};

type Props = {
  route: RouteProp<RootStackParamList, 'EditClothing'>;
  navigation: NativeStackNavigationProp<RootStackParamList, 'EditClothing'>;
};

const EditClothingScreen = ({ route, navigation }: Props) => {
  const { items, updateItem } = useClothing();
  const { index } = route.params;
  const currentItem = items[index];
  const [description, setDescription] = useState(currentItem?.description || '');

  const { theme } = useTheme(); // ⬅️ removed toggleTheme

  const handleSave = () => {
    if (!description.trim()) {
      Alert.alert('Error', 'Description cannot be empty.');
      return;
    }

    updateItem(index, { ...currentItem, description });
    navigation.goBack();
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.label, { color: theme.text }]}>Edit Description</Text>

      <TextInput
        style={[styles.input, { borderColor: theme.inputBorder, color: theme.text }]}
        placeholder="Enter new description"
        placeholderTextColor={theme.placeholder}
        value={description}
        onChangeText={setDescription}
      />

      <TouchableOpacity onPress={handleSave} style={[styles.button, { backgroundColor: theme.card }]}>
        <Text style={[styles.buttonText, { color: theme.text }]}>Save Changes</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
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

export default EditClothingScreen;
