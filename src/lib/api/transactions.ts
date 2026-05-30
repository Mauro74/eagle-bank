import { mockFetch, ApiRequestError } from './client'
import { mockTransactions } from '@/lib/mocks'
import type { Transaction, MockFetchOptions } from '@/types'

export async function getTransactions(
  accountId: string,
  options?: MockFetchOptions,
): Promise<Transaction[]> {
  return mockFetch(
    () =>
      mockTransactions
        .filter((t) => t.accountId === accountId)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    options,
  )
}

export async function getTransaction(
  transactionId: string,
  options?: MockFetchOptions,
): Promise<Transaction> {
  return mockFetch(() => {
    const txn = mockTransactions.find((t) => t.id === transactionId)
    if (!txn) {
      throw new ApiRequestError('NOT_FOUND', 'Transaction not found.', 404)
    }
    return txn
  }, options)
}
