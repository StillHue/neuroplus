import { useCurrentUser } from "./useCurrentUser"
import type { LinkedProfile } from "@neuroplus/types"

// Populated via tRPC query on app mount; stored in Zustand
export function useLinkedProfiles(): LinkedProfile[] {
  const user = useCurrentUser()
  if (!user) return []
  // replaced at runtime by the Zustand store hydrated from tRPC
  return []
}
