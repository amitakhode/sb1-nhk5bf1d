import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { fetchToyById } from '../services/toys';
import { calculateDeposit, getDepositTerms } from '../utils/depositCalculator';

export const usePendingCart = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { addToCart } = useStore();
  const navigate = useNavigate();

  const handlePendingCartItem = async () => {
    const pendingItemStr = localStorage.getItem('pendingCartItem');
    if (!pendingItemStr) return;

    setLoading(true);
    try {
      const { toyId, duration } = JSON.parse(pendingItemStr);
      const toy = await fetchToyById(toyId);
      
      if (toy) {
        const deposit = calculateDeposit(toy.price_per_day, duration);
        const terms = getDepositTerms(duration);
        
        addToCart({
          id: toy.id,
          name: toy.name,
          imageUrl: toy.image_url || '',
          pricePerDay: toy.price_per_day,
          depositAmount: deposit,
          depositTerms: terms,
          available: toy.available
        }, duration);
        
        navigate('/cart');
      }
    } catch (err) {
      console.error('Error handling pending cart item:', err);
      setError(err instanceof Error ? err : new Error('Failed to process pending cart item'));
    } finally {
      localStorage.removeItem('pendingCartItem');
      setLoading(false);
    }
  };

  useEffect(() => {
    const redirectPath = localStorage.getItem('authRedirectPath');
    if (redirectPath) {
      localStorage.removeItem('authRedirectPath');
      handlePendingCartItem();
    }
  }, []);

  return { loading, error };
};