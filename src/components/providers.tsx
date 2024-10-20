"use client";

import { QueryProvider } from "./queryProvider";

interface ProviderProps {
  children: React.ReactNode;
}

export const Providers = ({ children }: ProviderProps) => {
  return <QueryProvider>{children}</QueryProvider>;
};
