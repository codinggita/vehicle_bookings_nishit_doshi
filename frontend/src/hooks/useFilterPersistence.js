import { useState, useCallback, useEffect } from 'react'

export default function useFilterPersistence(key, initialValue = {}) {
  const stored = sessionStorage.getItem(key)
  const [state, setState] = useState(stored ? { ...initialValue, ...JSON.parse(stored) } : initialValue)

  useEffect(() => {
    const entries = Object.entries(state).filter(([, v]) => v !== '' && v !== null && v !== undefined)
    if (entries.length) {
      sessionStorage.setItem(key, JSON.stringify(Object.fromEntries(entries)))
    } else {
      sessionStorage.removeItem(key)
    }
  }, [state, key])

  const setFilter = useCallback((name, value) => {
    setState((prev) => ({ ...prev, [name]: value }))
  }, [])

  const resetFilters = useCallback(() => {
    setState(initialValue)
    sessionStorage.removeItem(key)
  }, [key, initialValue])

  return [state, setFilter, resetFilters]
}
