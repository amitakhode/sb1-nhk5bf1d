export interface UpdateInventoryQuantityParams {
  toyId: string;
  quantityChange: number;
  reason: 'rental' | 'return' | 'damage' | 'restock';
  notes?: string;
}