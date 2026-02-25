import { decode } from "@toon-format/toon";

interface FetchOptions extends RequestInit {
    token?: string | null;
}

export async function apiRequest<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
    const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000";
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
