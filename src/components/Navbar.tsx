import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, User, Package, Boxes } from 'lucide-react';
import { useStore } from '../store/useStore';
import { Logo } from './Logo';
import { SearchBar } from './SearchBar';

export const Navbar: React.FC = () => {
  const cart = useStore((state) => state.cart);
  const user = useStore((state) => state.user);

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Logo />
          </div>

          <div className="flex-1 flex items-center justify-center px-2 lg:ml-6 lg:justify-end">
            <div className="max-w-lg w-full lg:max-w-xs">
              <SearchBar />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Link 
              to="/admin/inventory" 
              className="p-2 text-gray-600 hover:text-gray-900"
              title="Inventory Management"
            >
              <Boxes className="h-6 w-6" />
            </Link>
            <Link 
              to="/admin/orders" 
              className="p-2 text-gray-600 hover:text-gray-900"
              title="Order Management"
            >
              <Package className="h-6 w-6" />
            </Link>
            <Link to="/cart" className="relative p-2">
              <ShoppingCart className="h-6 w-6 text-gray-600" />
              {cart.length > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-primary rounded-full">
                  {cart.length}
                </span>
              )}
            </Link>
            <Link to={user ? "/profile" : "/login"} className="p-2">
              <User className="h-6 w-6 text-gray-600" />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};