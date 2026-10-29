import { apiFetch } from "./api";
import type { Provider } from "../types/providers";

export async function fetchProviders(): Promise<Provider[]> {
  const response = await apiFetch<{ success: boolean; providers: Provider[] }>("/providers");
  return response.providers;
}

export async function fetchProvider(id: string): Promise<Provider> {
  const response = await apiFetch<{ success: boolean; provider: Provider }>(`/providers/${encodeURIComponent(id)}`);
  return response.provider;
}