export interface Product {
  id: number;
  name: string;
  category: string;
  description: string;
  price: number;
  unit: string;
  stock: number;
  image: string;
  tags: string[];
  featured: boolean;
  nutritionalHighlights: string[];
}

export interface ProductCategory {
  label: string;
  value: string | null;
}
