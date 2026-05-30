import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest'
import { login, register, getMe, configureMock, ApiRequestError } from '@/lib/api'
import { mockUsers, mockCredentials } from '@/lib/mocks'

// Zero delay for all tests in this file
beforeAll(() => configureMock({ delayMs: 0 }))
afterAll(() => configureMock({ delayMs: 600 }))

// ─── login ────────────────────────────────────────────────────────────────────

describe('login', () => {
  it('returns user and access token for valid credentials', async () => {
    const result = await login({
      email: 'demo@eaglebank.com',
      password: 'password123',
    })

    expect(result.user.email).toBe('demo@eaglebank.com')
    expect(result.user.id).toBe('user-001')
    expect(result.tokens.accessToken).toBeTruthy()
  })

  it('throws INVALID_CREDENTIALS for wrong password', async () => {
    const error = await login({
      email: 'demo@eaglebank.com',
      password: 'wrong-password',
    }).catch((e) => e)

    expect(error).toBeInstanceOf(ApiRequestError)
    expect((error as ApiRequestError).code).toBe('INVALID_CREDENTIALS')
    expect((error as ApiRequestError).statusCode).toBe(401)
  })
})

// ─── register ─────────────────────────────────────────────────────────────────

describe('register', () => {
  const TEST_EMAIL = 'register-test@example.com'

  afterEach(() => {
    // Remove any user and credential added during the test
    const idx = mockUsers.findIndex((u) => u.email === TEST_EMAIL)
    if (idx !== -1) mockUsers.splice(idx, 1)
    Reflect.deleteProperty(mockCredentials, TEST_EMAIL)
  })

  it('creates a new user and returns an access token', async () => {
    const result = await register({
      email: TEST_EMAIL,
      password: 'newpassword123',
      firstName: 'Test',
      lastName: 'User',
    })

    expect(result.user.email).toBe(TEST_EMAIL)
    expect(result.user.firstName).toBe('Test')
    expect(result.tokens.accessToken).toBeTruthy()
  })

  it('throws EMAIL_TAKEN for a duplicate email', async () => {
    // First registration must succeed
    await register({
      email: TEST_EMAIL,
      password: 'newpassword123',
      firstName: 'Test',
      lastName: 'User',
    })

    // Second registration must throw
    const error = await register({
      email: TEST_EMAIL,
      password: 'anotherpass',
      firstName: 'Test',
      lastName: 'User',
    }).catch((e) => e)

    expect(error).toBeInstanceOf(ApiRequestError)
    expect((error as ApiRequestError).code).toBe('EMAIL_TAKEN')
    expect((error as ApiRequestError).statusCode).toBe(409)
  })
})

// ─── getMe ────────────────────────────────────────────────────────────────────

describe('getMe', () => {
  it('returns the user for a valid access token', async () => {
    const { tokens } = await login({
      email: 'demo@eaglebank.com',
      password: 'password123',
    })

    const user = await getMe(tokens.accessToken)

    expect(user.id).toBe('user-001')
    expect(user.email).toBe('demo@eaglebank.com')
  })

  it('throws UNAUTHORIZED for an unrecognised token', async () => {
    const error = await getMe('not-a-real-token-xyz').catch((e) => e)

    expect(error).toBeInstanceOf(ApiRequestError)
    expect((error as ApiRequestError).code).toBe('UNAUTHORIZED')
    expect((error as ApiRequestError).statusCode).toBe(401)
  })
})
