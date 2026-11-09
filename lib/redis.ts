import { Redis } from '@upstash/redis'

let client: Redis | null = null

function getClient(): Redis {
  if (client) return client
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !token) {
    throw new Error('Upstash Redis environment variables must be defined')
  }
  client = new Redis({ url, token })
  return client
}

// Created on first use so the app can build without Redis credentials.
export const redis = new Proxy({} as Redis, {
  get(_target, prop) {
    const value = Reflect.get(getClient(), prop)
    return typeof value === 'function' ? value.bind(getClient()) : value
  },
})
