// GET /api/accounts         → getAccounts()
// GET /api/accounts/:id     → getAccount(id)
import { mockFetch, ApiRequestError } from './client'
import { mockAccounts } from '@/lib/mocks'
import type { Account, MockFetchOptions } from '@/types'

export async function getAccounts(options?: MockFetchOptions): Promise<Account[]> {
  return mockFetch(() => mockAccounts, options)
}

// Real fetch example for GET /api/accounts ↑
// export async function getAccounts(): Promise<Account[]> {
//   const response = await fetch('/api/accounts', {
//     headers: { Authorization: `Bearer ${getToken()}` }
//   })
//   if (!response.ok) throw new ApiRequestError('FETCH_ERROR', 'Failed', response.status)
//   return response.json()
// }

export async function getAccount(
  accountId: string,
  options?: MockFetchOptions,
): Promise<Account> {
  return mockFetch(() => {
    const account = mockAccounts.find((a) => a.id === accountId)
    if (!account) {
      throw new ApiRequestError('NOT_FOUND', 'Account not found.', 404)
    }
    return account
  }, options)
}
