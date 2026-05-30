export type ProfileFormState =
  | { status: 'idle' }
  | { status: 'saved' }
  | { status: 'error'; message: string }
