export interface Bungalow {
  _id: string;
  name: string;
  description: string;
  price: number;
  baths: number;
  beds: number;
  maxOccupancy: number;
  area: string;
  images: string[];         // Toutes les images
  isAvailable?: boolean;
  popular?: boolean;

}
export interface CreateBungalowDto {
  name: string;
  description: string;
  price: number;
  baths: number;
  beds: number;
  maxOccupancy: number;
  area: string;
  images: string[];         // Toutes les images
  isAvailable?: boolean;
  popular?: boolean;
}
