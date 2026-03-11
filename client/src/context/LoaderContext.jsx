import { createContext, useContext, useState, useCallback } from 'react'

const LoaderContext = createContext(null)

export function LoaderProvider ({ children }) {
  const [loaderKey, setLoaderKey] = useState(0)

  const triggerLoader = useCallback(() => {
    setLoaderKey(k => k + 1)
  }, [])

  return (
    <LoaderContext.Provider value={{ loaderKey, triggerLoader }}>
      {children}
    </LoaderContext.Provider>
  )
}

export function useLoader () {
  return useContext(LoaderContext)
}
