import { useSession } from "next-auth/react"
import type { User } from "@neuroplus/types"

export function useCurrentUser(): User | null {
  const { data: session } = useSession()
  return session?.user ?? null
}
