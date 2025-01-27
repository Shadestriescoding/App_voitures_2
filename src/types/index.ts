export interface Car {
  id: string;
  url: string;
  brand: string;
  model: string;
  year?: number;
  mileage?: number;
  price?: number;
  equipment?: string[];
  photos?: string[];
  pros?: string;
  cons?: string;
  opinion?: 'like' | 'dislike' | 'maybe';
  createdAt: string;
  updatedAt: string;
}

export type CarCreateInput = Omit<Car, 'id' | 'createdAt' | 'updatedAt'>;
export type CarUpdateInput = Partial<Omit<Car, 'id' | 'createdAt' | 'updatedAt'>>; 