// @ts-nocheck
"use client"

import { useEffect, useState } from "react"

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(false)
  const [mounted, setMounted] = useState<boolean>(false)

  useEffect(() => {
    setMounted(true)
    
    const mediaQuery = window.matchMedia(query)
    setMatches(mediaQuery.matches)
    
    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches)
    }
    
    mediaQuery.addEventListener("change", listener)
    
    return () => {
      mediaQuery.removeEventListener("change", listener)
    }
  }, [query])

  // Prevents hydration mismatch by only returning the value after mounting
  return mounted ? matches : false
}