import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

type BodyInfo = {
  height: string;
  weight: string;
  fitPreference: string;
};

type BodyInfoContextType = {
  bodyInfo: BodyInfo;
  setBodyInfo: (info: BodyInfo) => void;
};

const defaultBodyInfo: BodyInfo = {
  height: '',
  weight: '',
  fitPreference: '',
};

const BodyInfoContext = createContext<BodyInfoContextType>({
  bodyInfo: defaultBodyInfo,
  setBodyInfo: () => {},
});

export const useBodyInfo = () => useContext(BodyInfoContext);

export const BodyInfoProvider = ({ children }: { children: ReactNode }) => {
  const [bodyInfo, setBodyInfoState] = useState<BodyInfo>(defaultBodyInfo);
  const { isAuthenticated, isGuest, user, isUserReady } = useAuth(); // ✅ FIXED

  useEffect(() => {
    const loadBodyInfo = async () => {
      if (!isAuthenticated || isGuest || !user?.id || !isUserReady) return;

      try {
        const docSnap = await getDoc(doc(db, 'bodyInfo', user.id));
        if (docSnap.exists()) {
          setBodyInfoState(docSnap.data() as BodyInfo);
        }
      } catch (err) {
        console.error('❌ Failed to fetch body info:', err);
      }
    };

    loadBodyInfo();
  }, [isAuthenticated, isGuest, isUserReady, user?.id]);

  const setBodyInfo = async (info: BodyInfo) => {
    setBodyInfoState(info);

    if (isAuthenticated && !isGuest && user?.id) {
      try {
        await setDoc(doc(db, 'bodyInfo', user.id), info);
      } catch (err) {
        console.error('❌ Failed to save body info:', err);
      }
    }
  };

  return (
    <BodyInfoContext.Provider value={{ bodyInfo, setBodyInfo }}>
      {children}
    </BodyInfoContext.Provider>
  );
};

