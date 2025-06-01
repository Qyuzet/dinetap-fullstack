// @ts-nocheck
"use client"

import { createContext, useContext, useEffect, useState } from 'react'
import { Session } from 'next-auth'
import { useSession, signIn, signOut } from 'next-auth/react'

type AuthContextType = {
  session: Session | null
  status: 'loading' | 'authenticated' | 'unauthenticated'
  signIn: (provider?: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()

  const handleSignIn = async (provider: string = 'google') => {
    await signIn(provider, { callbackUrl: '/dashboard' })
  }

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' })
  }

  return (
    <AuthContext.Provider
      value={{
        session,
        status,
        signIn: handleSignIn,
        signOut: handleSignOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
