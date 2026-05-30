import { describe, it, expect } from 'vitest'
import { loginSchema } from '@/features/auth/schemas'

describe('loginSchema', () => {
  it('rejects an invalid email format', () => {
    const result = loginSchema.safeParse({
      email: 'not-an-email',
      password: 'password123',
    })

    expect(result.success).toBe(false)
    expect(result.error?.issues[0].message).toBe('Enter a valid email address')
  })

  it('rejects an empty password', () => {
    const result = loginSchema.safeParse({
      email: 'valid@example.com',
      password: '',
    })

    expect(result.success).toBe(false)
    expect(result.error?.issues[0].message).toBe('Password is required')
  })
})
