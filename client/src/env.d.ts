// Typed custom env vars (Vite exposes only variables prefixed with VITE_).
interface ImportMetaEnv {
  /** "true" sends analytics from `pnpm dev` too. Production builds always send. */
  readonly VITE_ENABLE_ANALYTICS?: string;
}