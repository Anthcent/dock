export type MenuItem = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  category: "smash" | "signature" | "combos" | "sides" | "drinks";
  price: number;
  heat: "suave" | "medio" | "bravo";
  featured: boolean;
  image: string;
  accent: string;
  ingredients: string[];
};

export type CartItem = {
  slug: string;
  name: string;
  price: number;
  quantity: number;
  notes: string;
};

export type MenuResponse = {
  brand: {
    name: string;
    phone: string;
    tagline: string;
  };
  items: MenuItem[];
};
