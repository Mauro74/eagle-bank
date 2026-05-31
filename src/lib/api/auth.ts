import { mockFetch, ApiRequestError } from "./client";
import { mockUsers, mockCredentials } from "@/lib/mocks";
import type {
  User,
  AuthResponse,
  LoginCredentials,
  RegisterPayload,
  MockFetchOptions,
} from "@/types";

const tokenStore = new Map<string, string>(); // token → userId

function generateUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function generateToken(userId: string): string {
  const token = `mock-token-${generateUUID()}`;
  tokenStore.set(token, userId);
  return token;
}

export async function login(
  credentials: LoginCredentials,
  options?: MockFetchOptions,
): Promise<AuthResponse> {
  return mockFetch(() => {
    const expectedPassword = mockCredentials[credentials.email];
    if (!expectedPassword || expectedPassword !== credentials.password) {
      throw new ApiRequestError(
        "INVALID_CREDENTIALS",
        "Invalid email or password.",
        401,
      );
    }
    const user = mockUsers.find((u) => u.email === credentials.email)!;
    return {
      user,
      tokens: {
        accessToken: generateToken(user.id),
      },
    };
  }, options);
}

export async function register(
  payload: RegisterPayload,
  options?: MockFetchOptions,
): Promise<AuthResponse> {
  return mockFetch(() => {
    if (mockCredentials[payload.email]) {
      throw new ApiRequestError(
        "EMAIL_TAKEN",
        "An account with this email already exists.",
        409,
      );
    }
    const user: User = {
      id: `user-${Date.now()}`,
      email: payload.email,
      firstName: payload.firstName,
      lastName: payload.lastName,
      createdAt: new Date().toISOString(),
    };
    mockUsers.push(user);
    mockCredentials[payload.email] = payload.password;
    return {
      user,
      tokens: {
        accessToken: generateToken(user.id),
      },
    };
  }, options);
}

export async function getMe(
  accessToken: string,
  options?: MockFetchOptions,
): Promise<User> {
  return mockFetch(() => {
    const userId = tokenStore.get(accessToken);
    if (!userId) {
      throw new ApiRequestError("UNAUTHORIZED", "Session expired.", 401);
    }

    const user = mockUsers.find((u) => u.id === userId);
    if (!user) {
      throw new ApiRequestError("UNAUTHORIZED", "Session expired.", 401);
    }

    return user;
  }, options);
}

export async function logout(
  accessToken: string,
  options?: MockFetchOptions,
): Promise<void> {
  return mockFetch(() => {
    tokenStore.delete(accessToken);
  }, options);
}
