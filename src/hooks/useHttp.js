import { inject } from 'vue'

export function useHttp() {
  const http = inject('http')
  if (!http) {
    throw new Error('useHttp must be used within a provider')
  }
  return http
}