export interface InventoryItem {
  id: string;
  toy_id: string;
  quantity: number;
  available_quantity: number;
  reserved_quantity: number;
  location: string;
  last_checked: string;
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
  toy?: {
    name: string;
    image_url: string | null;
  };
}

// ... rest of the file remains the same