function stripUndefined(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value
      .filter((item) => item !== undefined)
      .map((item) => stripUndefined(item));
  }

  if (value && typeof value === "object") {
    const next: Record<string, unknown> = {};
    for (const [key, entry] of Object.entries(value)) {
      if (entry !== undefined) {
        next[key] = stripUndefined(entry);
      }
    }
    return next;
  }

  return value;
}

export function definedFields<T extends Record<string, unknown>>(
  updates: T,
): { [K in keyof T]?: T[K] } {
  return stripUndefined(updates) as { [K in keyof T]?: T[K] };
}
