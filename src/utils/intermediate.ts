export const main = {
  relay: {
    RetryDelay: process.env.RELAY_RETRYDELAYTIMEOUT || 1000,
    MaxRetries: process.env.RELAY_MAXRETRIES || 10
  }
}