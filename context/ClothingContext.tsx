import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { db } from '../firebase/firebaseConfig';
import { useAuth } from './AuthContext';

type ClothingItem = {
  uri: string;
  description: string;
};

type ClothingContextType = {
  items: ClothingItem[];
  addItem: (item: ClothingItem) => void;
  removeItem: (index: number) => void;
  updateItem: (index: number, updatedItem: ClothingItem) => void;
};

const ClothingContext = createContext<ClothingContextType | undefined>(undefined);

export const ClothingProvider = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, isUserReady, user } = useAuth();
  const [items, setItems] = useState<ClothingItem[]>([]);
  const STORAGE_KEY = '@guest_clothing_items';

  useEffect(() => {
    const loadItems = async () => {
      if (!isUserReady) return;

      if (isAuthenticated && user?.id) {
        try {
          const docRef = doc(db, 'clothing', user.id);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            console.log('✅ Clothing loaded from Firestore:', data.items);
            setItems(data.items || []);
          } else {
            console.log('ℹ️ No clothing data found for user.');
            setItems([]);
          }
        } catch (err) {
          console.error('❌ Failed to load clothing from Firestore:', err);
        }
      } else {
        try {
          const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
          const savedItems = jsonValue != null ? JSON.parse(jsonValue) : [];
          console.log('👕 Loaded guest clothing from AsyncStorage:', savedItems);
          setItems(savedItems);
        } catch (err) {
          console.error('❌ Failed to load guest clothing:', err);
        }
      }
    };

    loadItems();
  }, [isUserReady, isAuthenticated]);

  useEffect(() => {
    const clearGuestData = async () => {
      if (isUserReady && isAuthenticated) {
        await AsyncStorage.removeItem(STORAGE_KEY);
        console.log('🧼 Guest clothing cleared after login');
      }
    };
    clearGuestData();
  }, [isAuthenticated, isUserReady]);

  const saveItemsToFirestore = async (newItems: ClothingItem[]) => {
    if (isAuthenticated && user?.id) {
      try {
        const docRef = doc(db, 'clothing', user.id);
        await setDoc(docRef, { items: newItems });
        console.log('✅ Clothing saved to Firestore:', newItems);
      } catch (err) {
        console.error('❌ Failed to save clothing to Firestore:', err);
      }
    }
  };

  const saveItemsToStorage = async (newItems: ClothingItem[]) => {
    if (!isAuthenticated) {
      try {
        const jsonValue = JSON.stringify(newItems);
        await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
        console.log('💾 Clothing saved to AsyncStorage:', newItems);
      } catch (err) {
        console.error('❌ Failed to save clothing to AsyncStorage:', err);
      }
    }
  };

  const updateStateAndPersist = (newItems: ClothingItem[]) => {
    setItems(newItems);
    if (isAuthenticated) {
      saveItemsToFirestore(newItems);
    } else {
      saveItemsToStorage(newItems);
    }
  };

  const addItem = (item: ClothingItem) => {
    const newItems = [...items, item];
    updateStateAndPersist(newItems);
  };

  const removeItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    updateStateAndPersist(newItems);
  };

  const updateItem = (index: number, updatedItem: ClothingItem) => {
    const newItems = [...items];
    newItems[index] = updatedItem;
    updateStateAndPersist(newItems);
  };

  return (
    <ClothingContext.Provider value={{ items, addItem, removeItem, updateItem }}>
      {children}
    </ClothingContext.Provider>
  );
};

export const useClothing = (): ClothingContextType => {
  const context = useContext(ClothingContext);
  if (!context) throw new Error('useClothing must be used within a ClothingProvider');
  return context;
};

