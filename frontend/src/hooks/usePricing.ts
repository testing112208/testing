import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api-client";

export interface PricingItem {
    _id?: string;
    cabType: string;
    basePrice: number;
    priceUnit: string;
    imageUrl?: string;
    description?: string;
}

export const fetchPricing = async (): Promise<PricingItem[]> => {
    const result = await apiRequest<{ success: boolean; data: PricingItem[]; message?: string }>("/api/pricing");
    return result.data;
};

export const usePricing = () => {
    return useQuery({
        queryKey: ["pricing"],
        queryFn: fetchPricing,
        staleTime: 1000 * 60 * 5, // Keep data fresh for 5 minutes
        refetchInterval: 1000 * 60 * 10, // Sync every 10 minutes
        refetchOnWindowFocus: true,
    });
};
