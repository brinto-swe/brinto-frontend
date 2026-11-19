"use client"

import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient()
export const { getSession, useSession, signIn, signOut } = authClient
