export interface Toy {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  ageRange: {
    min: number;
    max: number;
  };
  category: string[];
  pricePerDay: number;
  available: boolean;
  educationalBenefits: string[];
  safetyInfo: string;
  averageRating: number;
  rentCount: number;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  rentalHistory: RentalHistory[];
}

export interface RentalHistory {
  id: string;
  toyId: string;
  userId: string;
  startDate: Date;
  endDate: Date;
  status: 'active' | 'completed' | 'cancelled';
  totalPrice: number;
}