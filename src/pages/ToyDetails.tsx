import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Star } from 'lucide-react';
import { useStore } from '../store/useStore';
import { useToyDetails } from '../hooks/useToys';
import { RentalDuration } from '../components/RentalDuration';
import { SafetyInfo } from '../components/SafetyInfo';
import { Benefits } from '../components/Benefits';
import { DepositInfo } from '../components/DepositInfo';
import { Loader } from '../components/Loader';
import { calculateDeposit, getDepositTerms } from '../utils/depositCalculator';

export const ToyDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [duration, setDuration] = useState(1);
  const [currentDeposit, setCurrentDeposit] = useState(0);
  const [depositTerms, setDepositTerms] = useState('');
  const { addToCart, user } = useStore();
  const { toy, loading, error } = useToyDetails(id!);

  useEffect(() => {
    if (toy) {
      const deposit = calculateDeposit(toy.price_per_day, duration);
      const terms = getDepositTerms(duration);
      setCurrentDeposit(deposit);
      setDepositTerms(terms);
    }
  }, [toy, duration]);

  if (loading) return <Loader />;
  if (error) return <div className="text-center text-red-600 p-8">{error.message}</div>;
  if (!toy) return <div className="text-center p-8">Toy not found</div>;

  const handleRent = () => {
    if (!user) {
      localStorage.setItem('authRedirectPath', location.pathname);
      localStorage.setItem('pendingCartItem', JSON.stringify({
        toyId: toy.id,
        duration: duration
      }));
      navigate('/login');
      return;
    }

    addToCart({
      id: toy.id,
      name: toy.name,
      imageUrl: toy.image_url || '',
      pricePerDay: toy.price_per_day,
      depositAmount: currentDeposit,
      depositTerms: depositTerms,
      available: toy.available
    }, duration);
    navigate('/cart');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <img 
            src={toy.image_url || ''} 
            alt={toy.name}
            className="w-full h-96 object-cover rounded-2xl"
          />
        </div>
        
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-primary">{toy.name}</h1>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Star className="w-5 h-5 text-secondary" />
              <span className="ml-1 font-medium">{toy.average_rating?.toFixed(1)}</span>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              toy.available 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {toy.available ? 'Available' : 'Rented'}
            </span>
          </div>

          <p className="text-gray-600">{toy.description}</p>
          
          <div className="border-t border-b py-4 space-y-4">
            <RentalDuration 
              pricePerDay={toy.price_per_day}
              duration={duration}
              setDuration={setDuration}
            />
            
            <DepositInfo 
              depositAmount={currentDeposit}
              depositTerms={depositTerms}
            />
          </div>

          <button
            onClick={handleRent}
            disabled={!toy.available}
            className={`w-full py-3 px-6 rounded-full font-medium text-white
              ${toy.available 
                ? 'bg-emerald-600 hover:bg-emerald-700' 
                : 'bg-gray-400 cursor-not-allowed'} 
              transition-colors duration-300`}
          >
            {toy.available ? 'Add to Cart' : 'Currently Unavailable'}
          </button>

          {toy.educational_benefits && (
            <Benefits benefits={toy.educational_benefits} />
          )}
          
          {toy.safety_info && (
            <SafetyInfo info={toy.safety_info} />
          )}
        </div>
      </div>
    </div>
  );
};