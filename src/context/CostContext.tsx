import React, { createContext, useContext, useState, useEffect } from 'react';
import { useFirebase } from './FirebaseContext';

export interface Ingredient {
  id: string;
  name: string;
  price: number;
  unit: string;
  quantity: number;
}

export interface ExtraCost {
  id: string;
  name: string;
  cost: number;
  description: string;
}

interface CostContextType {
  ingredients: Ingredient[];
  extraCosts: ExtraCost[];
  profitMargin: number;
  eggQuantity: number;
  addIngredient: (ingredient: Omit<Ingredient, 'id'>) => Promise<void>;
  updateIngredient: (id: string, ingredient: Partial<Ingredient>) => Promise<void>;
  deleteIngredient: (id: string) => Promise<void>;
  addExtraCost: (extraCost: Omit<ExtraCost, 'id'>) => Promise<void>;
  updateExtraCost: (id: string, extraCost: Partial<ExtraCost>) => Promise<void>;
  deleteExtraCost: (id: string) => Promise<void>;
  setProfitMargin: (margin: number) => void;
  setEggQuantity: (quantity: number) => void;
  getTotalIngredientCost: () => number;
  getTotalExtraCost: () => number;
  getTotalCostPerEgg: () => number;
  getSuggestedPrice: () => number;
  loading: boolean;
}

const CostContext = createContext<CostContextType | null>(null);

export function CostProvider({ children }: { children: React.ReactNode }) {
  const { addDocument, updateDocument, deleteDocument, getDocuments } = useFirebase();
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [extraCosts, setExtraCosts] = useState<ExtraCost[]>([]);
  const [profitMargin, setProfitMargin] = useState<number>(40);
  const [eggQuantity, setEggQuantity] = useState<number>(10);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [ingredientsData, extraCostsData] = await Promise.all([
        getDocuments('ingredients'),
        getDocuments('extraCosts')
      ]);
      
      setIngredients(ingredientsData);
      setExtraCosts(extraCostsData);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const addIngredient = async (ingredient: Omit<Ingredient, 'id'>) => {
    try {
      const id = await addDocument('ingredients', ingredient);
      setIngredients(prev => [...prev, { ...ingredient, id }]);
    } catch (error) {
      console.error('Erro ao adicionar ingrediente:', error);
      throw error;
    }
  };

  const updateIngredient = async (id: string, ingredient: Partial<Ingredient>) => {
    try {
      await updateDocument('ingredients', id, ingredient);
      setIngredients(prev => prev.map(item => 
        item.id === id ? { ...item, ...ingredient } : item
      ));
    } catch (error) {
      console.error('Erro ao atualizar ingrediente:', error);
      throw error;
    }
  };

  const deleteIngredient = async (id: string) => {
    try {
      await deleteDocument('ingredients', id);
      setIngredients(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      console.error('Erro ao deletar ingrediente:', error);
      throw error;
    }
  };

  const addExtraCost = async (extraCost: Omit<ExtraCost, 'id'>) => {
    try {
      const id = await addDocument('extraCosts', extraCost);
      setExtraCosts(prev => [...prev, { ...extraCost, id }]);
    } catch (error) {
      console.error('Erro ao adicionar custo extra:', error);
      throw error;
    }
  };

  const updateExtraCost = async (id: string, extraCost: Partial<ExtraCost>) => {
    try {
      await updateDocument('extraCosts', id, extraCost);
      setExtraCosts(prev => prev.map(item => 
        item.id === id ? { ...item, ...extraCost } : item
      ));
    } catch (error) {
      console.error('Erro ao atualizar custo extra:', error);
      throw error;
    }
  };

  const deleteExtraCost = async (id: string) => {
    try {
      await deleteDocument('extraCosts', id);
      setExtraCosts(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      console.error('Erro ao deletar custo extra:', error);
      throw error;
    }
  };

  const getTotalIngredientCost = () => {
    return ingredients.reduce((total, ingredient) => {
      return total + (ingredient.price * ingredient.quantity);
    }, 0);
  };

  const getTotalExtraCost = () => {
    return extraCosts.reduce((total, extraCost) => {
      return total + extraCost.cost;
    }, 0);
  };

  const getTotalCostPerEgg = () => {
    const totalIngredientCost = getTotalIngredientCost();
    const totalExtraCost = getTotalExtraCost();
    return (totalIngredientCost + totalExtraCost) / eggQuantity;
  };

  const getSuggestedPrice = () => {
    const totalCost = getTotalCostPerEgg();
    return totalCost / (1 - profitMargin / 100);
  };

  return (
    <CostContext.Provider value={{
      ingredients,
      extraCosts,
      profitMargin,
      eggQuantity,
      addIngredient,
      updateIngredient,
      deleteIngredient,
      addExtraCost,
      updateExtraCost,
      deleteExtraCost,
      setProfitMargin,
      setEggQuantity,
      getTotalIngredientCost,
      getTotalExtraCost,
      getTotalCostPerEgg,
      getSuggestedPrice,
      loading
    }}>
      {children}
    </CostContext.Provider>
  );
}

export function useCost() {
  const context = useContext(CostContext);
  if (!context) {
    throw new Error('useCost deve ser usado dentro de um CostProvider');
  }
  return context;
}
