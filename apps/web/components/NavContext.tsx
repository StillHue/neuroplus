"use client"

import { createContext, useContext, useState, useCallback, useEffect } from "react"

interface NavContextValue {
  hidden: boolean
  hideNav: () => void
  showNav: () => void
}

const NavContext = createContext<NavContextValue>({
  hidden: false,
  hideNav: () => {},
  showNav: () => {},
})

export function NavProvider({ children }: { children: React.ReactNode }) {
  const [hidden, setHidden] = useState(false)
  const hideNav = useCallback(() => setHidden(true),  [])
  const showNav = useCallback(() => setHidden(false), [])
  return (
    <NavContext.Provider value={{ hidden, hideNav, showNav }}>
      {children}
    </NavContext.Provider>
  )
}

export function useNav() {
  return useContext(NavContext)
}

/** Call inside any sheet/modal that should hide the bottom nav while open. */
export function useHideNav() {
  const { hideNav, showNav } = useNav()
  useEffect(() => {
    hideNav()
    return () => showNav()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
