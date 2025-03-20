import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs,
  getDoc,
  Timestamp
} from 'firebase/firestore';
import { db } from '../lib/firebase';

interface FirebaseContextType {
  loading: boolean;
  error: string | null;
  addDocument: (collectionName: string, data: any) => Promise<string>;
  updateDocument: (collectionName: string, docId: string, data: any) => Promise<void>;
  deleteDocument: (collectionName: string, docId: string) => Promise<void>;
  getDocuments: (collectionName: string) => Promise<any[]>;
  getDocumentById: (collectionName: string, docId: string) => Promise<any>;
}

const FirebaseContext = createContext<FirebaseContextType | null>(null);

export function FirebaseProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(false);
  }, []);

  const addDocument = async (collectionName: string, data: any) => {
    try {
      console.log(`Tentando adicionar documento em ${collectionName}...`, data);
      const docRef = await addDoc(collection(db, collectionName), {
        ...data,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      console.log('Documento adicionado com sucesso:', docRef.id);
      return docRef.id;
    } catch (err: any) {
      console.error(`Erro ao adicionar documento em ${collectionName}:`, err);
      setError(err.message || 'Erro ao adicionar documento');
      throw err;
    }
  };

  const updateDocument = async (collectionName: string, docId: string, data: any) => {
    try {
      console.log(`Tentando atualizar documento ${docId} em ${collectionName}...`, data);
      const docRef = doc(db, collectionName, docId);
      await updateDoc(docRef, {
        ...data,
        updatedAt: Timestamp.now()
      });
      console.log('Documento atualizado com sucesso');
    } catch (err: any) {
      console.error(`Erro ao atualizar documento ${docId} em ${collectionName}:`, err);
      setError(err.message || 'Erro ao atualizar documento');
      throw err;
    }
  };

  const deleteDocument = async (collectionName: string, docId: string) => {
    try {
      console.log(`Tentando deletar documento ${docId} em ${collectionName}...`);
      const docRef = doc(db, collectionName, docId);
      await deleteDoc(docRef);
      console.log('Documento deletado com sucesso');
    } catch (err: any) {
      console.error(`Erro ao deletar documento ${docId} em ${collectionName}:`, err);
      setError(err.message || 'Erro ao deletar documento');
      throw err;
    }
  };

  const getDocuments = async (collectionName: string) => {
    try {
      console.log(`Tentando buscar documentos de ${collectionName}...`);
      const querySnapshot = await getDocs(collection(db, collectionName));
      const documents = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      console.log(`Documentos encontrados em ${collectionName}:`, documents.length);
      return documents;
    } catch (err: any) {
      console.error(`Erro ao buscar documentos de ${collectionName}:`, err);
      setError(err.message || 'Erro ao buscar documentos');
      throw err;
    }
  };

  const getDocumentById = async (collectionName: string, docId: string) => {
    try {
      console.log(`Tentando buscar documento ${docId} em ${collectionName}...`);
      const docRef = doc(db, collectionName, docId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = {
          id: docSnap.id,
          ...docSnap.data()
        };
        console.log('Documento encontrado:', data);
        return data;
      }
      console.log('Documento não encontrado');
      return null;
    } catch (err: any) {
      console.error(`Erro ao buscar documento ${docId} em ${collectionName}:`, err);
      setError(err.message || 'Erro ao buscar documento');
      throw err;
    }
  };

  const value = {
    loading,
    error,
    addDocument,
    updateDocument,
    deleteDocument,
    getDocuments,
    getDocumentById
  };

  return (
    <FirebaseContext.Provider value={value}>
      {children}
    </FirebaseContext.Provider>
  );
}

export function useFirebase() {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error('useFirebase deve ser usado dentro de um FirebaseProvider');
  }
  return context;
} 