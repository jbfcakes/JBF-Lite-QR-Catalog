export type Cake = {
  id?: string;

  code: string;
  name: string;

  images: string[];

  categories: string[];
  subCategories: string[];

  flavours: string[];

  startingPrice: number;

  minWeight: string;      // 500g, 1kg
  serving: string;        // 4-6, 8-10

  active: boolean;

  createdAt: number;
};

export type Category = {
  id?: string;
  name: string;
  icon: string;
  subs: string[];
};

export type Flavour = {
  id?: string;
  name: string;
};

export type Banner = {
  id?: string;
  title: string;
  image: string;
  active: boolean;
  createdAt: number;
};