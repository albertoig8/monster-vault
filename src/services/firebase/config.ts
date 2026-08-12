import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';

// Configuração do Firebase
// NOTA: Adicione suas credenciais do Firebase aqui
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar Firebase Authentication
export const auth = getAuth(app);

// Inicializar Firestore
export const db = getFirestore(app);

// Conectar ao emulador em desenvolvimento (se disponível)
if (import.meta.env.DEV && typeof window !== 'undefined') {
  try {
    // Tenta conectar ao emulador Firestore
    connectFirestoreEmulator(db, 'localhost', 8080);
    console.log('✅ Conectado ao Firestore Emulator (porta 8080)');
  } catch (error) {
    // Emulador não está rodando, usa produção
    if (error instanceof Error && error.message.includes('already connected')) {
      console.log('✅ Firestore Emulator já conectado');
    } else {
      console.log('⚠️  Firestore Emulator não disponível, usando produção');
    }
  }

  try {
    // Tenta conectar ao emulador Auth
    connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
    console.log('✅ Conectado ao Auth Emulator (porta 9099)');
  } catch (error) {
    // Emulador não está rodando, usa produção
    if (error instanceof Error && error.message.includes('already connected')) {
      console.log('✅ Auth Emulator já conectado');
    } else {
      console.log('⚠️  Auth Emulator não disponível, usando produção');
    }
  }
}

export default app;
