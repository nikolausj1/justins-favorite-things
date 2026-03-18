import productsData from "@/data/products.json";
import { Product } from "./types";

export function getProducts(): Product[] {
  return productsData as Product[];
}

export function getCategories(products: Product[]): string[] {
  return Array.from(new Set(products.map((p) => p.category))).sort();
}

export function buildAffiliateUrl(asin: string): string {
  const tag = process.env.NEXT_PUBLIC_AMAZON_TAG || "YOUR_TAG_HERE";
  return `https://www.amazon.com/dp/${asin}?tag=${tag}`;
}
