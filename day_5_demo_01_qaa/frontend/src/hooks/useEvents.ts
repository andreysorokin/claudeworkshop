import { useState, useEffect } from 'react'
import { fetchEvents } from '../api/eventsApi'
import type { Event } from '../types'

export interface UseEventsResult {
  events: Event[]
  loading: boolean
  error: string | null
}

export function useEvents(category?: string): UseEventsResult {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    setError(null)
    fetchEvents(category)
      .then((data) => {
        const sorted = [...data].sort((a, b) => a.date.localeCompare(b.date))
        setEvents(sorted)
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : 'Unknown error')
      })
      .finally(() => setLoading(false))
  }, [category])

  return { events, loading, error }
}
