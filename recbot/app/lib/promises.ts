/* eslint-disable drizzle/enforce-delete-with-where */

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

export type Callback<T = unknown> = (value: T) => void;

export function enqueue<T>(
  callbacks: Set<Callback<T>>,
  callback: Callback<T> | undefined,
  priority?: boolean,
) {
  if (!callback) {
    return;
  }

  if (priority) {
    const newCallbacks = [callback, ...callbacks];

    callbacks.clear();
    newCallbacks.forEach((callback) => {
      callbacks.add(callback);
    });
  } else {
    callbacks.add(callback);
  }
}

export function dequeue<T>(
  callbacks: Set<Callback<T>>,
  callback: Callback<T> | undefined,
) {
  if (!callback) {
    return;
  }

  callbacks.delete(callback);
}

export async function unqueue<T>(callbacks: Set<Callback<T>>, value: T) {
  for (const callback of callbacks) {
    await callback(value);
  }
}
