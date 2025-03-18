
import React, { useState } from 'react';
import { useCost } from '../context/CostContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import { toast } from "sonner";

const ExtraCostsForm: React.FC = () => {
  const { addExtraCost } = useCost();
  const [name, setName] = useState('');
  const [cost, setCost] = useState<number | ''>('');
  const [isPerEgg, setIsPerEgg] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || cost === '') {
      toast.error('Preencha todos os campos!');
      return;
    }

    addExtraCost({
      name,
      cost: Number(cost),
      isPerEgg,
    });

    toast.success('Custo extra adicionado com sucesso!');

    // Reset form
    setName('');
    setCost('');
    setIsPerEgg(false);
  };

  return (
    <Card className="p-6 animate-scale-in">
      <div className="mb-4">
        <h3 className="text-lg font-display font-medium">Adicionar Custo Extra</h3>
        <p className="text-sm text-muted-foreground">
          Cadastre os custos extras como embalagem, gás, energia, mão de obra, etc.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-input-container">
            <Label htmlFor="extra-cost-name">Descrição</Label>
            <Input
              id="extra-cost-name"
              placeholder="Ex: Embalagem"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full"
            />
          </div>

          <div className="form-input-container">
            <Label htmlFor="extra-cost-amount">Valor (R$)</Label>
            <Input
              id="extra-cost-amount"
              type="number"
              step="0.01"
              min="0"
              placeholder="Ex: 5.00"
              value={cost}
              onChange={(e) => setCost(e.target.value ? Number(e.target.value) : '')}
              className="w-full"
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="is-per-egg"
            checked={isPerEgg}
            onCheckedChange={setIsPerEgg}
          />
          <Label htmlFor="is-per-egg" className="cursor-pointer">
            Este custo é por ovo (em vez de ser um custo fixo que será dividido entre todos os ovos)
          </Label>
        </div>

        <Button type="submit" className="w-full">
          <Plus className="mr-2 h-4 w-4" /> Adicionar Custo Extra
        </Button>
      </form>
    </Card>
  );
};

export default ExtraCostsForm;
