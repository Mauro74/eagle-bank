import { mockFetch, ApiRequestError } from './client'
import { mockUsers } from '@/lib/mocks'
import type { User, UpdateProfilePayload, MockFetchOptions, Address } from '@/types'

export async function getProfile(options?: MockFetchOptions): Promise<User> {
  return mockFetch(() => {
    const user = mockUsers[0]
    if (!user) throw new ApiRequestError('NOT_FOUND', 'User not found.', 404)
    return user
  }, options)
}

export async function updateProfile(
  payload: UpdateProfilePayload,
  options?: MockFetchOptions,
): Promise<User> {
  return mockFetch(() => {
    if (!mockUsers[0]) throw new ApiRequestError('NOT_FOUND', 'User not found.', 404)
    const { address: payloadAddress, ...rest } = payload
    const updated: User = {
      ...mockUsers[0],
      ...rest,
      address: payloadAddress
        ? ({ ...(mockUsers[0].address ?? {}), ...payloadAddress } as Address)
        : mockUsers[0].address,
    }
    mockUsers[0] = updated
    return updated
  }, options)
}
