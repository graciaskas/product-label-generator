'use client'

import * as React from 'react'
import { useEffect } from 'react'
import {
  ThemeProvider as NextThemesProvider,
  type ThemeProviderProps,
} from 'next-themes'
import '../lib/i18n'

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  useEffect(() => {
    // Initialize i18n on client side
  }, [])

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
