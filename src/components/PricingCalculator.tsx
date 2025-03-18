
import React from 'react';
import { useCost } from '../context/CostContext';
import { formatCurrency, exportToExcel } from '../utils/calculationUtils';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FileSpreadsheet, ArrowRight } from 'lucide-react';
import { toast } from "sonner";

const PricingCalculator: React.FC = () => {
  const {
    ingredients,
    extraCosts,
    profitMargin,
    eggQuantity,
    setProfitMargin,
    setEggQuantity,
    getTotalIngredientCost,
    getTotalExtraCost,
    getTotalCostPerEgg,
    getSuggestedPrice,
  } = useCost();

  const ingredientCost = getTotalIngredientCost();
  const extraCost = getTotalExtraCost();
  const totalCost = getTotalCostPerEgg();
  const suggestedPrice = getSuggestedPrice();

  const handleProfitMarginChange = (value: number[]) => {
    setProfitMargin(value[0]);
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      setEggQuantity(value);
    }
  };

  const handleExport = () => {
    try {
      exportToExcel(
        ingredients,
        extraCosts,
        eggQuantity,
        profitMargin,
        totalCost,
        suggestedPrice
      );
      toast.success('Planilha exportada com sucesso!');
    } catch (error) {
      toast.error('Erro ao exportar planilha');
      console.error(error);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
      <Card className="p-6 md:col-span-8 animate-scale-in">
        <h3 className="text-lg font-display font-medium mb-4">Cálculo de Preço</h3>
        
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="egg-quantity">Quantidade de Ovos</Label>
              <Input
                id="egg-quantity"
                type="number"
                min="1"
                value={eggQuantity}
                onChange={handleQuantityChange}
                className="w-20 text-right"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="profit-margin">Margem de Lucro</Label>
                <span className="font-medium">{profitMargin}%</span>
              </div>
              <Slider
                id="profit-margin"
                min={0}
                max={100}
                step={1}
                defaultValue={[profitMargin]}
                value={[profitMargin]}
                onValueChange={handleProfitMarginChange}
                className="my-4"
              />
            </div>
          </div>
          
          <div className="bg-muted/30 rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-sm">Custo de Ingredientes:</span>
              <span className="font-medium">{formatCurrency(ingredientCost)}</span>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-sm">Custos Extras:</span>
              <span className="font-medium">{formatCurrency(extraCost)}</span>
            </div>
            <div className="flex justify-between items-center pt-1">
              <span className="text-sm font-medium">Custo Total por Ovo:</span>
              <span className="font-bold">{formatCurrency(totalCost)}</span>
            </div>
          </div>
          
          <div className="flex justify-between items-center bg-primary/10 rounded-lg p-4">
            <div>
              <span className="text-sm text-primary-foreground/70">Preço de Venda Sugerido</span>
              <div className="text-2xl font-display font-semibold text-primary-foreground">
                {formatCurrency(suggestedPrice)}
              </div>
            </div>
            <ArrowRight className="h-6 w-6 text-primary-foreground/50" />
          </div>
          
          <Button 
            variant="outline" 
            className="w-full"
            onClick={handleExport}
          >
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            Exportar para Excel
          </Button>
        </div>
      </Card>
      
      <Card className="p-6 md:col-span-4 animate-scale-in flex flex-col">
        <h3 className="text-lg font-display font-medium mb-4">Custos e Lucros</h3>
        
        <div className="flex-1 flex flex-col justify-center space-y-6">
          <PriceStat 
            label="Custo Total"
            value={formatCurrency(totalCost)}
            percent={100}
            bgColor="bg-muted"
          />
          
          <PriceStat 
            label="Margem de Lucro"
            value={formatCurrency(suggestedPrice - totalCost)}
            percent={profitMargin}
            bgColor="bg-primary/20"
          />
          
          <PriceStat 
            label="Preço de Venda"
            value={formatCurrency(suggestedPrice)}
            percent={100}
            bgColor="bg-primary/10"
            isTotal
          />
        </div>
      </Card>
    </div>
  );
};

interface PriceStatProps {
  label: string;
  value: string;
  percent: number;
  bgColor: string;
  isTotal?: boolean;
}

const PriceStat: React.FC<PriceStatProps> = ({ 
  label, 
  value, 
  percent, 
  bgColor,
  isTotal 
}) => {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm">{label}</span>
        <span className={`font-medium ${isTotal ? 'text-lg' : ''}`}>{value}</span>
      </div>
      <div className="h-2 w-full bg-muted/30 rounded-full overflow-hidden">
        <div 
          className={`h-full ${bgColor} rounded-full`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
};

export default PricingCalculator;
