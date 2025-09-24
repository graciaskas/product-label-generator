"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import {
  ThemeProvider as NextThemesProvider,
  type ThemeProviderProps,
} from "next-themes";
import { I18nextProvider } from "react-i18next";
import i18n from "../lib/i18n";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Initialize i18n
    i18n.init();
    
    // Load saved language preference
    const savedLanguage = localStorage.getItem("preferred-language");
    if (savedLanguage && savedLanguage !== i18n.language) {
      i18n.changeLanguage(savedLanguage);
    }
  }, []);

  if (!isClient) {
    return <>{children}</>;
  }

  return (
    <NextThemesProvider {...props}>
      <I18nextProvider i18n={i18n}>
        {children}
      </I18nextProvider>
    </NextThemesProvider>
  );
}