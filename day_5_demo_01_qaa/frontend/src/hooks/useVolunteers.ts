import { useState, useEffect } from 'react'
import { fetchVolunteers } from '../api/volunteersApi'
import type { Volunteer } from '../types'

export interface UseVolunteersResult {
  volunteers: Volunteer[]
  loading: boolean
  error: string | null
}

export function useVolunteers(): UseVolunteersResult {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    setError(null)
    fetchVolunteers()
      .then(setVolunteers)
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : 'Unknown error')
      })
      .finally(() => setLoading(false))
  }, [])

  return { volunteers, loading, error }
}
