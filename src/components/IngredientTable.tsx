import React from 'react';
import { useCost, Ingredient } from '../context/CostContext';
import { formatCurrency } from '../utils/calculationUtils';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, Edit } from 'lucide-react';
import { toast } from "sonner";

const IngredientTable: React.FC = () => {
  const { ingredients, deleteIngredient, loading } = useCost();

  const handleDelete = async (id: string, name: string) => {
    try {
      await deleteIngredient(id);
      toast.success(`Ingrediente "${name}" removido com sucesso!`);
    } catch (error) {
      toast.error('Erro ao remover ingrediente. Tente novamente.');
      console.error('Erro:', error);
    }
  };

  if (loading) {
    return (
      <Card className="p-6 text-center animate-fade-in">
        <p className="text-muted-foreground">
          Carregando ingredientes...
        </p>
      </Card>
    );
  }

  if (ingredients.length === 0) {
    return (
      <Card className="p-6 text-center animate-fade-in">
        <p className="text-muted-foreground">
          Nenhum ingrediente cadastrado. Adicione ingredientes usando o formulário acima.
        </p>
      </Card>
    );
  }

  return (
    <Card className="border animate-fade-in overflow-hidden">
      <div className="relative overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs uppercase bg-muted">
            <tr>
              <th scope="col" className="px-6 py-3">
                Ingrediente
              </th>
              <th scope="col" className="px-6 py-3">
                Preço
              </th>
              <th scope="col" className="px-6 py-3">
                Quantidade
              </th>
              <th scope="col" className="px-6 py-3">
                Custo Total
              </th>
              <th scope="col" className="px-6 py-3">
                Ações
              </th>
            </tr>
          </thead>
          <tbody>
            {ingredients.map((ingredient) => (
              <IngredientRow
                key={ingredient.id}
                ingredient={ingredient}
                onDelete={() => handleDelete(ingredient.id, ingredient.name)}
              />
            ))}
          </tbody>
          <tfoot className="font-medium">
            <tr className="border-t">
              <td colSpan={3} className="px-6 py-3 text-right">
                Custo Total de Ingredientes:
              </td>
              <td className="px-6 py-3 font-bold">
                {formatCurrency(
                  ingredients.reduce(
                    (sum, ingredient) => sum + (ingredient.price * ingredient.quantity),
                    0
                  )
                )}
              </td>
              <td className="px-6 py-3"></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </Card>
  );
};

interface IngredientRowProps {
  ingredient: Ingredient;
  onDelete: () => void;
}

const IngredientRow: React.FC<IngredientRowProps> = ({ ingredient, onDelete }) => {
  const totalCost = ingredient.price * ingredient.quantity;

  return (
    <tr className="bg-white border-b hover:bg-muted/50 transition-colors">
      <td className="px-6 py-4 font-medium">
        {ingredient.name}
      </td>
      <td className="px-6 py-4">
        {formatCurrency(ingredient.price)}/{ingredient.unit}
      </td>
      <td className="px-6 py-4">
        {ingredient.quantity} {ingredient.unit}
      </td>
      <td className="px-6 py-4">
        {formatCurrency(totalCost)}
      </td>
      <td className="px-6 py-4">
        <div className="flex space-x-2">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Edit className="h-4 w-4" />
            <span className="sr-only">Editar</span>
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={onDelete}>
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Remover</span>
          </Button>
        </div>
      </td>
    </tr>
  );
};

export default IngredientTable;
