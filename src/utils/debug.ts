export function debug(...args: any[]) {
  if (process.env.DEBUG) {
    console.debug(...args)
  }
}
