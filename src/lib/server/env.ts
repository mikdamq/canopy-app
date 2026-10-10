import "server-only";

/**
 * A server setting with stray spaces or line breaks removed. Hosting panels (cPanel's
 * environment variables) make a trailing space easy to paste, and "laminafarm.app " is
 * not a valid host name. Empty counts as unset.
 */
export const env = (name: string) => process.env[name]?.trim() || undefined;
