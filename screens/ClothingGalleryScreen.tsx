import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useClothing } from '../context/ClothingContext';
import { useTheme } from '../context/ThemeContext';

const ClothingGalleryScreen = () => {
  const { items } = useClothing();
  const [isGridView, setIsGridView] = useState(false);
  const { theme } = useTheme(); // ⬅️ removed toggleTheme

  const toggleView = () => setIsGridView((prev) => !prev);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>Clothing Gallery</Text>

      <TouchableOpacity
        onPress={toggleView}
        style={[styles.button, { backgroundColor: theme.card }]}
      >
        <Text style={[styles.buttonText, { color: theme.text }]}>
          {isGridView ? 'Switch to List View' : 'Switch to Grid View'}
        </Text>
      </TouchableOpacity>

      {items.length === 0 ? (
        <Text style={[styles.emptyText, { color: theme.inputBorder }]}>
          No clothing items saved yet.
        </Text>
      ) : (
        <FlatList
          data={items}
          key={isGridView ? 'grid' : 'list'}
          numColumns={isGridView ? 2 : 1}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={isGridView ? styles.gridItem : styles.item}>
              {item.uri ? <Image source={{ uri: item.uri }} style={styles.image} /> : null}
              <Text style={[styles.description, { color: theme.text }]}>
                {item.description}
              </Text>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
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
  toggleWrapper: {
    marginBottom: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 40,
  },
  item: {
    marginBottom: 20,
    alignItems: 'center',
  },
  gridItem: {
    flex: 1,
    margin: 10,
    alignItems: 'center',
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 10,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    textAlign: 'center',
  },
});

export default ClothingGalleryScreen;

