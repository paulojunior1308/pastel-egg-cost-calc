
import React, { useState } from 'react';
import { useCost } from '../context/CostContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import { toast } from "sonner";

const units = [
  { value: 'kg', label: 'Quilograma (kg)' },
  { value: 'g', label: 'Grama (g)' },
  { value: 'l', label: 'Litro (l)' },
  { value: 'ml', label: 'Mililitro (ml)' },
  { value: 'un', label: 'Unidade (un)' },
  { value: 'cx', label: 'Caixa (cx)' },
];

const IngredientForm: React.FC = () => {
  const { addIngredient } = useCost();
  const [name, setName] = useState('');
  const [unit, setUnit] = useState('g');
  const [pricePerUnit, setPricePerUnit] = useState<number | ''>('');
  const [quantityPerEgg, setQuantityPerEgg] = useState<number | ''>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !unit || pricePerUnit === '' || quantityPerEgg === '') {
      toast.error('Preencha todos os campos!');
      return;
    }

    addIngredient({
      name,
      unit,
      pricePerUnit: Number(pricePerUnit),
      quantityPerEgg: Number(quantityPerEgg),
    });

    toast.success('Ingrediente adicionado com sucesso!');

    // Reset form
    setName('');
    setUnit('g');
    setPricePerUnit('');
    setQuantityPerEgg('');
  };

  return (
    <Card className="p-6 animate-scale-in">
      <div className="mb-4">
        <h3 className="text-lg font-display font-medium">Adicionar Ingrediente</h3>
        <p className="text-sm text-muted-foreground">
          Cadastre os ingredientes usados na produção dos ovos de Páscoa.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-input-container">
            <Label htmlFor="ingredient-name">Nome do Ingrediente</Label>
            <Input
              id="ingredient-name"
              placeholder="Ex: Chocolate ao leite"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full"
            />
          </div>

          <div className="form-input-container">
            <Label htmlFor="ingredient-unit">Unidade de Medida</Label>
            <Select value={unit} onValueChange={setUnit}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma unidade" />
              </SelectTrigger>
              <SelectContent>
                {units.map((unit) => (
                  <SelectItem key={unit.value} value={unit.value}>
                    {unit.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="form-input-container">
            <Label htmlFor="price-per-unit">Preço por Unidade (R$)</Label>
            <Input
              id="price-per-unit"
              type="number"
              step="0.01"
              min="0"
              placeholder="Ex: 25.00"
              value={pricePerUnit}
              onChange={(e) => setPricePerUnit(e.target.value ? Number(e.target.value) : '')}
              className="w-full"
            />
          </div>

          <div className="form-input-container">
            <Label htmlFor="quantity-per-egg">Quantidade por Ovo</Label>
            <Input
              id="quantity-per-egg"
              type="number"
              step="0.01"
              min="0"
              placeholder={`Ex: 0.2 ${unit}`}
              value={quantityPerEgg}
              onChange={(e) => setQuantityPerEgg(e.target.value ? Number(e.target.value) : '')}
              className="w-full"
            />
          </div>
        </div>

        <Button type="submit" className="w-full">
          <Plus className="mr-2 h-4 w-4" /> Adicionar Ingrediente
        </Button>
      </form>
    </Card>
  );
};

export default IngredientForm;
