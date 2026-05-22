// types/home.ts
export interface Company {
  name: string;
  about: string;
  description: string;
  logo: string;
  whatsapp_number: string;
  whatsapp_message: string;
  whatsapp_url: string;
  phone: string;
  email: string;
  address: string;
  social_media: Record<string, string>;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  main_image: string;
  brand?: string;
  categories: string[];
  whatsapp_url: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  image: string;
  children_count: number;
}

export interface Article {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  image: string;
  author: string;
  published_at: string;
  read_time: string;
}

export interface Partner {
  id: number;
  name: string;
  logo: string;
  description: string;
  website: string;
}

export interface Marketplace {
  id: number;
  name: string;
  slug: string;
  logo: string;
  url: string;
  description: string;
  color?: string;
}

export interface HomeProps {
  company: Company;
  featuredProducts: Product[];
  mainCategories: Category[];
  latestArticles: Article[];
  partners: Partner[];
  marketplaces: Marketplace[];
  stats: {
    products_count: number;
    categories_count: number;
    partners_count: number;
    experience_years: number;
  };
}