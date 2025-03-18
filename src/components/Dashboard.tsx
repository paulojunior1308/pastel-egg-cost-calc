
import React from 'react';
import { useCost } from '../context/CostContext';
import { formatCurrency } from '../utils/calculationUtils';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ArrowRight,
  CakeSlice,
  DollarSign,
  Package,
  BarChart2, 
  TrendingUp
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const {
    ingredients,
    extraCosts,
    getTotalIngredientCost,
    getTotalExtraCost,
    getTotalCostPerEgg,
    getSuggestedPrice,
    profitMargin,
  } = useCost();

  const ingredientCost = getTotalIngredientCost();
  const extraCost = getTotalExtraCost();
  const totalCost = getTotalCostPerEgg();
  const suggestedPrice = getSuggestedPrice();
  const profit = suggestedPrice - totalCost;

  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-3xl font-display font-medium text-center md:text-left">
        Bem-vindo ao <span className="text-primary-foreground">CustoOvo</span>
      </h2>
      <p className="text-muted-foreground text-center md:text-left mb-6">
        Gerencie os custos e calcule o preço ideal para seus ovos de Páscoa.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardCard
          title="Ingredientes"
          value={ingredients.length.toString()}
          description="ingredientes cadastrados"
          icon={<CakeSlice className="h-5 w-5" />}
          to="/ingredients"
        />
        
        <DashboardCard
          title="Custos Extras"
          value={extraCosts.length.toString()}
          description="custos cadastrados"
          icon={<Package className="h-5 w-5" />}
          to="/extra-costs"
        />
        
        <DashboardCard
          title="Custo por Ovo"
          value={formatCurrency(totalCost)}
          description="custo de produção"
          icon={<BarChart2 className="h-5 w-5" />}
          to="/pricing"
        />
        
        <DashboardCard
          title="Preço Sugerido"
          value={formatCurrency(suggestedPrice)}
          description={`com ${profitMargin}% de margem`}
          icon={<DollarSign className="h-5 w-5" />}
          to="/pricing"
          highlighted
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <Card className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-display font-medium">Composição de Custos</h3>
            <TrendingUp className="h-5 w-5 text-muted-foreground" />
          </div>
          
          {totalCost > 0 ? (
            <div className="space-y-4">
              <CostBar 
                label="Ingredientes" 
                value={ingredientCost} 
                total={totalCost} 
                color="bg-primary/70" 
              />
              
              <CostBar 
                label="Custos Extras" 
                value={extraCost} 
                total={totalCost} 
                color="bg-primary/40" 
              />
              
              <div className="mt-6 pt-4 border-t">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Custo Total</span>
                  <span className="font-bold">{formatCurrency(totalCost)}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              <p>Adicione ingredientes e custos extras para visualizar a composição.</p>
              <div className="flex justify-center gap-4 mt-4">
                <Button variant="outline" size="sm" asChild>
                  <Link to="/ingredients">Adicionar Ingredientes</Link>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/extra-costs">Adicionar Custos Extras</Link>
                </Button>
              </div>
            </div>
          )}
        </Card>
        
        <Card className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-display font-medium">Preço Sugerido</h3>
            <DollarSign className="h-5 w-5 text-muted-foreground" />
          </div>
          
          {totalCost > 0 ? (
            <div className="space-y-4">
              <CostBar 
                label="Custo Total" 
                value={totalCost} 
                total={suggestedPrice} 
                color="bg-muted" 
              />
              
              <CostBar 
                label="Lucro" 
                value={profit} 
                total={suggestedPrice} 
                color="bg-primary/30" 
              />
              
              <div className="mt-6 pt-4 border-t">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Preço de Venda</span>
                  <span className="font-bold">{formatCurrency(suggestedPrice)}</span>
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  Margem de lucro de {profitMargin}%
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              <p>Calcule o preço sugerido adicionando os custos de produção.</p>
              <Button className="mt-4" asChild>
                <Link to="/pricing">Calcular Preço</Link>
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

interface DashboardCardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  to: string;
  highlighted?: boolean;
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  value,
  description,
  icon,
  to,
  highlighted = false,
}) => {
  return (
    <Card className={`p-6 transition-all hover:shadow-md ${
      highlighted ? 'bg-primary/10 border-primary/20' : ''
    }`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h3 className="text-2xl font-display font-semibold mt-1">{value}</h3>
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        </div>
        <div className={`p-2 rounded-full ${
          highlighted ? 'bg-primary/20' : 'bg-muted'
        }`}>
          {icon}
        </div>
      </div>
      <Button 
        variant="ghost" 
        size="sm" 
        className="w-full mt-4 justify-between"
        asChild
      >
        <Link to={to}>
          Ver detalhes
          <ArrowRight className="h-4 w-4 ml-2" />
        </Link>
      </Button>
    </Card>
  );
};

interface CostBarProps {
  label: string;
  value: number;
  total: number;
  color: string;
}

const CostBar: React.FC<CostBarProps> = ({ label, value, total, color }) => {
  const percentage = (value / total) * 100;
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span>{label}</span>
        <div className="flex items-center space-x-2">
          <span>{formatCurrency(value)}</span>
          <span className="text-xs text-muted-foreground">({percentage.toFixed(0)}%)</span>
        </div>
      </div>
      <div className="h-2 w-full bg-muted/30 rounded-full overflow-hidden">
        <div 
          className={`h-full ${color} rounded-full`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default Dashboard;
