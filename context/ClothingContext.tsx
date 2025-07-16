import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
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
  const { isAuthenticated, user, isUserReady } = useAuth();
  const [items, setItems] = useState<ClothingItem[]>([]);

  // Load clothing items on mount or when user becomes ready
  useEffect(() => {
    const loadItems = async () => {
      if (!isAuthenticated || !user?.id || !isUserReady) {
        console.log('⏳ Skipping clothing load: user not ready or not authenticated.');
        return;
      }

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
        console.error('❌ Failed to load clothing:', err);
      }
    };

    loadItems();
  }, [isUserReady]);

  const saveItemsToFirestore = async (newItems: ClothingItem[]) => {
    if (isAuthenticated && user?.id) {
      try {
        const docRef = doc(db, 'clothing', user.id);
        await setDoc(docRef, { items: newItems });
        console.log('✅ Clothing saved to Firestore:', newItems);
      } catch (err) {
        console.error('❌ Failed to save clothing:', err);
      }
    } else {
      console.log('⚠️ Not saving to Firestore: user not authenticated.');
    }
  };

  const addItem = (item: ClothingItem) => {
    const newItems = [...items, item];
    setItems(newItems);
    saveItemsToFirestore(newItems);
  };

  const removeItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
    saveItemsToFirestore(newItems);
  };

  const updateItem = (index: number, updatedItem: ClothingItem) => {
    const newItems = [...items];
    newItems[index] = updatedItem;
    setItems(newItems);
    saveItemsToFirestore(newItems);
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
