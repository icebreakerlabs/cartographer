export function delay(ms = 0) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function retry<T>(
  fn: () => Promise<T> | T,
  { retries, retryIntervalMs }: { retries: number; retryIntervalMs: number },
) {
  try {
    return await fn();
  } catch (error) {
    if (retries <= 0) {
      throw error;
    }

    await delay(retryIntervalMs);

    return retry(fn, { retries: retries - 1, retryIntervalMs });
  }
}

export function timeout<T>(promise: Promise<T>, ms: number) {
  return Promise.race([
    promise,
    new Promise<T>((resolve, reject) => {
      setTimeout(() => reject(new Error('timeout')), ms);
    }),
  ]);
}
