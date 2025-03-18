
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Egg, BarChart2, ClipboardList, DollarSign } from 'lucide-react';

const Navbar: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-md transition-all">
      <div className="container flex items-center justify-between py-3 px-4 md:px-6">
        <Link to="/" className="flex items-center space-x-2 transition-opacity hover:opacity-80">
          <Egg className="h-6 w-6 text-primary-foreground" />
          <span className="font-display text-lg font-medium">CustoOvo</span>
        </Link>
        
        <nav className="hidden md:flex space-x-2">
          <NavItem 
            to="/"
            icon={<BarChart2 className="h-4 w-4" />}
            label="Dashboard"
            isActive={isActive('/')}
          />
          <NavItem 
            to="/ingredients"
            icon={<ClipboardList className="h-4 w-4" />}
            label="Ingredientes"
            isActive={isActive('/ingredients')}
          />
          <NavItem 
            to="/extra-costs"
            icon={<BarChart2 className="h-4 w-4" />}
            label="Custos Extras"
            isActive={isActive('/extra-costs')}
          />
          <NavItem 
            to="/pricing"
            icon={<DollarSign className="h-4 w-4" />}
            label="Precificação"
            isActive={isActive('/pricing')}
          />
        </nav>

        <nav className="md:hidden flex">
          <div className="flex h-10 w-10 items-center justify-center">
            <Link to="/" aria-label="Dashboard">
              <BarChart2 className={`h-5 w-5 ${isActive('/') ? 'text-primary-foreground' : 'text-muted-foreground'}`} />
            </Link>
          </div>
          <div className="flex h-10 w-10 items-center justify-center">
            <Link to="/ingredients" aria-label="Ingredientes">
              <ClipboardList className={`h-5 w-5 ${isActive('/ingredients') ? 'text-primary-foreground' : 'text-muted-foreground'}`} />
            </Link>
          </div>
          <div className="flex h-10 w-10 items-center justify-center">
            <Link to="/extra-costs" aria-label="Custos Extras">
              <BarChart2 className={`h-5 w-5 ${isActive('/extra-costs') ? 'text-primary-foreground' : 'text-muted-foreground'}`} />
            </Link>
          </div>
          <div className="flex h-10 w-10 items-center justify-center">
            <Link to="/pricing" aria-label="Precificação">
              <DollarSign className={`h-5 w-5 ${isActive('/pricing') ? 'text-primary-foreground' : 'text-muted-foreground'}`} />
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
};

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, label, isActive }) => {
  return (
    <Link
      to={to}
      className={`inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors ${
        isActive
          ? 'bg-primary text-primary-foreground'
          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
      }`}
    >
      {icon}
      <span className="ml-2">{label}</span>
    </Link>
  );
};

export default Navbar;
