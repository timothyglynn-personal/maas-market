export type Seller = {
  id: string;
  name: string;
  email: string;
  stripe_account_id: string | null;
  status: "pending" | "active" | "inactive";
  created_at: string;
};

export type Product = {
  id: string;
  seller_id: string;
  name: string;
  description: string | null;
  price: number; // stored in cents
  status: "draft" | "active" | "sold_out";
  created_at: string;
};

export type ProductImage = {
  id: string;
  product_id: string;
  url: string;
  sort_order: number;
  created_at: string;
};

export type ProductWithImages = Product & {
  product_images: ProductImage[];
};
