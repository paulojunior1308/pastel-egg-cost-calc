import * as XLSX from 'xlsx';
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
  // Criar workbook
  const wb = XLSX.utils.book_new();

  // Dados dos Ingredientes
  const ingredientsData = [
    ['INGREDIENTES'],
    ['Nome', 'Unidade', 'Preço', 'Quantidade', 'Custo Total'],
    ...ingredients.map(ing => [
      ing.name,
      ing.unit,
      formatCurrency(ing.price),
      ing.quantity,
      formatCurrency(ing.price * ing.quantity)
    ]),
    ['', '', '', 'Total', formatCurrency(calculateTotalIngredientCost(ingredients))]
  ];

  // Dados dos Custos Extras
  const extraCostsData = [
    ['CUSTOS EXTRAS'],
    ['Descrição', 'Custo Total'],
    ...extraCosts.map(extra => [
      extra.name,
      formatCurrency(extra.cost)
    ]),
    ['', 'Total', formatCurrency(calculateTotalExtraCostPerEgg(extraCosts, eggQuantity))]
  ];

  // Dados do Resumo
  const summaryData = [
    ['RESUMO'],
    ['Quantidade de Ovos', eggQuantity],
    ['Custo Total por Ovo', formatCurrency(totalCost)],
    ['Margem de Lucro', `${profitMargin}%`],
    ['Preço de Venda Sugerido', formatCurrency(suggestedPrice)]
  ];

  // Criar worksheets
  const ingredientsWs = XLSX.utils.aoa_to_sheet(ingredientsData);
  const extraCostsWs = XLSX.utils.aoa_to_sheet(extraCostsData);
  const summaryWs = XLSX.utils.aoa_to_sheet(summaryData);

  // Configurar largura das colunas
  ingredientsWs['!cols'] = [
    { wch: 30 }, // Nome
    { wch: 15 }, // Unidade
    { wch: 15 }, // Preço
    { wch: 15 }, // Quantidade
    { wch: 15 }  // Custo Total
  ];

  extraCostsWs['!cols'] = [
    { wch: 30 }, // Descrição
    { wch: 15 }  // Custo Total
  ];

  summaryWs['!cols'] = [
    { wch: 30 }, // Descrição
    { wch: 15 }  // Valor
  ];

  // Adicionar worksheets ao workbook
  XLSX.utils.book_append_sheet(wb, ingredientsWs, 'Ingredientes');
  XLSX.utils.book_append_sheet(wb, extraCostsWs, 'Custos Extras');
  XLSX.utils.book_append_sheet(wb, summaryWs, 'Resumo');

  // Gerar arquivo
  XLSX.writeFile(wb, 'relatorio_ovos_pascoa.xlsx');
};
