import { mockFetch } from './client'
import { mockAccounts, mockTransactions } from '@/lib/mocks'
import type { DashboardSummary, MockFetchOptions } from '@/types'

export async function getDashboard(
  options?: MockFetchOptions,
): Promise<DashboardSummary> {
  return mockFetch(() => {
    const accounts = mockAccounts
    const allUserTxns = mockTransactions

    const now = new Date()
    const monthlyTxns = allUserTxns.filter((t) => {
      const d = new Date(t.date)
      return (
        d.getFullYear() === now.getFullYear() &&
        d.getMonth() === now.getMonth()
      )
    })

    const totalBalance = accounts.reduce((sum, a) => sum + a.balance, 0)

    const monthlyDeposits = monthlyTxns
      .filter((t) => t.type === 'credit' && t.status !== 'failed')
      .reduce((sum, t) => sum + t.amount, 0)

    const monthlyWithdrawals = monthlyTxns
      .filter((t) => t.type === 'debit' && t.status !== 'failed')
      .reduce((sum, t) => sum + t.amount, 0)

    const recentTransactions = [...allUserTxns]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5)

    return {
      totalBalance,
      monthlyDeposits,
      monthlyWithdrawals,
      recentTransactions,
      accounts,
    }
  }, options)
}
