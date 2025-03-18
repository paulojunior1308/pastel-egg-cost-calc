
import React from 'react';
import { useCost, ExtraCost } from '../context/CostContext';
import { calculateExtraCostPerEgg, formatCurrency } from '../utils/calculationUtils';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, Edit } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from "sonner";

const ExtraCostsTable: React.FC = () => {
  const { extraCosts, eggQuantity, removeExtraCost } = useCost();

  const handleRemove = (id: string, name: string) => {
    removeExtraCost(id);
    toast.success(`Custo extra "${name}" removido com sucesso!`);
  };

  if (extraCosts.length === 0) {
    return (
      <Card className="p-6 text-center animate-fade-in">
        <p className="text-muted-foreground">
          Nenhum custo extra cadastrado. Adicione custos extras usando o formulário acima.
        </p>
      </Card>
    );
  }

  // Calculate total of extra costs per egg
  const totalPerEgg = extraCosts.reduce(
    (sum, extra) => sum + calculateExtraCostPerEgg(extra, eggQuantity),
    0
  );

  return (
    <Card className="border animate-fade-in overflow-hidden">
      <div className="relative overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs uppercase bg-muted">
            <tr>
              <th scope="col" className="px-6 py-3">
                Descrição
              </th>
              <th scope="col" className="px-6 py-3">
                Valor Total
              </th>
              <th scope="col" className="px-6 py-3">
                Tipo
              </th>
              <th scope="col" className="px-6 py-3">
                Custo por Ovo
              </th>
              <th scope="col" className="px-6 py-3">
                Ações
              </th>
            </tr>
          </thead>
          <tbody>
            {extraCosts.map((extraCost) => (
              <ExtraCostRow
                key={extraCost.id}
                extraCost={extraCost}
                eggQuantity={eggQuantity}
                onRemove={() => handleRemove(extraCost.id, extraCost.name)}
              />
            ))}
          </tbody>
          <tfoot className="font-medium">
            <tr className="border-t">
              <td colSpan={3} className="px-6 py-3 text-right">
                Custo Extra Total por Ovo:
              </td>
              <td className="px-6 py-3 font-bold">
                {formatCurrency(totalPerEgg)}
              </td>
              <td className="px-6 py-3"></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </Card>
  );
};

interface ExtraCostRowProps {
  extraCost: ExtraCost;
  eggQuantity: number;
  onRemove: () => void;
}

const ExtraCostRow: React.FC<ExtraCostRowProps> = ({ 
  extraCost, 
  eggQuantity, 
  onRemove 
}) => {
  const costPerEgg = calculateExtraCostPerEgg(extraCost, eggQuantity);

  return (
    <tr className="bg-white border-b hover:bg-muted/50 transition-colors">
      <td className="px-6 py-4 font-medium">
        {extraCost.name}
      </td>
      <td className="px-6 py-4">
        {formatCurrency(extraCost.cost)}
      </td>
      <td className="px-6 py-4">
        {extraCost.isPerEgg ? (
          <Badge variant="secondary" className="bg-primary/20 hover:bg-primary/30">Por Ovo</Badge>
        ) : (
          <Badge variant="outline">Fixo</Badge>
        )}
      </td>
      <td className="px-6 py-4">
        {formatCurrency(costPerEgg)}
      </td>
      <td className="px-6 py-4">
        <div className="flex space-x-2">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Edit className="h-4 w-4" />
            <span className="sr-only">Editar</span>
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={onRemove}>
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Remover</span>
          </Button>
        </div>
      </td>
    </tr>
  );
};

export default ExtraCostsTable;
