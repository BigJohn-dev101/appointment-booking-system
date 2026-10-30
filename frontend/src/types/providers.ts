export type ProviderService = {
  id: string;
  name: string;
  description: string;
  duration: number;
  price: number | null;
};

export type Provider = {
  id: string;
  kind: "SOLE_PROVIDER" | "BUSINESS";
  name: string;
  category: string;
  description: string;
  city: string | null;
  hours: string;
  initials: string;
  status: "Open" | "Closed";
  services: ProviderService[];
};