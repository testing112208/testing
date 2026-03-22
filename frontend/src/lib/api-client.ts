import { decode } from "@toon-format/toon";

interface FetchOptions extends RequestInit {
    token?: string | null;
}

/**
 * Returns the API base URL based on the current environment.
 * Priority: 
 * 1. process.env.NEXT_PUBLIC_API_URL if defined
 * 2. http://127.0.0.1:5000 if running on localhost
 * 3. https://cab-serves-backend.onrender.com (Production fallback)
 */
export function getApiBaseUrl(): string {
    if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL;
    
    // Check if we are running in the browser
    if (typeof window !== "undefined") {
        const { hostname } = window.location;
        if (hostname === "localhost" || hostname === "127.0.0.1" || hostname.startsWith("192.168.")) {
            return "http://127.0.0.1:5000";
        }
    }
    
    return "https://cab-serves-backend.onrender.com";
}

export async function apiRequest<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
    const apiBase = getApiBaseUrl();
    const url = endpoint.startsWith("http") ? endpoint : `${apiBase}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;

    const headers = new Headers(options.headers);
    if (options.token) {
        headers.set("Authorization", `Bearer ${options.token}`);
    }
    if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
        headers.set("Content-Type", "application/json");
    }

    const response = await fetch(url, {
        ...options,
        headers,
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Unknown error occurred" }));
        throw new Error(errorData.message || `Request failed with status ${response.status}`);
    }

    const contentType = response.headers.get("Content-Type");

    if (contentType?.includes("text/toon")) {
        const text = await response.text();
        const decoded = decode(text) as any;
        return decoded as T;
    }

    return response.json() as Promise<T>;
}
