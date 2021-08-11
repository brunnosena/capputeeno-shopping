export interface Product {
  name: string;
  price_in_cents: string;
  id: string;
  image_url: string;
  convertedPrice?: string;
  category: string;
  description: string;
}