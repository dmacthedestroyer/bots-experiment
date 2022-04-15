export function choice<T>(values: T[]): T | undefined {
  if (values.length === 0) {
    return undefined;
  }
  const ix = Math.floor(Math.random() * Math.floor(values.length));
  return values[ix];
}
