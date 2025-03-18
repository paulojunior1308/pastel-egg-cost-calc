
import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Ingredient {
  id: string;
  name: string;
  unit: string;
  pricePerUnit: number;
  quantityPerEgg: number;
}

export interface ExtraCost {
  id: string;
  name: string;
  cost: number;
  isPerEgg: boolean;
  quantity?: number;
}

interface CostContextType {
  ingredients: Ingredient[];
  extraCosts: ExtraCost[];
  profitMargin: number;
  eggQuantity: number;
  addIngredient: (ingredient: Omit<Ingredient, 'id'>) => void;
  updateIngredient: (id: string, ingredient: Partial<Ingredient>) => void;
  removeIngredient: (id: string) => void;
  addExtraCost: (extraCost: Omit<ExtraCost, 'id'>) => void;
  updateExtraCost: (id: string, extraCost: Partial<ExtraCost>) => void;
  removeExtraCost: (id: string) => void;
  setProfitMargin: (margin: number) => void;
  setEggQuantity: (quantity: number) => void;
  getTotalIngredientCost: () => number;
  getTotalExtraCost: () => number;
  getTotalCostPerEgg: () => number;
  getSuggestedPrice: () => number;
}

const CostContext = createContext<CostContextType | undefined>(undefined);

export const CostProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [extraCosts, setExtraCosts] = useState<ExtraCost[]>([]);
  const [profitMargin, setProfitMargin] = useState<number>(40);
  const [eggQuantity, setEggQuantity] = useState<number>(10);

  const addIngredient = (ingredient: Omit<Ingredient, 'id'>) => {
    const newIngredient = {
      ...ingredient,
      id: `ing-${Date.now()}`,
    };
    setIngredients([...ingredients, newIngredient]);
  };

  const updateIngredient = (id: string, ingredient: Partial<Ingredient>) => {
    setIngredients(
      ingredients.map((ing) => (ing.id === id ? { ...ing, ...ingredient } : ing))
    );
  };

  const removeIngredient = (id: string) => {
    setIngredients(ingredients.filter((ing) => ing.id !== id));
  };

  const addExtraCost = (extraCost: Omit<ExtraCost, 'id'>) => {
    const newExtraCost = {
      ...extraCost,
      id: `extra-${Date.now()}`,
    };
    setExtraCosts([...extraCosts, newExtraCost]);
  };

  const updateExtraCost = (id: string, extraCost: Partial<ExtraCost>) => {
    setExtraCosts(
      extraCosts.map((extra) => (extra.id === id ? { ...extra, ...extraCost } : extra))
    );
  };

  const removeExtraCost = (id: string) => {
    setExtraCosts(extraCosts.filter((extra) => extra.id !== id));
  };

  const getTotalIngredientCost = () => {
    return ingredients.reduce((total, ing) => {
      return total + ing.pricePerUnit * ing.quantityPerEgg;
    }, 0);
  };

  const getTotalExtraCost = () => {
    return extraCosts.reduce((total, extra) => {
      if (extra.isPerEgg) {
        return total + extra.cost;
      } else {
        // For fixed costs, divide by the quantity of eggs
        return total + (extra.cost / eggQuantity);
      }
    }, 0);
  };

  const getTotalCostPerEgg = () => {
    return getTotalIngredientCost() + getTotalExtraCost();
  };

  const getSuggestedPrice = () => {
    const totalCost = getTotalCostPerEgg();
    return totalCost / (1 - profitMargin / 100);
  };

  return (
    <CostContext.Provider
      value={{
        ingredients,
        extraCosts,
        profitMargin,
        eggQuantity,
        addIngredient,
        updateIngredient,
        removeIngredient,
        addExtraCost,
        updateExtraCost,
        removeExtraCost,
        setProfitMargin,
        setEggQuantity,
        getTotalIngredientCost,
        getTotalExtraCost,
        getTotalCostPerEgg,
        getSuggestedPrice,
      }}
    >
      {children}
    </CostContext.Provider>
  );
};

export const useCost = (): CostContextType => {
  const context = useContext(CostContext);
  if (context === undefined) {
    throw new Error('useCost must be used within a CostProvider');
  }
  return context;
};
