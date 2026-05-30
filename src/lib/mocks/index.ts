import type { User, Account, Transaction } from '@/types'
import usersData from './users.json'
import accountsData from './accounts.json'
import transactionsData from './transactions.json'
import credentialsData from './credentials.json'

export const mockUsers = usersData as User[]
export const mockAccounts = accountsData as Account[]
export const mockTransactions = transactionsData as Transaction[]
export const mockCredentials = credentialsData as Record<string, string>
