"use client"

import { useSyncExternalStore } from "react"
import { toast } from "sonner"
import { seed, type Activity, type AdminData } from "./data"

const storageKey = "brinto-admin-demo-v1"
let snapshot: AdminData | undefined
const subscribers = new Set<() => void>()

function getSnapshot() {
  if (!snapshot) {
    try {
      const stored = window.localStorage.getItem(storageKey)
      snapshot = stored
        ? ({ ...seed, ...JSON.parse(stored) } as AdminData)
        : seed
    } catch {
      snapshot = seed
    }
  }
  return snapshot
}

function subscribe(listener: () => void) {
  subscribers.add(listener)
  return () => {
    subscribers.delete(listener)
  }
}

export function useAdmin() {
  return useSyncExternalStore(subscribe, getSnapshot, () => seed)
}

export function saveDemo(
  update: (data: AdminData) => AdminData,
  message?: string,
  activity?: Omit<Activity, "id">
) {
  let next = update(getSnapshot())
  if (activity) {
    next = {
      ...next,
      activities: [
        { ...activity, id: crypto.randomUUID() },
        ...next.activities,
      ].slice(0, 15),
      unreadActivities: true,
    }
  }
  try {
    window.localStorage.setItem(storageKey, JSON.stringify(next))
  } catch {
    toast.error(
      "Could not save to browser storage. Check available space and try again."
    )
    return false
  }
  snapshot = next
  subscribers.forEach((listener) => listener())
  if (message) toast.success(message)
  return true
}
