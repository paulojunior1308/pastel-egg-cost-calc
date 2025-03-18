
import React from 'react';
import Navbar from '../components/Navbar';
import ExtraCostsForm from '../components/ExtraCostsForm';
import ExtraCostsTable from '../components/ExtraCostsTable';
import { CostProvider } from '../context/CostContext';

const ExtraCosts: React.FC = () => {
  return (
    <CostProvider>
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="flex-1 container py-8 px-4 md:px-6">
          <div className="page-transition">
            <h1 className="text-3xl font-display font-medium mb-2">Custos Extras</h1>
            <p className="text-muted-foreground mb-6">
              Cadastre e gerencie os custos extras de produção.
            </p>

            <div className="space-y-6">
              <ExtraCostsForm />
              <ExtraCostsTable />
            </div>
          </div>
        </main>
        <footer className="border-t py-6">
          <div className="container text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} CustoOvo - Calculadora de Custos e Preços para Ovos de Páscoa
          </div>
        </footer>
      </div>
    </CostProvider>
  );
};

export default ExtraCosts;
