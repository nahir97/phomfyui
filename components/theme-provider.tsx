"use client";

import * as React from "react";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Simple provider for now, we can add more logic if needed
  return <>{children}</>;
}
