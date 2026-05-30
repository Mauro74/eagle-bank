import { sleep } from "@/lib/utils";
import type { ApiError, ErrorScenario, MockFetchOptions } from "@/types";

export class ApiRequestError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly statusCode: number,
  ) {
    super(message);
    this.name = "ApiRequestError";
  }

  toApiError(): ApiError {
    return {
      message: this.message,
      code: this.code,
      statusCode: this.statusCode,
    };
  }
}

// ─── Global mock configuration ────────────────────────────────────────────────
// Toggle simulateErrors or override the default error scenario at any time.
// Useful in Vitest tests: configureMock({ simulateErrors: true }) before a
// test block, then reset with configureMock({ simulateErrors: false }) after.

interface MockConfig {
  simulateErrors: boolean;
  errorScenario: ErrorScenario;
  delayMs: number;
}

const DEFAULT_ERROR: ErrorScenario = {
  code: "INTERNAL_ERROR",
  message: "Something went wrong. Please try again.",
  statusCode: 500,
};

const config: MockConfig = {
  simulateErrors: false,
  errorScenario: DEFAULT_ERROR,
  delayMs: 600,
};

export function configureMock(overrides: Partial<MockConfig>): void {
  Object.assign(config, overrides);
}

export function resetMockConfig(): void {
  config.simulateErrors = false;
  config.errorScenario = DEFAULT_ERROR;
  config.delayMs = 600;
}

// ─── Core fetch primitive ─────────────────────────────────────────────────────

function randomDelayMs(): number {
  return (
    config.delayMs +
    Math.floor(Math.random() * (config.delayMs - config.delayMs + 1))
  );
}

export async function mockFetch<T>(
  handler: () => T,
  options: MockFetchOptions = {},
): Promise<T> {
  await sleep(randomDelayMs());

  // Per-call flag takes precedence over global config.
  // Pass simulateError: false to explicitly bypass global error injection.
  const shouldError =
    options.simulateError !== undefined
      ? Boolean(options.simulateError)
      : config.simulateErrors;

  if (shouldError) {
    const scenario =
      typeof options.simulateError === "object"
        ? options.simulateError
        : config.errorScenario;
    throw new ApiRequestError(
      scenario.code,
      scenario.message,
      scenario.statusCode,
    );
  }

  return handler();
}
