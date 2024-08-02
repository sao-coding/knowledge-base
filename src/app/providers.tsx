"use client"

import React from "react"

// import { ThemeProvider } from "next-themes"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

const Providers = ({ children }: { children: React.ReactNode }) => {
  const [queryClient] = React.useState(() => new QueryClient())

  return (
    // <ThemeProvider attribute='class' disableTransitionOnChange>
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    // </ThemeProvider>
  )
}

export default Providers
