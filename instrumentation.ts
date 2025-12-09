export async function register() {
  console.log('  > Instrumentation Hook Loaded: Server Monitoring is Active')
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    console.log('  > Backend Environment: Node.js is detected')
  }
}