import { useCurrentUser } from "./useCurrentUser"
import type { UserRole, ResourceAction } from "@neuroplus/types"

const PERMISSIONS: Record<UserRole, ResourceAction[]> = {
  neurodivergent: ["diary:own", "routine:own", "medication:own", "goal:own"],
  caregiver: ["diary:linked", "routine:linked", "medication:linked", "goal:linked"],
  professional: ["diary:patient", "session:own", "goal:patient", "report:patient"],
  admin: ["*"],
}

export function usePermissions() {
  const user = useCurrentUser()

  function can(action: ResourceAction): boolean {
    if (!user) return false
    const allowed = PERMISSIONS[user.role] ?? []
    return allowed.includes("*") || allowed.includes(action)
  }

  return { can }
}
