
import React from 'react';
import Navbar from '../components/Navbar';
import Dashboard from '../components/Dashboard';
import { CostProvider } from '../context/CostContext';

const Index: React.FC = () => {
  return (
    <CostProvider>
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="flex-1 container py-8 px-4 md:px-6">
          <Dashboard />
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

export default Index;
