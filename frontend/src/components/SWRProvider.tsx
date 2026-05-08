"use client";

import { SWRConfig } from "swr";
import api from "@/lib/api";

const globalFetcher = (url: string) => api.get(url).then((r) => r.data);

export function SWRProvider({ children }: { children: React.ReactNode }) {
  return (
    <SWRConfig
      value={{
        fetcher: globalFetcher,
        revalidateOnFocus: false,
        shouldRetryOnError: false,
        errorRetryCount: 1,
      }}
    >
      {children}
    </SWRConfig>
  );
}
