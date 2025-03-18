
import { Ingredient, ExtraCost } from "../context/CostContext";

export const calculateIngredientCost = (ingredient: Ingredient): number => {
  return ingredient.pricePerUnit * ingredient.quantityPerEgg;
};

export const calculateTotalIngredientCost = (ingredients: Ingredient[]): number => {
  return ingredients.reduce((total, ingredient) => {
    return total + calculateIngredientCost(ingredient);
  }, 0);
};

export const calculateExtraCostPerEgg = (extraCost: ExtraCost, eggQuantity: number): number => {
  if (extraCost.isPerEgg) {
    return extraCost.cost;
  } else {
    return extraCost.cost / eggQuantity;
  }
};

export const calculateTotalExtraCostPerEgg = (extraCosts: ExtraCost[], eggQuantity: number): number => {
  return extraCosts.reduce((total, extraCost) => {
    return total + calculateExtraCostPerEgg(extraCost, eggQuantity);
  }, 0);
};

export const calculateTotalCostPerEgg = (
  ingredients: Ingredient[],
  extraCosts: ExtraCost[],
  eggQuantity: number
): number => {
  const ingredientCost = calculateTotalIngredientCost(ingredients);
  const extraCostsPerEgg = calculateTotalExtraCostPerEgg(extraCosts, eggQuantity);
  return ingredientCost + extraCostsPerEgg;
};

export const calculateSuggestedPrice = (
  totalCost: number,
  profitMargin: number
): number => {
  // If profitMargin is 40%, then we divide by (1 - 0.4) = 0.6
  return totalCost / (1 - profitMargin / 100);
};

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

export const exportToExcel = (
  ingredients: Ingredient[],
  extraCosts: ExtraCost[],
  eggQuantity: number,
  profitMargin: number,
  totalCost: number,
  suggestedPrice: number
) => {
  // This would connect to a library like xlsx to generate a spreadsheet
  // For now, we'll use a simple CSV export
  
  let csv = 'Relatório de Custos e Preços - Ovos de Páscoa\n\n';
  
  // Ingredients section
  csv += 'INGREDIENTES\n';
  csv += 'Nome,Unidade,Preço por Unidade,Quantidade por Ovo,Custo por Ovo\n';
  
  ingredients.forEach(ing => {
    csv += `${ing.name},${ing.unit},${ing.pricePerUnit},${ing.quantityPerEgg},${calculateIngredientCost(ing)}\n`;
  });
  
  csv += `\nTotal de Ingredientes,,,${calculateTotalIngredientCost(ingredients)}\n\n`;
  
  // Extra costs section
  csv += 'CUSTOS EXTRAS\n';
  csv += 'Descrição,Custo Total,Por Ovo,Custo por Ovo\n';
  
  extraCosts.forEach(extra => {
    csv += `${extra.name},${extra.cost},${extra.isPerEgg ? 'Sim' : 'Não'},${calculateExtraCostPerEgg(extra, eggQuantity)}\n`;
  });
  
  csv += `\nTotal de Custos Extras,,,${calculateTotalExtraCostPerEgg(extraCosts, eggQuantity)}\n\n`;
  
  // Summary section
  csv += 'RESUMO\n';
  csv += `Quantidade de Ovos,${eggQuantity}\n`;
  csv += `Custo Total por Ovo,${totalCost}\n`;
  csv += `Margem de Lucro,${profitMargin}%\n`;
  csv += `Preço de Venda Sugerido,${suggestedPrice}\n`;
  
  // Create and trigger download
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', 'relatorio_ovos_pascoa.csv');
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
